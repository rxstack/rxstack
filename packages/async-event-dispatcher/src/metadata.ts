export interface ObserverMetadata {
  eventName: string;
  propertyKey: string;
  priority: number;
}

export interface EventListenerMetadata {
  target: () => void;
  observers: ObserverMetadata[];
}
