// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            proxyBaseUrl: ""
        }
    },
    css: ['~/assets/styles/main.scss'],
    ssr: false
})
