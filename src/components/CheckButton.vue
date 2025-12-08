<template>
  <v-btn
    v-bind="$attrs"
    :variant="internalVariant"
    :color="internalColor"
    :icon="internalIcon"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { VBtn } from 'vuetify/components/VBtn'
import type { IconValue } from 'vuetify/lib/composables/icons.d.ts'

type ButtonVariant =
  | 'elevated'
  | 'flat'
  | 'outlined'
  | 'plain'
  | 'text'
  | 'tonal'
type VBtnProps = InstanceType<typeof VBtn>['$props']

interface Props {
  checkedVariant?: ButtonVariant
  checkedColor?: string
  checkedIcon?: boolean | IconValue
}

const props = withDefaults(defineProps<Props>(), {
  checkedColor: 'primary',
})
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
const attrs = useAttrs()

const isChecked = defineModel<boolean>('isChecked', {
  required: true,
})

const baseVariant = computed(() => <VBtnProps['variant']>attrs.variant)
const baseColor = computed(() => 'background')
const baseIcon = computed(() => <VBtnProps['icon']>attrs.icon)

const internalVariant = computed<ButtonVariant | undefined>(() =>
  isChecked.value && !!props.checkedVariant
    ? props.checkedVariant
    : baseVariant.value
)

const internalColor = computed<string | undefined>(() =>
  isChecked.value && !!props.checkedColor ? props.checkedColor : baseColor.value
)

const internalIcon = computed<boolean | IconValue | undefined>(() =>
  isChecked.value && !!props.checkedIcon ? props.checkedIcon : baseIcon.value
)

function handleClick(e: MouseEvent) {
  isChecked.value = !isChecked.value
  emit('click', e)
}
</script>
