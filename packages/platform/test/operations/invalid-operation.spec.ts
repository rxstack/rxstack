import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS_INVALID} from '../PLATFORM_APP_OPTIONS_INVALID';
import {Exception} from '@rxstack/exceptions';

describe('Platform:Operation:Invalid', () => {

  it('@app_task_invalid ', async () => {
    let exception: Exception;
    try {
      const app = new Application(PLATFORM_APP_OPTIONS_INVALID);
      await app.run();
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(Exception);
  });
});
