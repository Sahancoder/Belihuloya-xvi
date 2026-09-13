import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackBg?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackText = '?',
  fallbackBg = '#1e293b',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-white uppercase rounded-full select-none ${className}`}
        style={{ backgroundColor: fallbackBg }}
        title={alt}
      >
        <span>{fallbackText.slice(0, 4)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
