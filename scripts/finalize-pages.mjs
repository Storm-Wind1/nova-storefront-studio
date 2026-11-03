import { writeFile } from "node:fs/promises";
await writeFile(new URL("../dist-pages/.nojekyll", import.meta.url), "");
