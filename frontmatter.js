const matter = require("gray-matter");
const package = require("./package.json");
module.exports = () => (tree, file) => {
  const { consent, data } = matter(file.contents);

  // Step 2: Remove frontmatter after converting it into JS object
  if (tree.children[0].type === "thematicBreak") {
    const firstHeadingIndex = tree.children.findIndex(
      (t) => t.type === "heading"
    );
    if (firstHeadingIndex !== -1) {
      tree.children.splice(0, firstHeadingIndex + 1);
    }
  }

  console.log(
    tree.children.map(({ type, children }) => type == "paragraph" && children)
  );

  //   const updateElement = (obj) =>
  //     Array.isArray(obj)
  //       ? obj.map((o) => updateElement(o))
  //       : obj.type !== "link"
  //       ? {
  //           ...obj,
  //           ...(obj.children ? { children: updateElement(obj.children) } : {}),
  //         }
  //       : {
  //           type: "jsx",
  //           value: `
  //             <Link href={"${obj.url}"}>${obj.children
  //             .map(({ value }) => value)
  //             .join("")}</Link>
  //         `,
  //         };

  //   tree.children = updateElement(tree.children);
  //   tree.children.unshift(
  //     {
  //       type: "import",
  //       value: `
  //       import { Page } from "../undesign/Page";
  //       `,
  //     },
  //     {
  //       type: "import",
  //       value: `
  //       import { Link } from "../undesign/Link";
  //       `,
  //     },
  //     {
  //       type: "jsx",
  //       value: `
  //         <Page version={"${package.version}"}>
  //         `,
  //     }
  //   );

  //   tree.children.push({
  //     type: "jsx",
  //     value: `

  //         </Page>
  //         `,
  //   });

  // Step 1: Convert frontmatter to JS object and push to document tree
  tree.children.push({
    type: "export",
    value: `
      export const frontMatter = ${JSON.stringify(data)}
      `,
  });
};
