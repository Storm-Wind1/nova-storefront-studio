import { publicPageUrl } from "@/lib/hosting";

export function pageMeta(title: string, description: string, path: string) {
  const full = `${title} — NOVA Store Demo`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: publicPageUrl(path) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: publicPageUrl(path) }],
  };
}
