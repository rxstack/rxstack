export class QueryParameterExtractorOptions {
  name?: string;
  enabled: boolean;

  constructor(obj?: any) {
    obj = obj || {};
    this.name = obj && obj.name || 'bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class AuthorizationHeaderExtractorOptions {
  name?: string;
  prefix?: string;
  enabled: boolean;

  constructor(obj?: any) {
    obj = obj || {};
    this.name = obj && obj.name || 'authorization';
    this.prefix = obj && obj.prefix || 'Bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class TokenExtractorsOptions {
  query_parameter?: QueryParameterExtractorOptions;
  authorization_header?: AuthorizationHeaderExtractorOptions;

  constructor(obj?: any) {
    obj = obj || {};
    this.query_parameter = new QueryParameterExtractorOptions(obj.query_parameter);
    this.authorization_header = new AuthorizationHeaderExtractorOptions(obj.authorization_header);
  }
}

export class Rsa {
  public_key: string;
  private_key?: string;
  passphrase?: string;

  constructor(obj: any) {
    obj = obj || {};
    this.public_key = obj.public_key;
    this.private_key = obj.private_key || null;
    this.passphrase = obj.passphrase || null;
  }
}

export class SecretConfiguration {
  issuer: string;
  signature_algorithm: string;
  secret: Rsa | string;

  constructor(obj?: any) {
    obj = obj || {};
    this.signature_algorithm = obj.signature_algorithm || 'RS512';
    this.issuer = obj.issuer;
    this.secret = (typeof obj.secret === 'string') ? obj.secret : new Rsa(obj.secret);
  }
}

export class SecurityConfiguration {
  token_extractors: TokenExtractorsOptions;
  default_issuer: string;
  secret_configurations: SecretConfiguration[];
  local_authentication?: boolean;
  user_identity_field?: string;
  ttl?: number;
  refresh_token_ttl?: number;
  constructor(obj?: any) {
    obj = obj || {};
    this.token_extractors = new TokenExtractorsOptions(obj.token_extractors);
    this.default_issuer = obj.default_issuer;
    this.secret_configurations =
      obj.secret_configurations.map((configuration: SecretConfiguration) => new SecretConfiguration(configuration));
    this.local_authentication = obj.local_authentication || false;
    this.user_identity_field = obj.user_identity_field || 'username';
    this.ttl = obj.ttl ? obj.ttl : 300;
    this.refresh_token_ttl = obj.refresh_token_ttl ? obj.refresh_token_ttl : (60 * 60 * 24);
  }
}