// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // exp
  experimental: {
    localLayerAliases: true,
  },
  devtools: { enabled: false },

  extends: ['@nuxt-awesome/theme'],

  modules: [
    '@nuxtjs/supabase',
    'nuxt-headlessui',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    'nuxt-svgo',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@primevue/nuxt-module',
  ],
  i18n: {
    vueI18n: './i18n.config.ts', // if you are using custom path, default
  },
  colorMode: {
    // classSuffix: '',
    preference: 'dark', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // // module::color-mode
  // colorMode: {
  //   classSuffix: '',
  // },

  // module::headlessui
  headlessui: {
    prefix: 'Headless',
  },
  supabase: {
    redirect: true,
  },
})
