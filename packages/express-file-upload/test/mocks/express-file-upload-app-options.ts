import {MockController} from './mock.controller';
import {ApplicationOptions, SERVER_REGISTRY} from '@rxstack/core';
import {ExpressModule} from '@rxstack/express-server';
import {MockServer} from './mock.server';
import {ExpressFileUploadModule} from '../../src/express-file-upload.module';
import {file_upload_environment} from '../environments/file_upload_environment';


export const EXPRESS_FILE_UPLOAD_OPTIONS: ApplicationOptions = {
  imports: [
    ExpressModule.configure(file_upload_environment.express_server),
    ExpressFileUploadModule.configure(file_upload_environment.express_file_upload)
  ],
  providers: [
    { provide: MockController, useClass: MockController },
    { provide: SERVER_REGISTRY, useClass: MockServer, multi: true },
  ],
  servers: file_upload_environment.servers,
  logger: file_upload_environment.logger
};