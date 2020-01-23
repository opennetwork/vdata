import FileHound from "filehound";
import fs from "fs";
import path from "path";
import { promisify } from "util";

FileHound.create()
  .paths("./dist")
  .discard("node_modules")
  .ext("js")
  .find()
  .then(
    async filePaths => {
      await Promise.all(
        filePaths.map(
          async filePath => {

            let contents = await fs.promises.readFile(
              filePath,
              "utf-8"
            );

            const statements = contents.match(/(import|export) .+ from ".+";/g);

            if (!statements) {
              return;
            }

            await Promise.all(
              statements.map(
                async statement => {
                  let url = statement.match(/"(.+)";/)[1];
                  let stat, indexStat;
                  if (url.indexOf(".") !== 0) {
                    [stat, indexStat] = await Promise.all([
                      fs.promises.stat(`node_modules/${url}.js`).catch(() => {}),
                      fs.promises.stat(`node_modules/${url}/index.js`).catch(() => {})
                    ]);
                  } else {
                    [stat, indexStat] = await Promise.all([
                      fs.promises.stat(path.resolve(path.dirname(filePath), `${url}.js`)).catch(() => {}),
                      fs.promises.stat(path.resolve(path.dirname(filePath), `${url}/index.js`)).catch(() => {})
                    ]);
                  }
                  if (stat && stat.isFile()) {
                    contents = contents.replace(
                      statement,
                      statement.replace(url, `${url}.js`)
                    );
                  } else if (indexStat && indexStat.isFile()) {
                    contents = contents.replace(
                      statement,
                      statement.replace(url, `${url}/index.js`)
                    );
                  }
                }
              )
            );

            await promisify(fs.writeFile)(filePath, contents, "utf-8");

          }
        )
      )
    }
  )
  .then(() => console.log("Complete"))
  .catch(error => console.error(error));

