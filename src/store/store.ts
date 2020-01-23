import { ExtendedAsyncIterable } from "iterable/dist/iterable";
import { ScalarStore } from "./scalar-store";

export interface Store<Key, Value> extends ExtendedAsyncIterable<[Key, Value]>, ScalarStore<Key, Value> {

  keys(): AsyncIterable<Key>;

}
