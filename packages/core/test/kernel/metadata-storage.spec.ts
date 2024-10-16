import 'reflect-metadata';
import {describe, expect, it} from '@jest/globals';
import {GenericMetadataStorage} from '../../src/kernel/metadata/generic-metadata-storage';
import {WebSocketMetadata} from '../../src/kernel/metadata';
import {AnnotatedController} from './fixtures/annotated.controller';

describe('MetadataStorage', () => {
  const storage = new GenericMetadataStorage<WebSocketMetadata>();
  it('should have zero items', async () => {
    expect(storage.all().length).toBe(0);
  });

  it('should add metadata', async () => {
    storage.add({
      'target': AnnotatedController,
      'name': 'annotated_index',
      'propertyKey': 'indexAction',
      'transport': 'SOCKET'
    });

    storage.add({
      'target': AnnotatedController,
      'name': 'annotated_exception',
      'propertyKey': 'exceptionAction',
      'transport': 'SOCKET'
    });
    expect(storage.all().length).toBe(2);
  });

  it('should check if metadata exists', async () => {
    expect(storage.has('annotated_index')).toBeTruthy();
  });

  it('should get metadata', async () => {
    expect(storage.get('annotated_index').name).toBe('annotated_index');
  });

  it('should remove metadata', async () => {
    storage.remove('annotated_index');
    expect(storage.has('annotated_index')).toBeFalsy();
  });

  it('should reset metadata', async () => {
    storage.reset();
    expect(storage.all().length).toBe(0);
  });
});
