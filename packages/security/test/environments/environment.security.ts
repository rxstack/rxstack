export const environmentSecurity: any = {
  servers: [],
  user_providers: {
    in_memory: {
      users: [
        {
          username: 'admin',
          password: 'admin',
          roles: ['ROLE_ADMIN']
        },
        {
          username: 'user',
          password: 'user',
          roles: ['ROLE_USER']
        }
      ]
    }
  },
  security: {
    token_extractors: {
      query_parameter: {
        enabled: true,
      },
      authorization_header: {
        enabled: true,
      }
    },
    local_authentication: true,
    ttl: 1,
    default_issuer: 'default',
    secret_configurations: [
      {
        issuer: 'default',
        secret: 'my_secret',
        signature_algorithm: 'HS512',
      },
      {
        issuer: 'invalid',
        secret: 'my_secret',
        signature_algorithm: 'invalid',
      },
      {
        issuer: 'secret_with_rsa',
        secret: {
          public_key: __dirname +  '/../jwt-keys/public.pem',
          private_key: __dirname + '/../jwt-keys/id_rsa',
          passphrase: 'secret'
        }
      }
    ]
  }
};
