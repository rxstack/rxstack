import {HttpDefinition, WebSocketDefinition} from '@rxstack/core';

export const findHttpDefinition = function (data: HttpDefinition[], routeName: string) {
  const def = data.find((def: HttpDefinition) =>
    def.name === routeName);
  if (!def)
    throw new Error('HttpDefinition definition not found.');
  return def;
};

export const findWebSocketDefinition = function (data: WebSocketDefinition[], routeName: string) {
  const def = data.find((def: WebSocketDefinition) =>
    def.name === routeName);
  if (!def)
    throw new Error('WebSocketDefinition definition not found.');
  return def;
};