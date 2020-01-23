import { ContextInterface } from "./interface";
import { ExtendedIterableAsyncImplementation } from "iterable/dist/iterable/iterable-async-implementation";
import { BasicMap } from "iterable/dist/iterable/reference-map";
import { ScalarStore } from "../scalar-store";

export class ContextStore<Key, Value> extends ExtendedIterableAsyncImplementation<[Key, Value]> implements ScalarStore<Key, Value> {

  constructor(protected readonly currentContext: Key, protected contextInterface: ContextInterface<Key, Value>) {
    super(contextInterface.asyncIterable(currentContext), BasicMap);
  }

  async put(key: Key, value: Value) {
    if (this.contextInterface.createContext) {
      await this.contextInterface.createContext(this.currentContext);
    }
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return this.contextInterface.put(resolvedKey, value);
  }

  async delete(key: Key) {
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return this.contextInterface.delete(resolvedKey);
  }

  async get(key: Key) {
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return this.contextInterface.get(resolvedKey);
  }

  [Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
    return this.contextInterface.asyncIterable(this.currentContext)[Symbol.asyncIterator]();
  }

  async *keys() {
    return this.contextInterface.keys(this.currentContext);
  }

  async has(key: Key) {
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return this.contextInterface.has(resolvedKey);
  }

  async withContext(key: Key): Promise<ContextStore<Key, Value>> {
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return new ContextStore(resolvedKey, this.contextInterface);
  }

}
