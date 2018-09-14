export const express_server_environment = {
  servers: ['express'],
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
  express_server: {
    port: 3200,
    prefix: '/api'
  }
};