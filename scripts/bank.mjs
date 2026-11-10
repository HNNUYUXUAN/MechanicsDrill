import { createHash } from "node:crypto";
import { readFile, writeFile, access } from "node:fs/promises";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");
const rows = JSON.parse(await read("sources/questions.json"));
const categories = [
  { id: "2", name: "质点系力学" },
  { id: "3", name: "刚体力学" },
];
const diagrams = new Set(["3.2", "3.4", "3.30"]);

const questions = await Promise.all(
  rows.map(async ({ id, page, ...fields }) => {
    const categoryId = id.split(".")[0];
    const names = id === "2.13" ? ["primary", "alternate"] : ["common"];
    const variants = await Promise.all(
      names.map(async (name) => {
        const filename =
          "sources/solutions/" +
          id +
          (name === "alternate" ? "-energy" : "") +
          ".md";
        const solution = (await read(filename)).trim();
        if (/\\(?:mathbf|boldsymbol|bm)\b/.test(solution)) {
          throw Error(filename + " 包含加粗的数学符号，请区分向量和张量。");
        }
        const paths = [
          ...solution.matchAll(/!\[[^\]]*\]\(\.\.\/\.\.\/public\/([^ )]+)\)/g),
        ];
        await Promise.all(
          paths.map((m) =>
            access(new URL("../public/" + m[1], import.meta.url)),
          ),
        );
        return {
          id: name,
          solution: solution.replaceAll("../../public/figures/", "./figures/"),
          revision: 1,
        };
      }),
    );
    const figure = diagrams.has(id) ? "figures/prompt-" + id + ".svg" : "";
    if (figure) await access(new URL("../public/" + figure, import.meta.url));
    return {
      id,
      ...fields,
      categoryId,
      figure,
      source: {
        section:
          "第 " +
          categoryId +
          " 章 · " +
          categories.find((c) => c.id === categoryId).name,
        page,
        identity: createHash("sha256")
          .update(id + "\n" + fields.prompt)
          .digest("hex"),
      },
      variants,
    };
  }),
);
const bank = {
  bankVersion: 1,
  categories,
  rules: (await read("sources/rules.md")).trim(),
  questions,
};
await writeFile(
  new URL("../src/data/bank.json", import.meta.url),
  JSON.stringify(bank, null, 2) + "\n",
);
