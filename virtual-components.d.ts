/* eslint-disable */
// @ts-nocheck
// Workaround for virtual vuetify components unknown to vscode
// biome-ignore lint: disable
export {}

/* prettier-ignore */
declare module '@vue/runtime-dom' {
  export interface GlobalComponents {
    CloseDialogButton: typeof import('vuetify/components')['VBtn']
    AppIconAvatar: typeof import('vuetify/components')['VAvatar']
    AppMainMenu: typeof import('vuetify/components')['VList']
  }
}
