// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      // katex css
      link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css' }],
      title: 'Algorithm Wiki',
    }
  },
  routeRules: {
    // swr for 1 minute
    "/api/**": { proxy: 'http://128.52.140.59:3001/**' },
  },


  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    'nuxt-highcharts',
  ],




  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano:
        process.env.NODE_ENV === 'production'
          ? { preset: ['default', { discardComments: { removeAll: true } }] }
          : false, // disable cssnano when not in production
    },
  },


  runtimeConfig: {
    public: {
      API_URL: '',
    }
  },
  googleFonts: {
    families: {
      Inter: true,

    }
  },
})
