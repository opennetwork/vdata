import { FSInterface } from "../interface";
import { NodeFSInterface } from "../node-interface";

export async function getNodeFSStoreInterface(): Promise<FSInterface<Buffer | string>> {
  const fs = await import("fs");
  const path = await import("path");
  return new NodeFSInterface({
    fs: {
      readdir(name: string): Promise<string[]> | AsyncIterable<string> {
        return fs.promises.readdir(name);
      },
      readFile(name: string): Promise<Buffer | string> {
        return fs.promises.readFile(name);
      },
      writeFile(name: string, data: Buffer | string): Promise<void> {
        return fs.promises.writeFile(name, data);
      },
      unlink(name: string): Promise<void> {
        return fs.promises.unlink(name);
      },
      rmdir(name: string): Promise<void> {
        return fs.promises.rmdir(name);
      },
      stat(name: string): Promise<{ isFile(): boolean; isDirectory(): boolean }> {
        return fs.promises.stat(name);
      }
    },
    path: {
      join(from: string, to: string): string {
        return path.join(from, to);
      }
    }
  });
}
