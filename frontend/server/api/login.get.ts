export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const data: { access_token: string } = await $fetch(`${config.codegradeApiUrl}/login`, {
        method: 'POST',
        body: {
            username: config.codegradeUsername,
            password: config.codegradePassword,
            tenantId: config.codegradeTenantId,
        }
    });
    return data.access_token;
})

