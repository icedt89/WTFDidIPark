import type { Position } from '@/common/types'
import { watchImmediate } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

export type KnownTheme = 'light' | 'softDark'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const { change: changeTheme } = useTheme()

    const currentTheme = ref<KnownTheme>('softDark')
    watchImmediate(currentTheme, changeTheme)

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
      reset,
    }
  },
  {
    persist: true,
  }
)
