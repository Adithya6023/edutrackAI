import { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({ src, alt, className = '', fallbackLabel }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EEF2FF] text-[#4F46E5] font-display font-semibold select-none ${className}`}
        aria-label={alt}
      >
        {fallbackLabel ? (
          <span className="text-xs tracking-tight">{fallbackLabel}</span>
        ) : (
          <GraduationCap className="w-5 h-5" strokeWidth={1.75} />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
