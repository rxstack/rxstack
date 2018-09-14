import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {IncomingMessage} from 'http';
import {EXPRESS_FILE_UPLOAD_OPTIONS} from './mocks/express-file-upload-app-options';
const rp = require('request-promise');
const fs = require('fs-extra');
const assetsDir = __dirname + '/assets';

describe('ExpressFileUpload', () => {
  // Setup application
  const app = new Application(EXPRESS_FILE_UPLOAD_OPTIONS);
  let host = 'http://localhost:3210';

  before(async() =>  {
    fs.mkdirsSync(assetsDir + '/../uploads');
    await app.start();
  });

  after(async() =>  {
    fs.removeSync(assetsDir + '/../uploads');
    await app.stop();
  });

  it('should upload file', async () => {
    const options = {
      uri: host + '/mock/upload',
      method: 'POST',
      formData: {
        file: fs.createReadStream(assetsDir + '/image.jpg'),
      },
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        response['body']['name'].should.be.equal('image.jpg');
        response['statusCode'].should.be.equal(200);
      })
      .catch((err: any) => true.should.be.false)
    ;
  });

  it('should skip express middleware', async () => {
    const options = {
      uri: host + '/mock/upload',
      method: 'GET',
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        response['body'].should.be.equal('dummy');
        response['statusCode'].should.be.equal(200);
      })
      .catch((err: any) => true.should.be.false)
    ;
  });
});
