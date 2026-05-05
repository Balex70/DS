'use client'

import Image from 'next/image'

export function NextImageWithReplace({ src, alt, imageClassName, width, height}: {src: string, alt: string, imageClassName: string, width: number, height: number}) {
    return <Image
                src={`/api/images/${src.replace("/storage/", "")}`}
                alt={alt}
                width={width}
                height={height}
                className={imageClassName}
            />
};

export default NextImageWithReplace;
