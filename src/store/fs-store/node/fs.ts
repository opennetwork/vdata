import { FSInterface } from "../interface";
import { NodeFSInterface } from "../node-interface";

export async function getNodeFSStoreInterface(): Promise<FSInterface<Buffer | string>> {
  const fs = await import("fs");
  const path = await import("path");
  return new NodeFSInterface({
    fs: {
      readdir: fs.promises.readdir,
      readFile: fs.promises.readFile,
      writeFile: fs.promises.writeFile,
      unlink: fs.promises.unlink,
      rmdir: fs.promises.rmdir,
      stat: fs.promises.stat
    },
    path: {
      join: path.join
    },
    fsExtras: undefined
  });
}
