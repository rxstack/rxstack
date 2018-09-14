import {Injectable} from 'injection-js';
import {Service2} from './service2';

@Injectable()
export class Service1 {
  constructor(public service2: Service2) {}
}