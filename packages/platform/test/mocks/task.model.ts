import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class TaskModel {

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  completed = false;
}