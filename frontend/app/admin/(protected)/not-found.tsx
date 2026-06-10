'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-bg flex min-h-screen flex-col items-center justify-center text-foreground px-6 text-center">

      {/* Image */}
      <div className="mb-8">
          <Image
            src="/sad_minion.png"
            alt="Confused minion"
            width={320}
            height={320}
            priority
          />
      </div>

      {/* Title */}
      <h1 className="not-found-text-color text-7xl font-extrabold tracking-tight mb-4">
        404
      </h1>

      {/* Message */}
      <p className="not-found-text-color text-2xl font-semibold mb-2">
        Oops! Even the Minions got lost.
      </p>

      <p className="text-muted-foreground max-w-md mb-8">
        The page you&apos;re looking for wandered off somewhere on the internet.
        Maybe a Minion pressed the wrong button.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-3 mb-6">
        <Link href="/">
          <Button size="lg" className="not-found-button-bg">🏠 Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
