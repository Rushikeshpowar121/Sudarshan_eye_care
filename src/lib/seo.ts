type Meta = { meta: Array<Record<string, string>>; links?: Array<Record<string, string>> };
export function makeMeta(opts: { title: string; description: string; path: string; type?: string }): Meta {
  const { title, description, path, type = "website" } = opts;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
