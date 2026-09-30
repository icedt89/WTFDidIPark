import type { StyleSpecification } from 'maplibre-gl'

// Shortbread v1 schema: https://shortbread-tiles.org/schema/1.0/
// No glyph service is needed: MapLibre renders labels with the app's local font.
export function createMapStyle(light: boolean): StyleSpecification {
  const colors = light
    ? {
        background: '#f3f4f2',
        land: '#e7e9e5',
        green: '#dbe6d6',
        water: '#bcd5df',
        building: '#d7d9d6',
        outline: '#bfc4c2',
        road: '#ffffff',
        mainRoad: '#f4dba9',
        path: '#9ca7a2',
        text: '#3c484e',
        halo: '#f8faf7',
        parking: '#d8e3ee',
      }
    : {
        background: '#141b22',
        land: '#1d262e',
        green: '#22382e',
        water: '#172f42',
        building: '#303c47',
        outline: '#45535f',
        road: '#4c5b68',
        mainRoad: '#7b725d',
        path: '#71828d',
        text: '#d5dde4',
        halo: '#141b22',
        parking: '#293d51',
      }

  return {
    version: 8,
    sources: {
      osm: {
        type: 'vector',
        url: 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json',
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': colors.background },
      },
      {
        id: 'land',
        type: 'fill',
        source: 'osm',
        'source-layer': 'land',
        paint: {
          'fill-color': [
            'match',
            ['get', 'kind'],
            [
              'forest',
              'grass',
              'meadow',
              'park',
              'garden',
              'scrub',
              'grassland',
              'recreation_ground',
              'cemetery',
            ],
            colors.green,
            colors.land,
          ],
        },
      },
      ...['ocean', 'water_polygons'].map((layer) => ({
        id: layer,
        type: 'fill' as const,
        source: 'osm',
        'source-layer': layer,
        paint: { 'fill-color': colors.water },
      })),
      {
        id: 'water-lines',
        type: 'line',
        source: 'osm',
        'source-layer': 'water_lines',
        paint: {
          'line-color': colors.water,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 6],
        },
      },
      {
        id: 'sites',
        type: 'fill',
        source: 'osm',
        'source-layer': 'sites',
        paint: {
          'fill-color': [
            'match',
            ['get', 'kind'],
            'parking',
            colors.parking,
            colors.land,
          ],
        },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: 'osm',
        'source-layer': 'buildings',
        minzoom: 14,
        paint: {
          'fill-color': colors.building,
          'fill-outline-color': colors.outline,
        },
      },
      {
        id: 'street-areas',
        type: 'fill',
        source: 'osm',
        'source-layer': 'street_polygons',
        paint: { 'fill-color': colors.road },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'osm',
        'source-layer': 'streets',
        filter: [
          'all',
          ['!=', ['get', 'rail'], true],
          [
            '!',
            [
              'in',
              ['get', 'kind'],
              ['literal', ['footway', 'path', 'steps', 'cycleway', 'track']],
            ],
          ],
        ],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': [
            'match',
            ['get', 'kind'],
            ['motorway', 'trunk', 'primary', 'secondary'],
            colors.mainRoad,
            colors.road,
          ],
          'line-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            5,
            0.6,
            12,
            2,
            16,
            7,
            19,
            24,
          ],
          'line-opacity': ['case', ['==', ['get', 'tunnel'], true], 0.45, 1],
        },
      },
      {
        id: 'paths',
        type: 'line',
        source: 'osm',
        'source-layer': 'streets',
        minzoom: 13,
        filter: [
          'in',
          ['get', 'kind'],
          ['literal', ['footway', 'path', 'steps', 'cycleway', 'track']],
        ],
        paint: {
          'line-color': colors.path,
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 19, 3],
          'line-dasharray': [2, 2],
        },
      },
      {
        id: 'railways',
        type: 'line',
        source: 'osm',
        'source-layer': 'streets',
        filter: ['==', ['get', 'rail'], true],
        paint: {
          'line-color': colors.path,
          'line-width': 1.5,
          'line-dasharray': [3, 3],
        },
      },
      {
        id: 'boundaries',
        type: 'line',
        source: 'osm',
        'source-layer': 'boundaries',
        paint: {
          'line-color': colors.outline,
          'line-width': 1,
          'line-dasharray': [4, 3],
        },
      },
      {
        id: 'street-labels',
        type: 'symbol',
        source: 'osm',
        'source-layer': 'street_labels',
        minzoom: 13,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-font': ['Roboto'],
          'text-size': 12,
        },
        paint: {
          'text-color': colors.text,
          'text-halo-color': colors.halo,
          'text-halo-width': 1.5,
        },
      },
      {
        id: 'house-numbers',
        type: 'symbol',
        source: 'osm',
        'source-layer': 'addresses',
        minzoom: 17,
        layout: {
          'text-field': ['get', 'housenumber'],
          'text-font': ['Roboto'],
          'text-size': 10,
        },
        paint: {
          'text-color': colors.text,
          'text-halo-color': colors.halo,
          'text-halo-width': 1,
        },
      },
      {
        id: 'places',
        type: 'symbol',
        source: 'osm',
        'source-layer': 'place_labels',
        layout: {
          'text-field': ['coalesce', ['get', 'name_de'], ['get', 'name']],
          'text-font': ['Roboto'],
          'text-size': [
            'match',
            ['get', 'kind'],
            ['capital', 'city'],
            18,
            'town',
            15,
            12,
          ],
          'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'population'], 0]],
        },
        paint: {
          'text-color': colors.text,
          'text-halo-color': colors.halo,
          'text-halo-width': 2,
        },
      },
    ],
  }
}
