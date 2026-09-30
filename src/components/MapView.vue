<template>
  <div class="map fill-height w-100" ref="mapElement" />
</template>

<style lang="scss">
.map .maplibregl-ctrl-attrib {
  background-color: rgba(255, 255, 255, 0.85);
}

.map .maplibregl-popup-content {
  color: #141b22;
}

.v-theme--softDark .map .maplibregl-ctrl-attrib {
  background-color: #141b22;
  color: #d5dde4;

  a {
    color: inherit;
  }
}

.map-position-marker {
  width: 25px;
  height: 41px;
  border: 0;
  padding: 0;
  background: transparent no-repeat center / contain;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { createMapStyle } from '@/common/map-style'
import { useMyPosition } from '@/common/my-position'
import type { Position } from '@/common/types'
import { useSettingsStore } from '@/stores/settings-store'
import {
  LngLat,
  LngLatBounds,
  Map,
  Marker,
  MercatorCoordinate,
  Popup,
  type GeoJSONSource,
} from 'maplibre-gl'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import { storeToRefs } from 'pinia'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
  watch,
} from 'vue'

interface Props {
  initialPosition: [longitude: number, latitude: number]
  initialZoom?: number
  showAccuracy?: boolean
  showDistance?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialZoom: 13,
  showAccuracy: true,
  showDistance: true,
})

const emit = defineEmits<{
  (e: 'rotate', bearing: number): void
}>()

const { isLightTheme, carPosition } = storeToRefs(useSettingsStore())
const { myPosition } = useMyPosition()
const mapElement = useTemplateRef('mapElement')
let map: Map | null = null
let styleLoaded = false
const carColor = '#FF2121'
let myMarker: Marker | undefined
let carMarker: Marker | undefined
const distancePopup = new Popup()
const distanceData = computed(() => {
  if (!props.showDistance || !myPosition.value || !carPosition.value) {
    return null
  }

  const from = coordinates(myPosition.value)
  const to = coordinates(carPosition.value)
  const distance = LngLat.convert(from).distanceTo(LngLat.convert(to))

  if (!distance) {
    return null
  }

  return {
    coordinates: [from, to],
    text: `${Math.floor(distance)}m`,
  }
})

function coordinates(position: Position): [number, number] {
  return [position.longitude, position.latitude]
}

function accuracyCircle(position: Position, color: string): Feature<Point> {
  const center = coordinates(position)
  // Mercator units account for latitude; MapLibre's world is 512px at zoom 0.
  const radius =
    position.accuracy *
    MercatorCoordinate.fromLngLat(center).meterInMercatorCoordinateUnits() *
    512

  return {
    type: 'Feature',
    properties: { color, radius },
    geometry: { type: 'Point', coordinates: center },
  }
}

function overlayData(): FeatureCollection<Point | LineString> {
  const features: Feature<Point | LineString>[] = []
  if (props.showAccuracy) {
    if (myPosition.value) {
      features.push(accuracyCircle(myPosition.value, '#3178c6'))
    }

    if (carPosition.value) {
      features.push(accuracyCircle(carPosition.value, carColor))
    }
  }

  if (distanceData.value) {
    features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: distanceData.value.coordinates,
      },
    })
  }

  return { type: 'FeatureCollection', features }
}

function updateMarkers() {
  const m = map
  if (!m) {
    return
  }

  for (const [marker, position] of [
    [myMarker, myPosition.value],
    [carMarker, carPosition.value],
  ] as const) {
    if (!marker) {
      continue
    }

    if (position) {
      marker.setLngLat(coordinates(position))

      if (!marker.getElement().parentElement) {
        marker.addTo(m)
      }
    } else {
      marker.remove()
    }
  }
}

function updateOverlays() {
  const source = map?.getSource<GeoJSONSource>('positions')
  source?.setData(overlayData())
}

