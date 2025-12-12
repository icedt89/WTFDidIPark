<template>
  <span class="compass" :style="{ backgroundColor: color }" />
</template>

<style lang="scss" scoped>
.compass {
  width: 36px;
  height: 36px;
  display: inline-block;
  -webkit-mask: url('/compass-north-outline.svg') no-repeat center / contain;
  mask: url('/compass-north-outline.svg') no-repeat center / contain;
}
</style>

<script setup lang="ts">
interface Props {
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: 'rgb(var(--v-theme-primary))',
})
</script>
