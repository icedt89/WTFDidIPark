import { useDeviceOrientation, usePermission } from '@vueuse/core'
import { computed } from 'vue'

export function useMyHeading() {
  const { alpha } = useDeviceOrientation()
  const gyroscopePermission = usePermission('gyroscope')

  const isGyroscopePermissionDenied = computed(
    () => gyroscopePermission.value === 'denied'
  )

  const myHeading = computed<number | null>(() => {
    if (alpha.value === null) {
      return null
    }

    return (360 - alpha.value + 360) & 360
  })

  return {
    myHeading,
    isGyroscopePermissionDenied,
  }
}
