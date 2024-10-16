import {describe, expect, it} from '@jest/globals';
import {Request} from '../../src/kernel/models/request';
import {HeaderBag} from '../../src/kernel/models/header-bag';
import {ParameterBag} from '../../src/kernel/models/parameter-bag';
import {AttributeBag} from '../../src/kernel/models/attribute-bag';
import {Response} from '../../src/kernel/models/response';

describe('Models', () => {
  it('should initialize request', async () => {
    const request = new Request('HTTP');
    expect(request.transport).toBe('HTTP');
    expect(request.headers).toBeInstanceOf(HeaderBag);
    expect(request.params).toBeInstanceOf(ParameterBag);
    expect(request.attributes).toBeInstanceOf(AttributeBag);
  });

  it('should initialize response', async () => {
    const response = new Response('content');
    expect(response.content).toBe('content');
    expect(response.statusCode).toBe(200);
    expect(response.headers).toBeInstanceOf(HeaderBag);
  });

  it('should import and export values from ParameterBag', async () => {
    const bag = new ParameterBag({'id': 1});
    expect(JSON.stringify(bag.toObject())).toBe(JSON.stringify({'id': 1}));
  });
});
