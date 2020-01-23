import { ContextInterface } from "../context-store/interface";

export type FSInterfaceData = Uint8Array | string;

export interface FSInterface<Data extends FSInterfaceData> extends ContextInterface<string, Data> {


}
