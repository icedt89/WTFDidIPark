<template>
  <div class="map w-100 fill-height" ref="mapElement" />
</template>

<style lang="scss">
.leaflet-container .leaflet-control-attribution {
  opacity: 0.4;
}

.v-theme--light .leaflet-container .leaflet-control-attribution {
  background-color: transparent;
}

.v-theme--softDark .leaflet-container .leaflet-control-attribution {
  background-color: #000;
  color: #fff;
}
</style>

<script setup lang="ts">
import { useMyCarDistance } from '@/common/distance'
import { useMyPosition } from '@/common/my-position'
import { toCoordsPair, toCoordsPairs, type Position } from '@/common/types'
import { useSettingsStore } from '@/stores/settings-store'
import { watchImmediate, watchOnce } from '@vueuse/core'
import L from 'leaflet'
import { storeToRefs } from 'pinia'
import { computed, shallowRef, useTemplateRef } from 'vue'
// Rotate plugin
import 'leaflet-rotate'

interface Props {
  initialPosition: [x: number, y: number]
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

const { currentTheme, carPosition } = storeToRefs(useSettingsStore())
const tileLayerSource = computed(() =>
  currentTheme.value === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
)
const { myPosition } = useMyPosition()
const { distance } = useMyCarDistance()

const distanceInMeters = computed(() => {
  if (!props.showDistance) {
    return null
  }

  return distance.value
})

const mapElement = useTemplateRef('mapElement')
const map = shallowRef<L.Map | null>(null)

const mainTileLayer: L.TileLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende | &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
)
watchImmediate(tileLayerSource, (tls) => {
  mainTileLayer.setUrl(tls)
})

const myPositionMarker: L.Marker = L.marker([0, 0], {
  opacity: 0,
  icon: L.icon({
    iconUrl: 'marker-icon-me.png',
    // These defaults where taken from Leaflet internals, because the custom markers are based on the default Leaflet markers.
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'marker-shadow.png',
  }),
}).addEventListener('click', () => {
  if (!!myPosition.value && !!map.value) {
    map.value.setView(toCoordsPair(myPosition.value), 19)
  }
})
watchImmediate(myPosition, (mp) => {
  if (!mp) {
    myPositionMarker.setOpacity(0)

    return
  }

  myPositionMarker.setLatLng(toCoordsPair(mp))
  myPositionMarker.setOpacity(1)
})

const carPositionMarker: L.Marker = L.marker([0, 0], {
  opacity: 0,
  icon: L.icon({
    iconUrl: 'marker-icon-my-car.png',
    // These defaults where taken from Leaflet internals, because the custom markers are based on the default Leaflet markers.
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'marker-shadow.png',
  }),
}).addEventListener('click', () => {
  if (!!carPosition.value && !!map.value) {
    map.value.setView(toCoordsPair(carPosition.value), 19)
  }
})
watchImmediate(carPosition, (cp) => {
  if (!cp) {
    carPositionMarker.setOpacity(0)

    return
  }

  carPositionMarker.setLatLng(toCoordsPair(cp))
  carPositionMarker.setOpacity(1)
})

const distanceLine: L.Polyline = L.polyline([], {
  opacity: 0,
  color: '#FF2121',
  weight: 3,
}).bindPopup('', { autoClose: true })
watchImmediate(
  [myPosition, carPosition, distanceInMeters, () => props.showDistance],
  ([mp, cp, dim, sd]) => {
    if (!mp || !cp || !dim || !sd) {
      distanceLine.setStyle({
        opacity: 0,
      })

      return
    }

    distanceLine.setLatLngs([toCoordsPair(mp), toCoordsPair(cp)])
    distanceLine.setStyle({
      opacity: 0.5,
    })
    distanceLine.setPopupContent(Math.floor(dim).toString() + 'm')
  }
)

const myPositionAccuracyCircle: L.Circle = L.circle([0, 0], {
  radius: 0,
  opacity: 0,
  color: '#3178c6',
  fillColor: '#3178c6',
  fillOpacity: 0,
  weight: 1,
})
watchImmediate([myPosition, () => props.showAccuracy], ([mp, sa]) => {
  if (!mp || !sa) {
    myPositionAccuracyCircle.setStyle({
      opacity: 0,
      fillOpacity: 0,
    })

    return
  }

  myPositionAccuracyCircle.setLatLng(toCoordsPair(mp))
  myPositionAccuracyCircle.setRadius(mp.accuracy)
  myPositionAccuracyCircle.setStyle({
    opacity: 0.5,
    fillOpacity: 0.1,
  })
})

const carPositionAccuracyCircle: L.Circle = L.circle([0, 0], {
  radius: 0,
  opacity: 0,
  color: '#FF2121',
  fillColor: '#FF2121',
  fillOpacity: 0,
  weight: 1,
})
watchImmediate([carPosition, () => props.showAccuracy], ([cp, sa]) => {
  if (!cp || !sa) {
    carPositionAccuracyCircle.setStyle({
      opacity: 0,
      fillOpacity: 0,
    })

    return
  }

  carPositionAccuracyCircle.setLatLng(toCoordsPair(cp))
  carPositionAccuracyCircle.setRadius(cp.accuracy)
  carPositionAccuracyCircle.setStyle({
    opacity: 0.5,
    fillOpacity: 0.1,
  })
})

watchOnce(
  mapElement,
  (me) => {
    if (!me) {
      return
    }

    const m = (map.value = L.map(me, {
      zoomControl: false,
      // Rotate plugin
      rotate: true,
      rotateControl: false,
      touchRotate: true,
      shiftKeyRotate: true,
    }))

    mainTileLayer.addTo(m)
    carPositionMarker.addTo(m).setZIndexOffset(1)
    carPositionAccuracyCircle.addTo(m)
    myPositionMarker.addTo(m).setZIndexOffset(0)
    myPositionAccuracyCircle.addTo(m)
    distanceLine.addTo(m)

    if (props.initialPosition) {
      m.setView(props.initialPosition, props.initialZoom)
    }

    m.on('rotate', () => {
      const bearing = m.getBearing()

      emit('rotate', bearing)
    })
  },
  { flush: 'post' }
)

function centerTo(position: Position, zoom: number = 19) {
  if (!map.value) {
    return
  }

  map.value.setView(toCoordsPair(position), zoom)
}

function rotate(bearing: number) {
  if (!map.value) {
    return
  }

  map.value.setBearing(bearing)
}

function fitTo(positions: Position[]) {
  if (!map.value) {
    return
  }

  map.value.fitBounds(L.latLngBounds(toCoordsPairs(positions)), {
    padding: [20, 20],
  })
}

defineExpose({
  centerTo,
  fitTo,
  rotate,
})
</script>
