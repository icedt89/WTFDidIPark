import type { Position } from '@/common/types'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

export type KnownTheme = 'light' | 'softDark'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const { change: changeTheme } = useTheme()

    const currentTheme = ref<KnownTheme>('softDark')
    watch(currentTheme, (v) => changeTheme(v, false))

    const isLightTheme = computed(() => currentTheme.value === 'light')

    const carPosition = ref<Position | null>(null)

    const showAccuracy = ref(true)
    const showDistance = ref(true)

    function reset() {
      carPosition.value = null
      currentTheme.value = 'softDark'
      showAccuracy.value = true
      showDistance.value = true
    }

    return {
      currentTheme,
      carPosition,
      showAccuracy,
      showDistance,
      isLightTheme,
      reset,
    }
  },
  {
    persist: true,
  }
)
