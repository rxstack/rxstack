export const environmentSecurity = {
  servers: ['none'],
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
    ttl: 100,
    secret: 'my_secret',
    signature_algorithm: 'HS512'
  }
};
