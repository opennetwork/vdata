export interface ScalarStore<Key, Value> {

  has(key: Key): Promise<boolean>;
  put(key: Key, value: Value): Promise<void>;
  delete(key: Key): Promise<void>;
  get(key: Key): Promise<Value>;

}
