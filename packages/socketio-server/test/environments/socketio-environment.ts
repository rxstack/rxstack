export const socketio_environment = {
  servers: ['socketio'],
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
  socketio_server: {
    port: 3500,
  }
};