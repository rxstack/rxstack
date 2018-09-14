import 'reflect-metadata';
import {GenericMetadataStorage} from '../../src/kernel/metadata/generic-metadata-storage';
import {WebSocketMetadata} from '../../src/kernel/metadata';
import {AnnotatedController} from './fixtures/annotated.controller';

describe('MetadataStorage', () => {
  const storage = new GenericMetadataStorage<WebSocketMetadata>();
  it('should have zero items', async () => {
    storage.all().length.should.be.equal(0);
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
    storage.all().length.should.be.equal(2);
  });

  it('should check if metadata exists', async () => {
    storage.has('annotated_index').should.be.true;
  });

  it('should get metadata', async () => {
    storage.get('annotated_index').name.should.be.equal('annotated_index');
  });

  it('should remove metadata', async () => {
    storage.remove('annotated_index');
    storage.has('annotated_index').should.be.false;
  });

  it('should reset metadata', async () => {
    storage.reset();
    storage.all().length.should.be.equal(0);
  });
});