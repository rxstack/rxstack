import {
  BadRequestException,
  ConflictException,
  Exception,
  exceptionToObject,
  ExpectationFailedException,
  ForbiddenException,
  GoneException,
  HttpException,
  InsufficientStorageException,
  InternalServerErrorException,
  LengthRequiredException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PaymentRequiredException,
  PreconditionFailedException,
  ProxyAuthenticationRequiredException,
  RangeNotSatisfiableException,
  RequestTimeoutException,
  ServiceUnavailableException,
  TooManyRequestsException,
  transformToException,
  UnauthorizedException,
  UnavailableForLegalReasonsException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
  URITooLongException
} from '../src/index';

describe('Exceptions', () => {

  const exceptions = [
    {exception: BadRequestException, code: 400},
    {exception: UnauthorizedException, code: 401},
    {exception: PaymentRequiredException, code: 402},
    {exception: ForbiddenException, code: 403},
    {exception: NotFoundException, code: 404},
    {exception: MethodNotAllowedException, code: 405},
    {exception: NotAcceptableException, code: 406},
    {exception: ProxyAuthenticationRequiredException, code: 407},
    {exception: RequestTimeoutException, code: 408},
    {exception: ConflictException, code: 409},
    {exception: GoneException, code: 410},
    {exception: LengthRequiredException, code: 411},
    {exception: PreconditionFailedException, code: 412},
    {exception: PayloadTooLargeException, code: 413},
    {exception: URITooLongException, code: 414},
    {exception: UnsupportedMediaTypeException, code: 415},
    {exception: RangeNotSatisfiableException, code: 416},
    {exception: ExpectationFailedException, code: 417},
    {exception: UnprocessableEntityException, code: 422},
    {exception: TooManyRequestsException, code: 429},
    {exception: UnavailableForLegalReasonsException, code: 451},
    {exception: InternalServerErrorException, code: 500},
    {exception: NotImplementedException, code: 501},
    {exception: ServiceUnavailableException, code: 503},
    {exception: InsufficientStorageException, code: 507},
  ];

  exceptions.forEach((check) => {
    it(`creates instance of ${check.exception.prototype.constructor.name} with status code ${check.code}`, () => {
      const exceptionInstance = new check.exception;

      try {
        throw exceptionInstance;
      } catch (e) {
        e.should.be.an.instanceof(HttpException);
        e.statusCode.should.be.equal(check.code);
        e.name.should.be.equal(exceptionInstance.constructor.name);
      }
    });
  });

  it('converts error to exception', () => {

    let exception = transformToException(new Error('generic'));
    exception.name.should.be.equal('Exception');
    let sameException = transformToException(exception);
    sameException.should.be.equal(exception);
  });

  it('converts exception to object', () => {
    const transformed = exceptionToObject(new Exception('Custom Error'));
    transformed['message'].should.be.equal('Custom Error');
  });
});