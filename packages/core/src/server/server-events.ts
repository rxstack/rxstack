/**
 * Server Events
 */
export enum ServerEvents {
  // Dispatches when engine is initialized
  CONFIGURE = 'server.configure',
  // Dispatched when user is connected (available only in socket servers).
  CONNECTED = 'server.connected',
  // Dispatched when user is connected (available only in socket servers).
  DISCONNECTED = 'server.disconnected',
}