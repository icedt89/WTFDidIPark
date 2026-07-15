import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles/main.sass'
import '@/styles/app.scss'
import { createVuetify } from 'vuetify'
import { en } from 'vuetify/locale'
import { softDark } from '@/plugins/soft-dark-theme'
import { light } from '@/plugins/light-theme'

export default createVuetify({
  theme: {
    defaultTheme: 'softDark',
    themes: {
      softDark,
      light,
    },
  },
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
  defaults: {
    VTooltip: {
      openDelay: 500,
    },
    VCard: {
      border: true,
      color: 'rgb(var(--v-theme-background))',
    },
    VCheckbox: {
      color: 'primary',
      hideDetails: true,
      density: 'comfortable',
    },
  },
})
