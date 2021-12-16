import TOC from "../pages/docs/TOC.json";

export default ({ children }: { children: any }) => (
  <div style={{ display: "flex" }}>
    <div style={{ flex: 1 }}>
      <h3>Table of Content</h3>
      <ul>
        {TOC.pages.map((page) => (
          <li>
            <a href={`/docs/${page.slug}`}>{page.name}</a>
          </li>
        ))}
      </ul>
    </div>
    <div style={{ flex: 5 }}>{children}</div>
  </div>
);
