export const application_environment = {
  app_name: 'My App',
  servers: ['noop-http', 'noop-websocket'],
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
  test_module_1: {
    name: 'test1 module name'
  }
};