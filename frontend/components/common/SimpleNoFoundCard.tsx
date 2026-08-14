'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    className?: string;
};

export default function SimpleNotFoundCard({
    title,
    description,
    className,
}: Props) {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px] p-4", className)}>
      <Alert className="warning-area-bg warning-text-color max-w-md w-full text-center bg-muted/50 border border-border rounded-lg">
        <Info className="mx-auto !h-6 !w-6 !text-red-500" />
        <AlertTitle className="text-lg font-semibold">
          { title }
        </AlertTitle>
        {description && 
          <AlertDescription className="text-muted-foreground main-text-color-80 text-tight text-sm mt-1">
            { description }
          </AlertDescription>
        }
      </Alert>
    </div>
  )
}
