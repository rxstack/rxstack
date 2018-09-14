export enum AuthenticationEvents {
  AUTHENTICATION_SUCCESS = 'security.authentication.success',
  AUTHENTICATION_FAILURE = 'security.authentication.failure',
  SOCKET_AUTHENTICATION_SUCCESS = 'security.socket_authentication.success',
  SOCKET_UNAUTHENTICATION_SUCCESS = 'security.socket_unauthentication.success',
  LOGIN_SUCCESS = 'security.login.success',
  LOGOUT_SUCCESS = 'security.logout.success',
  REFRESH_TOKEN_SUCCESS = 'security.refresh_token.success',
}