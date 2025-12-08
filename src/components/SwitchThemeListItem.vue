<template>
  <v-list-item
    :prepend-icon="mdiThemeLightDark"
    :title="title"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { mdiThemeLightDark } from '@mdi/js'
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings-store'
import { storeToRefs } from 'pinia'

const { current } = useTheme()
const { currentTheme } = storeToRefs(useSettingsStore())

const title = computed(() => {
  if (current.value.dark) {
    return 'Set light theme'
  }

  return 'Set dark theme'
})

function toggleTheme() {
  currentTheme.value = current.value.dark ? 'light' : 'softDark'
}
</script>
