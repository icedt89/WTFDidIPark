export type Position = {
  latitude: number
  longitude: number
  accuracy: number
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
