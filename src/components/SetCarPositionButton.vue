<template>
  <v-btn
    :disabled="!myPosition"
    text="Remember current location"
    :variant="!!myPosition ? 'elevated' : 'tonal'"
    @click="setCarPosition"
  />
</template>

<script setup lang="ts">
import { useMyPosition } from '@/common/my-position'
import { useSettingsStore } from '@/stores/settings-store'
import { storeToRefs } from 'pinia'

const { myPosition } = useMyPosition()

const { carPosition } = storeToRefs(useSettingsStore())

function setCarPosition() {
  carPosition.value = myPosition.value
}
</script>
