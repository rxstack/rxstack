import {ResourceInterface} from '../interfaces';
import {Validator, ValidatorOptions} from 'class-validator';
import {ValidationError, ValidationException} from '@rxstack/exceptions';
import {WriteOperationMetadata} from '../metadata/write-operation.metadata';
import {HttpMethod, Request, Response} from '@rxstack/core';
import * as _ from 'lodash';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {classToPlain, plainToClassFromExist} from 'class-transformer';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractWriteOperation<T extends ResourceInterface> extends AbstractSingleResourceOperation<T> {
  metadata: WriteOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallbacks(OperationEventsEnum.PRE_SET_DATA, this.metadata.onPreSetData);
    this.registerOperationCallbacks(OperationEventsEnum.POST_SET_DATA, this.metadata.onPostSetData);
    this.registerOperationCallbacks(OperationEventsEnum.PRE_WRITE, this.metadata.onPreWrite);
    this.registerOperationCallbacks(OperationEventsEnum.POST_WRITE, this.metadata.onPostWrite);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.WRITE);
    const metadata = operationEvent.metadata as WriteOperationMetadata<T>;
    operationEvent.statusCode = metadata.type === 'POST' ? 201 : 204;
    const resource = metadata.type === 'POST'
      ? await this.createNew(request) : this.findOr404(request);
    operationEvent.setData(resource);
    await this.dispatch(OperationEventsEnum.PRE_SET_DATA, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    plainToClassFromExist(operationEvent.getData(), request.body);
    this.resolveValidatorOptions(metadata);
    await this.dispatch(OperationEventsEnum.POST_SET_DATA, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    await this.validate(operationEvent.getData(), metadata.validatorOptions);
    await this.dispatch(OperationEventsEnum.PRE_WRITE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doWrite(operationEvent.getData()));
    await this.dispatch(OperationEventsEnum.POST_WRITE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    const data = operationEvent.statusCode !== 204
      ? classToPlain(operationEvent.getData(), metadata.classTransformerOptions) : null;
    return new Response(data, operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return this.metadata.type;
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