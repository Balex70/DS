'use client'

import { convertUrlToDockerHost, urlHasSchemaAndHostname } from '@/helpers/general'
import Image from 'next/image'

export function CustomImage({ src, alt, imageClassName, width, height}: {src: string, alt: string, imageClassName: string, width: number, height: number}) {
    const isSvg = src.trim().toLowerCase().endsWith('.svg');
    if (isSvg) { // Load inline SVG via <img> (no next/image), can be load with public path
        return (
            <img
                src={src}
                alt={alt}
                className={imageClassName}
                width={width}
                height={height}
            />
        );
    }

    // if src has schema and hostname it means its coming from the backend, thus need to convert
    // use hardcoded docker schema + host in order to not expose env var to the client
    // backend host should not change frequently
    const finalSrc = urlHasSchemaAndHostname(src) ? convertUrlToDockerHost(src, 'http://backend:8000') : src
    return <Image src={finalSrc} alt={alt} className={imageClassName} width={width} height={height} />
};

export default CustomImage;
