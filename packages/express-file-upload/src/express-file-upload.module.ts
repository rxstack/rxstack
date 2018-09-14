import {Module, ModuleWithProviders} from '@rxstack/core';
import {FileUploadListener} from './file-upload.listener';
import {ExpressFileUploadConfiguration} from './express-file-upload-configuration';

@Module()
export class ExpressFileUploadModule {
  static configure(configuration: ExpressFileUploadConfiguration): ModuleWithProviders {
    return {
      module: ExpressFileUploadModule,
      providers: [
        {
          provide: ExpressFileUploadConfiguration,
          useFactory: () => {
            return Object.assign(new ExpressFileUploadConfiguration(), configuration);
          },
          deps: []
        },
        { provide: FileUploadListener, useClass: FileUploadListener },
      ]
    };
  }
}