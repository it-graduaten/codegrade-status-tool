// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        codegradeApiUrl: "",
        codegradeUsername: "",
        codegradePassword: "",
        codegradeTenantId: "",
    },
    css: ['~/assets/styles/main.scss'],
    app: {
        head: {

            title: 'CodeGrade Status Tool',
            htmlAttrs: {
                class: "h-100",
                lang: "en"
            },
            bodyAttrs: {
                class: "h-100"
            }
        }
    }
})
