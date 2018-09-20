# RxStack ExpressFileUpload Module

> The ExpressFileUpload module allows you to upload files using [`expressjs`](https://expressjs.com) in rxstack framework.
Under the hood it uses [`formidable`](https://github.com/felixge/node-formidable) and [`mime`](https://github.com/broofa/node-mime)

## Installation

```
npm install @rxstack/express-file-upload --save
```

## Documentation

* [Setup](#setup)
* [Module options](#module-options)
* [Controller usage](#controller-usage)

### <a name="setup"></a>  Setup
`ExpressFileUpload` module needs to be registered in the `application`. 
The module depends on [`@rxstack/express-server`](../express-server), 
make sure it is installed and configured.

Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {DataFixtureModule} from '@rxstack/express-file-upload';

export const EXPRESS_APP_OPTIONS: ApplicationOptions = {
  imports: [
    DataFixtureModule.configure({
      enabled: true, // default is false
      hash: 'md5', // default is md5
      multiples: false, // default is false
      directory: './uploads' // default is os.tmpdir()
    }),
    // important: import ExpressServerModule
  ],
  servers: ['express'], 
  providers: [
    // ...
  ], 
  logger: {
    // ....
  }
};

new Application(EXPRESS_APP_OPTIONS).start();
```

### <a name="module-options"></a>  Module options
The module accepts the following options:

- `enabled`: whether the module is enabled or not. The default is `false`
- `hash`: If you want checksums calculated for incoming files, set this to either `sha1` or `md5`. The default is `md5`
- `multiples`: If this option is enabled, the files argument will contain arrays of files 
    for inputs which submit multiple files using the HTML5 multiple attribute. The default is `false`
- `directory`: Sets the directory for placing file uploads in. You can move them later on using `fs.rename()`. The default is `os.tmpdir()`.
               

### <a name="controller-usage"></a> Controller usage       
Uploaded file is available in the `Request` object and it is instance of [`File`](../core/src/kernel/models/file.ts)

```typescript
import {Request, Response, Http} from '@rxstack/core';

export class FileUploadController {

  @Http('POST', '/files/upload', 'file_upload')
  async uploadAction(request: Request): Promise<Response> {
    // you can validate it by checking the file.size and file.type
    const file = request.files.get('file'); 
    return new Response(file);
  }
}
```

Here is an `curl` example:

```bash
curl -F 'file=@/path_to_file/hello.txt' http://localhost:3000/files/upload
```

## License

Licensed under the [MIT license](../../LICENSE).