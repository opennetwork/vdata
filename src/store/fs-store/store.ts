import { ContextStore } from "../context-store/store";
import { FSInterface, FSInterfaceData } from "./interface";

export class FSStore<Data extends FSInterfaceData> extends ContextStore<string, Data> {

  constructor(context: string, contextInterface: FSInterface<Data>) {
    super(context, contextInterface);
  }

  async withContext(key: string): Promise<FSStore<Data>> {
    const resolvedKey = await this.contextInterface.join(this.currentContext, key);
    return new FSStore(resolvedKey, this.contextInterface);
  }

}
