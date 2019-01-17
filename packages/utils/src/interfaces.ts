export interface Constructable<T> {
  new(): T;
}

export type PartialDeep<T> = {
  [ P in keyof T ]?: PartialDeep<T[ P ]>;
};
