'use client'

import Image from 'next/image'

export function CategoryImage({ src, alt, imageClassName}: {src: string, alt: string, imageClassName: string}) {
    return <Image
                src={`/api/images/${src.replace("/storage/", "")}`}
                alt={alt}
                fill
                className={imageClassName}
            />
};

export default CategoryImage;
