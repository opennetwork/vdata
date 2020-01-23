import { Store } from "./store";
import { ExtendedIterableAsyncImplementation } from "iterable/dist/iterable/iterable-async-implementation";
import { BasicMap } from "iterable/dist/iterable/reference-map";

function mapAccessor<Key, Value>(map: Map<Key, Value>): AsyncIterable<[Key, Value]> {
  return {
    async *[Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
      yield *map;
    }
  };
}

export class MapStore<Key, Value> extends ExtendedIterableAsyncImplementation<[Key, Value]> implements Store<Key, Value> {

  constructor(private internalMap = new Map<Key, Value>()) {
    super(
      mapAccessor(internalMap),
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
    yield *mapAccessor(this.internalMap);
  }

  async has(key: Key) {
    return this.internalMap.has(key);
  }

}
