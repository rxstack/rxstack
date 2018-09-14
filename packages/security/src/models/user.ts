/**
 * Base user class
 */
import {UserInterface} from '@rxstack/core';

export class User implements UserInterface {
  /**
   * Constructor
   *
   * @param {string} username
   * @param {string} password
   * @param {string[]} roles
   */
  constructor(public username: string, public password?: string, public roles: string[] = []) {}
}