export const environmentWitRsa: any = {
  servers: [],
  user_providers: {
    in_memory: {
      users: [
        {
          username: 'admin',
          password: 'admin',
          roles: ['ADMIN']
        },
        {
          username: 'user',
          password: 'user',
          roles: ['USER']
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
    default_issuer: 'default',
    secret_configurations: [
      {
        issuer: 'default',
        secret: {
          public_key: __dirname +  '/../jwt-keys/public.pem',
          private_key: __dirname + '/../jwt-keys/id_rsa',
          passphrase: 'secret'
        }
      }
    ]
  }
};
