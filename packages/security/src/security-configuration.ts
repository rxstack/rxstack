export class QueryParameterExtractorOptions {
  name?: string;
  enabled: boolean;

  constructor(obj?: any) {
    this.name = obj && obj.name || 'bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class AuthorizationHeaderExtractorOptions {
  name?: string;
  prefix?: string;
  enabled: boolean;

  constructor(obj?: any) {
    this.name = obj && obj.name || 'authorization';
    this.prefix = obj && obj.prefix || 'Bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class TokenExtractorsOptions {
  query_parameter?: QueryParameterExtractorOptions;
  authorization_header?: AuthorizationHeaderExtractorOptions;

  constructor(obj?: any) {
    this.query_parameter = new QueryParameterExtractorOptions(obj.query_parameter);
    this.authorization_header = new AuthorizationHeaderExtractorOptions(obj.authorization_header);
  }
}

export class Rsa {
  public_key: string;
  private_key?: string;
  passphrase?: string;

  constructor(obj: any) {
    this.public_key = obj.public_key;
    this.private_key = obj.private_key || null;
    this.passphrase = obj.passphrase || null;
  }
}

export class SecurityConfiguration {
  token_extractors: TokenExtractorsOptions;
  local_authentication?: boolean;
  user_identity_field?: string;
  secret: Rsa | string;
  signature_algorithm?: string;
  issuer?: string;
  ttl?: number;
  refresh_token_ttl?: number;
  constructor(obj?: any) {
    this.token_extractors = new TokenExtractorsOptions(obj.token_extractors);
    this.local_authentication = obj.local_authentication || false;
    this.user_identity_field = obj.user_identity_field || 'username';
    this.ttl = obj.ttl ? obj.ttl : 300;
    this.refresh_token_ttl = obj.refresh_token_ttl ? obj.refresh_token_ttl : (60 * 60 * 24);
    this.secret = (typeof obj.secret === 'string') ? obj.secret : new Rsa(obj.secret);
    this.signature_algorithm = obj.signature_algorithm || 'RS512';
    this.issuer = obj.issuer ? obj.issuer : 'rxstack';
  }
}