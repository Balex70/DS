'use client'

import { ImageOff, LoaderCircle } from 'lucide-react';
import Image from 'next/image'
import { useState } from 'react';

export function ProductImage({ src, alt, imageClassName}: {src: string, alt: string, imageClassName: string}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

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
                    src={`/api/images/${src.replace("/storage/", "")}`}
                    alt={alt}
                    fill
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    className={`${imageClassName} transition-opacity duration-300 ${
                        isLoading ? "opacity-0" : "opacity-100"
                    }`}
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
    )
};

export default ProductImage;
