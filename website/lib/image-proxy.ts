export function getProxiedImageUrl(
  originalUrl: string | null | undefined,
): string {
  if (!originalUrl) return "/defaultNoImage.png";
  if (originalUrl.startsWith("/")) return originalUrl;
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
}
