import { useSettingsStore } from '@/stores/settings-store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMyPosition } from '@/common/my-position'
import { toCoordsPair } from '@/common/types'
import { latLng } from 'leaflet'

export function useMyCarDistance() {
  const { carPosition } = storeToRefs(useSettingsStore())
  const { myPosition } = useMyPosition()

  const distance = computed(() => {
    if (!carPosition.value || !myPosition.value) {
      return null
    }

    return latLng(toCoordsPair(myPosition.value)).distanceTo(
      latLng(toCoordsPair(carPosition.value))
    )
  })

  return {
    distance,
  }
}
