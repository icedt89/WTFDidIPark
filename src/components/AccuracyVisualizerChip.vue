<template>
  <v-chip
    class="justify-center"
    :color="color"
    :text="text"
    rounded
    size="x-small"
    v-tooltip="'Accuracy in meters'"
  />
</template>

<script setup lang="ts">
import { useMyPosition } from '@/common/my-position'
import { computed } from 'vue'

const { myPosition } = useMyPosition()

const color = computed(() => {
  if (!myPosition.value) {
    return undefined
  }

  if (myPosition.value.accuracy <= 10) {
    return 'success'
  }

  if (myPosition.value.accuracy <= 50) {
    return 'warning'
  }

  return 'error'
})
const text = computed(() => {
  if (!myPosition.value) {
    return 'n/a'
  }

  return myPosition.value.accuracy
})
</script>
