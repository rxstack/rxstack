export const environmentWitRsa = {
  servers: ['none'],
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
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
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
    secret: {
      public_key: __dirname +  '/../jwt-keys/public.pem',
      private_key: __dirname + '/../jwt-keys/id_rsa',
      passphrase: 'secret'
    }
  }
};
