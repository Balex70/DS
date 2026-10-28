'use client';

import { ImageOff } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { ImageSpinner } from './ImageSpinner';

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
                <ImageSpinner />
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
