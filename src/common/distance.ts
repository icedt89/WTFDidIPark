import { useSettingsStore } from '@/stores/settings-store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMyPosition } from '@/common/my-position'
import { LngLat } from 'maplibre-gl'

export function useMyCarDistance() {
  const { carPosition } = storeToRefs(useSettingsStore())
  const { myPosition } = useMyPosition()

  const distance = computed(() => {
    if (!carPosition.value || !myPosition.value) {
      return null
    }

    return new LngLat(
      myPosition.value.longitude,
      myPosition.value.latitude
    ).distanceTo(
      new LngLat(carPosition.value.longitude, carPosition.value.latitude)
    )
  })

  return {
    distance,
  }
}
