<template>
  <v-dialog max-width="600" :fullscreen="xs">
    <template #default="{ isActive }">
      <v-card title="About WTF did I park?">
        <v-card-text class="pb-0">
          <div class="mb-4">
            WTF did I park? helps to remember where you parked your car on a
            busy parking lot =).
          </div>

          <v-expansion-panels v-model="releaseNotesExpanded">
            <v-expansion-panel title="Release notes">
              <v-expansion-panel-text>
                <v-expansion-panels v-model="expanded">
                  <release-notes-item
                    is-current
                    version="v0.3.0"
                    :new-features="[
                      'Added compass',
                      'Added ability to rotate the map',
                    ]"
                  />
                  <release-notes-item
                    version="v0.2.0"
                    :new-features="['Added installability as PWA']"
                  />
                  <release-notes-item
                    version="v0.0.1"
                    :new-features="['Initial release']"
                    :miscellaneous="['Initial release']"
                  />
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="mt-3 text-center opacity-50">
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
import ReleaseNotesItem from '@/components/ReleaseNotesItem.vue'
import { ref } from 'vue'
import { appVersion } from '../environment'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

const releaseNotesExpanded = ref<boolean>(false)
const expanded = ref<number | null>(0)
</script>
