<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <app-icon-avatar>
          <v-icon :icon="mdiCar" size="30" />
        </app-icon-avatar>
        WTF did I park?
      </v-app-bar-title>
      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn :icon="mdiDotsVertical" v-bind="props" />
          </template>

          <template #default>
            <app-main-menu>
              <switch-theme-list-item />
              <v-divider />
              <v-list-item title="Reset App">
                <reset-app-state-dialog activator="parent" />

                <template #prepend>
                  <!-- Reserve space for item without icon -->
                  <div style="width: 44px"></div>
                </template>
              </v-list-item>
              <v-divider />
              <v-list-item :prepend-icon="mdiInformationOutline" title="About">
                <about-dialog activator="parent" />
              </v-list-item>
            </app-main-menu>
          </template>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height pa-0 position-relative">
        <map-view
          :initial-position="[52.52, 13.405]"
          :show-accuracy="showAccuracy"
          :show-distance="showDistance"
          style="z-index: 0"
          ref="map"
        />

        <div
          class="position-absolute top-0 right-0 mt-2 mr-2 d-flex flex-column ga-2"
          style="z-index: 1"
        >
          <v-btn
            :disabled="!canCenterMyPosition"
            :icon="mdiCrosshairsGps"
            variant="elevated"
            density="comfortable"
            v-tooltip="'Center my position'"
            @click="centerMyPosition"
          />
          <accuracy-visualizer-chip />
          <v-btn
            :disabled="!canCenterDistance"
            :icon="mdiFitToScreenOutline"
            variant="elevated"
            density="comfortable"
            v-tooltip="'Center distance'"
            @click="centerDistance"
          />
          <check-button
            v-model:is-checked="showAccuracy"
            :disabled="isGeolocationPermissionDenied"
            :icon="mdiMapMarkerCircle"
            density="comfortable"
            v-tooltip="'Show accuracy'"
          />
          <check-button
            v-model:is-checked="showDistance"
            :disabled="isGeolocationPermissionDenied"
            :icon="mdiMapMarkerDistance"
            density="comfortable"
            v-tooltip="'Show distance'"
          />
          <v-avatar
            v-if="myHeading !== null"
            color="primary"
            :style="`transform: rotate(${myHeading ?? 0}deg)`"
          >
            <v-icon :icon="mdiNavigation" />
          </v-avatar>
        </div>

        <div
          align="center"
          class="position-absolute bottom-0 w-100 mb-5 mx-2"
          style="z-index: 1"
        >
          <set-car-position-button v-if="!carPosition" />
          <car-found-button v-else />
        </div>

        <v-overlay
          :model-value="isGeolocationPermissionDenied"
          class="align-center justify-center"
          contained
          persistent
          :close-on-back="false"
          :close-on-content-click="false"
          :opacity="0.5"
        >
          <v-alert type="info" color="white" variant="elevated"
            >To use WTF did I park? you need to grant permission to use your
            location.</v-alert
          >
        </v-overlay>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {
  mdiCar,
  mdiDotsVertical,
  mdiInformationOutline,
  mdiCrosshairsGps,
  mdiMapMarkerCircle,
  mdiMapMarkerDistance,
  mdiFitToScreenOutline,
  mdiNavigation,
} from '@mdi/js'
import AboutDialog from '@/components/AboutDialog.vue'
import ResetAppStateDialog from '@/components/ResetAppStateDialog.vue'
import SwitchThemeListItem from '@/components/SwitchThemeListItem.vue'
import MapView from '@/components/MapView.vue'
import SetCarPositionButton from '@/components/SetCarPositionButton.vue'
import { computed, useTemplateRef, watch } from 'vue'
import { useMyPosition } from '@/common/my-position'
import CheckButton from '@/components/CheckButton.vue'
import { useSettingsStore } from './stores/settings-store'
import { storeToRefs } from 'pinia'
import { useMyHeading } from './common/my-heading'
import { useMyCarDistance } from './common/distance'
import AccuracyVisualizerChip from './components/AccuracyVisualizerChip.vue'
import CarFoundButton from './components/CarFoundButton.vue'

const map = useTemplateRef<typeof MapView>('map')

const { myPosition, isGeolocationPermissionDenied } = useMyPosition()
const { showAccuracy, showDistance, carPosition } =
  storeToRefs(useSettingsStore())
const { myHeading } = useMyHeading()
const { distance } = useMyCarDistance()

const canCenterMyPosition = computed(() => !!map.value && !!myPosition.value)
const canCenterDistance = computed(() => !!map.value && distance.value !== null)

function centerMyPosition() {
  if (!map.value || !myPosition.value) {
    return
  }

  map.value.centerTo(myPosition.value)
}

function centerDistance() {
  if (!map.value || !myPosition.value || !carPosition.value) {
    return
  }

  map.value.fitTo([myPosition.value, carPosition.value])
}

const _ = watch(
  [myPosition, map],
  ([mp, m]) => {
    if (!mp || !m) {
      return
    }

    m.centerTo(mp)
    _()
  },
  {
    flush: 'post',
  }
)
</script>
