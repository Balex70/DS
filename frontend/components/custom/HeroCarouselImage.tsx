'use client';

import { ImageOff, LoaderCircle } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type ProductImageProps = Omit<ImageProps, 'src'> & {
    src: string;
};

export function HeroCarouselImage({ src, ...props }: ProductImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const imageSrc = src.startsWith('http')
        ? src
        : `/api/images/${src.replace('/storage/', '')}`;

    return (
        <>
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <LoaderCircle
                        className="h-12 w-12 animate-spin text-muted-foreground/50"
                        strokeWidth={3}
                    />
                </div>
            )}

            {!hasError && (
                <Image
                    src={imageSrc}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    {...props}
                />
            )}

            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50">
                    <ImageOff
                        className="h-12 w-12 text-muted-foreground/40"
                        strokeWidth={1.5}
                    />
                </div>
            )}
        </>
    );
}

export default HeroCarouselImage;
