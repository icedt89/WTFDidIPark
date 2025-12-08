export type Position = {
  latitude: number
  longitude: number
  accuracy: number
}

export function toCoordsPairs(positions: Position[]): [x: number, y: number][] {
  return positions.map((p) => toCoordsPair(p))
}

export function toCoordsPair(position: Position): [x: number, y: number] {
  return [position.latitude, position.longitude]
}

interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
}

export function isConsideredNull(
  geolocationCoordinates: GeolocationCoordinates | null
): geolocationCoordinates is null {
  return (
    geolocationCoordinates === null ||
    (geolocationCoordinates.accuracy === 0 &&
      !Number.isFinite(geolocationCoordinates.latitude) &&
      !Number.isFinite(geolocationCoordinates.longitude))
  )
}
