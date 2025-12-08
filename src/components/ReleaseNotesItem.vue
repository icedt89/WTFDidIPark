<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      {{ version }}
      <v-chip
        v-if="isCurrent"
        text="Current"
        color="success"
        rounded
        size="x-small"
        class="ml-2"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <template v-if="newFeatures && newFeatures.length">
        <h5>New</h5>
        <ul>
          <li v-for="(item, index) in newFeatures" :key="index" class="ml-4">
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-if="bugfixes && bugfixes.length">
        <h5>Fixes</h5>
        <ul>
          <li v-for="(item, index) in bugfixes" :key="index" class="ml-4">
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-if="miscellaneous && miscellaneous.length">
        <h5>Miscellaneous</h5>
        <ul>
          <li v-for="(item, index) in miscellaneous" :key="index" class="ml-4">
            {{ item }}
          </li>
        </ul>
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
defineProps<{
  version: string
  isCurrent?: boolean
  newFeatures?: string[]
  bugfixes?: string[]
  miscellaneous?: string[]
}>()
</script>
