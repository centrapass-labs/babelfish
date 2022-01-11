import TOC from "../pages/docs/TOC.json";

const DocExample = ({ children }: { children: any }) => (
  <div style={{ display: "flex" }}>
    <div style={{ flex: 1 }}>
      <h3>Table of Content</h3>
      <ul>
        {TOC.pages.map((page) => (
          <li key={page.slug}>
            <a href={`/docs/${page.slug}`}>{page.name}</a>
          </li>
        ))}
      </ul>
    </div>
    <div style={{ flex: 5 }}>{children}</div>
  </div>
);

export default DocExample;
