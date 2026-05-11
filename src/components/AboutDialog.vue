<template>
  <v-dialog max-width="600" :fullscreen="xs">
    <template #default="{ isActive }">
      <v-card title="About WTF did I park?">
        <v-card-text class="pb-0">
          <div class="mb-4">
            WTF did I park? helps to remember where you parked your car on a
            busy parking lot =).
          </div>

          <div class="mt-10 text-center opacity-50">
            Made with <span class="heart-red">❤</span> by
            <a href="https://jan-hafner.de" target="_blank">Jan Hafner</a>
            <small class="d-block opacity-20">v{{ appVersion }}</small>
          </div>
        </v-card-text>
        <v-card-actions>
          <close-dialog-button @click="isActive.value = false" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { appVersion } from '../environment'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()
</script>
