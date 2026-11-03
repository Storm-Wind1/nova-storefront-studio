export const IS_GITHUB_PAGES = import.meta.env["VITE_GITHUB_PAGES"] === "true";

export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function publicPageUrl(path: string) {
  const site = import.meta.env["VITE_SITE_URL"] as string | undefined;
  if (!site) return path;
  return new URL(IS_GITHUB_PAGES ? `#${path}` : path, site).href;
}