function addOverlays(m: Map) {
  m.addSource('positions', { type: 'geojson', data: overlayData() })

  m.addLayer({
    id: 'accuracy',
    type: 'circle',
    source: 'positions',
    filter: ['==', '$type', 'Point'],
    paint: {
      // Exponential interpolation gives radius * 2^zoom, including fractional zooms.
      'circle-radius': [
        'interpolate',
        ['exponential', 2],
        ['zoom'],
        0,
        ['get', 'radius'],
        24,
        ['*', ['get', 'radius'], 2 ** 24],
      ],
      'circle-color': ['get', 'color'],
      'circle-opacity': 0.1,
      'circle-stroke-color': ['get', 'color'],
      'circle-stroke-opacity': 0.5,
      'circle-stroke-width': 1,
    },
  })

  m.addLayer({
    id: 'distance',
    type: 'line',
    source: 'positions',
    filter: ['==', '$type', 'LineString'],
    paint: { 'line-color': carColor, 'line-width': 3, 'line-opacity': 0.5 },
  })

  m.addLayer({
    id: 'distance-hit-area',
    type: 'line',
    source: 'positions',
    filter: ['==', '$type', 'LineString'],
    paint: { 'line-width': 16, 'line-opacity': 0 },
  })
}

function createMarker(
  image: string,
  label: string,
  getPosition: () => Position | null
) {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = 'map-position-marker'
  element.setAttribute('aria-label', label)
  element.style.backgroundImage = `url('${image}')`
  element.addEventListener('click', (event) => {
    event.stopPropagation()

    const position = getPosition()
    if (position) {
      centerTo(position)
    }
  })

  return new Marker({ element, anchor: 'bottom', offset: [0, 7] })
}

onMounted(() => {
  const element = mapElement.value
  if (!element) {
    return
  }

  const m = (map = new Map({
    container: element,
    style: createMapStyle(isLightTheme.value),
    center: props.initialPosition,
    // Keep the public zoom API on the original 256px scale; MapLibre uses 512px.
    zoom: props.initialZoom - 1,
    maxZoom: 20,
    maxPitch: 0,
    touchPitch: false,
    attributionControl: { compact: false },
    renderWorldCopies: false,
  }))

  myMarker = createMarker(
    'marker-icon-me.png',
    'My position',
    () => myPosition.value
  )

  carMarker = createMarker(
    'marker-icon-my-car.png',
    'My car',
    () => carPosition.value
  )

  carMarker.getElement().style.zIndex = '1'

  updateMarkers()
  m.once('style.load', () => {
    styleLoaded = true
    updateTheme()
    addOverlays(m)
  })
  // Preserve the clockwise map rotation expected by the compass component.
  m.on('rotate', () => emit('rotate', -m.getBearing()))
  m.on('click', 'distance-hit-area', (event) => {
    if (distanceData.value) {
      distancePopup
        .setLngLat(event.lngLat)
        .setText(distanceData.value.text)
        .addTo(m)
    }
  })
})

function updateTheme() {
  const m = map
  if (!m || !styleLoaded) {
    return
  }

  // Reuse the palette without replacing sources or overlay layers.
  for (const layer of createMapStyle(isLightTheme.value).layers) {
    for (const [property, value] of Object.entries(layer.paint ?? {})) {
      m.setPaintProperty(
        layer.id,
        property as Parameters<Map['setPaintProperty']>[1],
        value
      )
    }
  }
}

watch(isLightTheme, updateTheme)

watch([myPosition, carPosition], updateMarkers)

watch(
  [myPosition, carPosition, () => props.showAccuracy, () => props.showDistance],
  updateOverlays
)

// Keep the popup tied to the clicked line; accuracy-only changes leave it open.
watch(
  [
    () => myPosition.value?.longitude,
    () => myPosition.value?.latitude,
    () => carPosition.value?.longitude,
    () => carPosition.value?.latitude,
    () => props.showDistance,
  ],
  () => distancePopup.remove()
)

onBeforeUnmount(() => {
  distancePopup.remove()

  myMarker?.remove()
  carMarker?.remove()

  map?.remove()
  map = null
})

function centerTo(position: Position, zoom: number = 19) {
  map?.jumpTo({ center: coordinates(position), zoom: zoom - 1 })
}

function rotate(bearing: number) {
  map?.setBearing(-bearing)
}

function fitTo(positions: Position[]) {
  if (!map || !positions.length) {
    return
  }

  const bounds = new LngLatBounds()

  for (const position of positions) {
    bounds.extend(coordinates(position))
  }

  map.fitBounds(bounds, { padding: 20, duration: 0, maxZoom: 18 })
}

defineExpose({ centerTo, fitTo, rotate })
</script>
