<template>
  <v-btn
    text="I`ve found my car"
    variant="elevated"
    @click="resetCarPosition"
  />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings-store'
import { storeToRefs } from 'pinia'

const { carPosition } = storeToRefs(useSettingsStore())

function resetCarPosition() {
  carPosition.value = null
}
</script>
