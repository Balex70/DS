'use client';

import Image, { ImageProps } from 'next/image';

type ProductImageProps = Omit<ImageProps, 'src'> & {
    src: string;
};

export function HeroCarouselImage({ src, ...props }: ProductImageProps) {
    const imageSrc = src.startsWith('http')
        ? src
        : `/api/images/${src.replace('/storage/', '')}`;

    return (
        <Image
            src={imageSrc}
            {...props}
        />
    );
}

export default HeroCarouselImage;
