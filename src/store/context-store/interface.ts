import { ScalarStore } from "../scalar-store";

export interface ContextInterface<Key, Value> extends ScalarStore<Key, Value> {

  join(context: Key, key: Key): Key | Promise<Key>;
  asyncIterable(context: Key): AsyncIterable<[Key, Value]>;
  keys(context: Key): AsyncIterable<string>;
  createContext?(context: Key): Promise<void>;

}
