export default {

    oidc: {
        clientId: '<YOUR-CLIENT-ID>',
        issuer: 'https://<YOUR-OKTA-DEV-DOMAIN>/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }
}