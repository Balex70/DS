'use client'

import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    className?: string;
};

export default function SimpleSkeletonLoader({
    label,
    className,
}: Props) {
   return (
    <div className={cn(className)}>
      <Skeleton className="h-2 w-full rounded-full"/>
      <p className="mt-2 animate-pulse text-left text-xs text-muted-foreground">
          {label}
      </p>
    </div>
  )
}
