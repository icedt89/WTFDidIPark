import { useGeolocation, usePermission } from '@vueuse/core'
import { computed } from 'vue'
import { isConsideredNull, type Position } from '@/common/types'

export function useMyPosition() {
  const { coords } = useGeolocation()
  const geolocationPermission = usePermission('geolocation')

  const isGeolocationPermissionDenied = computed(
    () => geolocationPermission.value === 'denied'
  )

  const myPosition = computed<Position | null>(() => {
    if (isConsideredNull(coords.value)) {
      return null
    }

    return {
      latitude: coords.value.latitude,
      longitude: coords.value.longitude,
      accuracy: Math.round(coords.value.accuracy),
    }
  })

  return {
    myPosition,
    isGeolocationPermissionDenied,
  }
}
