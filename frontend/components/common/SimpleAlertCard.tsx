'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    className?: string;
};

export default function SimpleAlertCard({
    title,
    description,
    className,
}: Props) {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px] p-4", className)}>
      <Alert className="warning-area-bg warning-text-color max-w-md w-full text-center bg-muted/50 border border-border rounded-lg  border-red-300">
        <Info className="mx-auto !h-8 !w-8 !text-red-500" />
        <AlertTitle className="text-lg font-semibold text-red-950">
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
