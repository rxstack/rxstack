export const environmentWithInvalidAlgorithm: any = {
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
        secret: 'my_secret',
        signature_algorithm: 'invalid',
      },
    ]
  }
};
