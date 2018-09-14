export class ExpressFileUploadConfiguration {
  enabled = false;
  hash ?= 'md5';
  multiples ?= false;
  directory ?= require('os').tmpdir();
}