import { FSInterface, FSInterfaceData } from "./interface";

export interface NodeFSInterfaceDependencies<Data extends FSInterfaceData> {
  fs: {
    readFile(key: string): Promise<Data>;
    writeFile(key: string, data: Data): Promise<void>;
    readdir(key: string): Promise<string[]> | AsyncIterable<string>;
    stat(key: string): Promise<{
      isFile(): boolean;
      isDirectory(): boolean;
    }>
    rmdir(key: string): Promise<void>;
    unlink(key: string): Promise<void>;
  };
  fsExtras?: {
    rimraf?(key: string): Promise<void>;
    mkdirp?(key: string): Promise<void>;
  };
  path: {
    join(context: string, key: string): string;
  };
}

export class NodeFSInterface<Data extends FSInterfaceData = FSInterfaceData, Dependencies extends NodeFSInterfaceDependencies<Data> = NodeFSInterfaceDependencies<Data>> implements FSInterface<Data> {

  public createContext: (key: string) => Promise<void> | undefined = undefined;

  constructor(protected dependencies: Dependencies) {

    const { fsExtras } = dependencies;

    if (fsExtras && fsExtras.mkdirp) {
      this.createContext = async (key: string) => {
        if (!await this.has(key)) {
          await fsExtras.mkdirp(key);
        }
      };
    }

  }


  join(context: string, key: string) {
    return this.dependencies.path.join(context, key);
  }

  asyncIterable(context: string): AsyncIterable<[string, Data]> {
    return {
      [Symbol.asyncIterator]: () => this.asyncIterator(context)
    };
  }

  private async *asyncIterator(key: string): AsyncIterator<[string, Data]> {
    const stat = await this.dependencies.fs.stat(key);
    if (!stat) {
      return;
    }
    if (stat.isDirectory()) {
      for await (const child of this.keys(key)) {
        const childKey = this.join(key, child);
        const childData = await this.get(key);
        yield [childKey, childData];
      }
    } else if (stat.isFile()) {
      const data = await this.get(key);
      yield [key, data];
    }

  }

  async put(key: string, value: Data) {
    await this.dependencies.fs.writeFile(key, value);
  }

  async delete(key: string) {
    const stat = await this.dependencies.fs.stat(key);
    if (stat.isFile()) {
      await this.dependencies.fs.unlink(key);
    } else if (stat.isDirectory()) {
      const { fsExtras } = this.dependencies;
      if (fsExtras && fsExtras.rimraf) {
        await fsExtras.rimraf(key);
      } else {
        await this.dependencies.fs.rmdir(key);
      }
    }
  }

  async get(key: string) {
    return this.dependencies.fs.readFile(key);
  }

  async * keys(key: string) {
    yield * await this.dependencies.fs.readdir(key);
  }

  async has(key: string) {
    const stat = await this.dependencies.fs.stat(key).catch(() => undefined);
    return !!(stat && (stat.isFile() || stat.isDirectory()));
  }

}
