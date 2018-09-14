import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/core';
import {ExpressServer} from '@rxstack/express-server';
import {
  NextFunction, Request as ExpressRequest, RequestHandler,
  Response as ExpressResponse
} from 'express';
import {ExpressFileUploadConfiguration} from './express-file-upload-configuration';
const formidable = require('formidable');

@Injectable()
export class FileUploadListener {
  constructor(private configuration: ExpressFileUploadConfiguration) { }

  @Observe(ServerEvents.CONFIGURE, -200)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() !== ExpressServer.serverName) {
      return;
    }
    event.server.getEngine().use(this.uploadHandler());
  }

  private uploadHandler(): RequestHandler {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
      if (!this.configuration.enabled || req.method.toLowerCase() !== 'post' || !this.isMultiPart(req)) {
        return next();
      }
      const form = new formidable.IncomingForm();
      form.uploadDir = this.configuration.directory;
      form.keepExtensions = true;
      form.multiples = this.configuration.multiples;
      form.hash = this.configuration.hash;
      form.parse(req, function(err: any, fields: any, files: any) {
        req['files'] = files ? files : [];
        next(err);
      });
    };
  }

  private isMultiPart(req: ExpressRequest): boolean {
    return Boolean(req.header('content-type') &&
      req.header('content-type').includes('multipart/form-data;'));
  }
}