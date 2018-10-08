import {Exclude, Expose, Transform} from 'class-transformer';
import {ResourceInterface} from '../../src';
import {IsNotEmpty, Length} from 'class-validator';

@Exclude()
export class TaskModel implements ResourceInterface {

  _id: string;

  @Length(5, 255, {message: 'task.length'})
  @IsNotEmpty({message: 'task.notEmpty', groups: ['post_set_data']})
  @Expose()
  name: string;

  @Expose()
  @Transform(value => !!value, { toClassOnly: true })
  completed: boolean;

  @Expose()
  get id(): string {
    return this._id;
  }

  constructor() {
    this.completed = false;
  }
}