export const app_environment = {
  app_name: 'My App',
  servers: ['mock'],
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