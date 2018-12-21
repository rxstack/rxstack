export enum OperationEventsEnum {
  PRE_COLLECTION_READ = 'preCollectionRead',
  POST_COLLECTION_READ = 'postCollectionRead',
  QUERY = 'query',
  PRE_READ = 'preRead',
  POST_READ = 'postRead',
  PRE_CREATE = 'preCreate',
  POST_CREATE = 'postCreate',
  PRE_UPDATE = 'preUpdate',
  POST_UPDATE = 'postUpdate',
  PRE_PATCH = 'prePatch',
  POST_PATCH = 'postPatch',
  PRE_REMOVE = 'preRemove',
  POST_REMOVE = 'postRemove',
  PRE_BULK_REMOVE = 'preBulkRemove',
  POST_BULK_REMOVE = 'postBulkRemove'
}