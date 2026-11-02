import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Image with a graceful text fallback if the file fails to load. */
export function SafeImage({ className, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div role="img" aria-label={alt} className={cn("grid place-items-center bg-secondary p-4 text-center text-xs text-muted-foreground", className)}>{alt}</div>;
  }
  return <img loading="lazy" alt={alt} onError={() => setFailed(true)} className={className} {...props} />;
}
