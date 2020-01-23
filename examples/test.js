import { getNodeFSStoreInterface } from "../dist/store/fs-store/node/fs.js";
import { FSStore } from "../dist/store/fs-store/store.js";

async function run() {

  const contextInterface = await getNodeFSStoreInterface();

  let store = new FSStore(
    "./examples",
    contextInterface
  );

  console.log(await store.has("./store"));

  store = await store.withContext("./store");

  console.log(await store.has("./example.txt"));
  await store.put("./example.txt", "example");
  console.log(await store.has("./example.txt"));
  console.log((await store.get("./example.txt")).toString());
  await store.delete("./example.txt");
  console.log(await store.has("./example.txt"));



}

run().catch(console.error);
