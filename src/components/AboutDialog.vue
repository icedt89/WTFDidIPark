<template>
  <v-dialog :max-width="600" :fullscreen="xs">
    <template #default="{ isActive }">
      <v-card title="About WTF did I park?">
        <v-card-text>
          WTF did I park? helps to remember where you parked your car on a busy
          parking lot =).
        </v-card-text>
        <div class="text-center opacity-50">
          Made with <span class="only-love">❤</span> by
          <a href="https://jan-hafner.de" target="_blank">Jan Hafner</a>
          <small class="d-block opacity-20">v{{ appVersion }}</small>
        </div>
        <v-card-actions>
          <v-btn @click="isActive.value = false" text="Close" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { appVersion } from '@/environment'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()
</script>
