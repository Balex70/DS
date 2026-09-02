'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function NotFoundCard({title, description}: { title: string, description: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Alert className="warning-area-bg warning-text-color max-w-md w-full text-center bg-muted/50 border border-border shadow-sm rounded-2xl">
        <Info className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
        <AlertTitle className="text-lg font-semibold">
          { title }
        </AlertTitle>
        <AlertDescription className="text-muted-foreground main-text-color-80 text-tight text-sm mt-1">
          { description }
        </AlertDescription>
      </Alert>
    </div>
  )
}
