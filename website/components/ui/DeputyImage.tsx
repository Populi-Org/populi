"use client";

interface DeputyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export default function DeputyImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: DeputyImageProps) {
  return (
    // biome-ignore lint/performance/noImgElement: proxied images with fallback
    <img
      alt={alt}
      className={className}
      src={src}
      loading={loading}
      onError={(e) => {
        e.currentTarget.src = "/defaultNoImage.png";
      }}
    />
  );
}
