import {ResourceInterface, ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {Validator, ValidatorOptions} from 'class-validator';
import {NotFoundException, ValidationError, ValidationException} from '@rxstack/exceptions';
import {WriteOperationMetadata} from '../metadata/write-operation.metadata';
import {HttpMethod, Request, Response} from '@rxstack/core';
import * as _ from 'lodash';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {classToPlain, plainToClassFromExist} from 'class-transformer';
import {OperationEventsEnum} from '../enums/operation-events.enum';

export abstract class AbstractWriteOperation<T extends ResourceInterface> extends AbstractOperation {
  metadata: WriteOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallables(OperationEventsEnum.PRE_SET_DATA, this.metadata.onPreSetData);
    this.registerOperationCallables(OperationEventsEnum.POST_SET_DATA, this.metadata.onPostSetData);
    this.registerOperationCallables(OperationEventsEnum.PRE_WRITE, this.metadata.onPreWrite);
    this.registerOperationCallables(OperationEventsEnum.POST_WRITE, this.metadata.onPostWrite);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.WRITE);
    const metadata = operationEvent.metadata as WriteOperationMetadata<T>;
    operationEvent.statusCode = metadata.type === 'POST' ? 201 : 204;
    operationEvent.data = metadata.type === 'POST'
      ? await this.createNew(request) : this.findOr404(request);
    await this.dispatch(OperationEventsEnum.PRE_SET_DATA, operationEvent);
    plainToClassFromExist(operationEvent.data, request.body);
    this.resolveValidatorOptions(metadata);
    await this.dispatch(OperationEventsEnum.POST_SET_DATA, operationEvent);
    await this.validate(operationEvent.data, metadata.validatorOptions);
    await this.dispatch(OperationEventsEnum.PRE_WRITE, operationEvent);
    operationEvent.data = await this.doWrite(operationEvent.data);
    await this.dispatch(OperationEventsEnum.POST_WRITE, operationEvent);
    const data = operationEvent.statusCode !== 204
      ? classToPlain(operationEvent.data, metadata.classTransformerOptions) : null;
    return new Response(data, operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return this.metadata.type;
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async createNew(request: Request): Promise<T> {
    return await this.getService().createNew();
  }

  protected async validate(data: T, validatorOptions: ValidatorOptions): Promise<void> {
    const validator = this.injector.get(Validator);
    const errors = await validator.validate(data, validatorOptions);
    if (errors.length > 0) {
      throw new ValidationException(<ValidationError[]>errors);
    }
  }

  protected async findOr404(request: Request): Promise<T> {
    const resource = await this.getService().find(request.params.get('id'));
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }

  protected async doWrite(data: T): Promise<T> {
    return await this.getService().save(data);
  }

  private resolveValidatorOptions(metadata: WriteOperationMetadata<T>): void {
    const options = metadata.validatorOptions;
    const defaults =  {
      validationError: { target: false },
      whitelist: false,
      skipMissingProperties: false
    };
    metadata.validatorOptions = options ? _.merge(defaults, options) : defaults;
  }
}