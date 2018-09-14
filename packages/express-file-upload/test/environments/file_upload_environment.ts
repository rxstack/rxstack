export const file_upload_environment = {
  servers: ['express', 'mock'],
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
    port: 3210
  },
  express_file_upload: {
    enabled: true
  }
};