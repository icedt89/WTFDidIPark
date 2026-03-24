/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { md3 } from 'vuetify/blueprints'
import 'vuetify/styles/main.sass'

// Composables
import { createVuetify } from 'vuetify'
import { en } from 'vuetify/locale'
import { softDark } from './soft-dark-theme'
import { light } from './light-theme'
import { VBtn, VAvatar, VList } from 'vuetify/components'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'softDark',
    themes: {
      softDark,
      light,
    },
  },
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'en',
    messages: { en },
  },
  aliases: {
    CloseDialogButton: VBtn,
    AppIconAvatar: VAvatar,
    AppMainMenu: VList,
  },
  defaults: {
    CloseDialogButton: {
      text: 'Close',
      color: 'on-background',
      variant: 'text',
    },
    AppIconAvatar: {
      border: true,
      variant: 'text',
      size: 44,
      class: 'mr-1',
    },
    AppMainMenu: {
      border: true,
      activatable: true,
      density: 'compact',
      slim: true,
      style: {
        'background-color': 'rgb(var(--v-theme-background))',
        padding: 0,
      },
    },

    VTooltip: {
      openDelay: 500,
    },
    VAppBar: {
      border: 'b-sm',
    },
    VBtn: {
      rounded: 'xs',
    },
    VContainer: {
      fluid: true,
    },
    VCard: {
      border: true,
      color: 'rgb(var(--v-theme-background))',
      rounded: 'xs',
    },
    VExpansionPanels: {
      static: true,
      multiple: true,
    },
    VExpansionPanel: {
      style: {
        'background-color': 'rgb(var(--v-theme-background))',
        border: '1px solid rgb(var(--v-border-color), var(--v-border-opacity))',
      },
    },
    VCheckbox: {
      color: 'primary',
      hideDetails: true,
      density: 'comfortable',
    },
  },
})
