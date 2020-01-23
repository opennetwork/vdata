import { Store } from "./store";
import { ExtendedIterableAsyncImplementation } from "iterable/dist/iterable/iterable-async-implementation";
import { BasicMap } from "iterable/dist/iterable/reference-map";

export class MapStore<Key, Value> extends ExtendedIterableAsyncImplementation<[Key, Value]> implements Store<Key, Value> {

  constructor(private readonly internalMap = new Map<Key, Value>()) {
    super(
      internalMap,
      BasicMap
    );
  }

  async put(key: Key, value: Value) {
    this.internalMap.set(key, value);
  }

  async get(key: Key) {
    return this.internalMap.get(key);
  }

  async delete(key: Key) {
    this.internalMap.delete(key);
  }

  async *keys() {
    yield *this.internalMap.keys();
  }

  async *[Symbol.asyncIterator]() {
    yield *this.internalMap;
  }

  async has(key: Key) {
    return this.internalMap.has(key);
  }

}
