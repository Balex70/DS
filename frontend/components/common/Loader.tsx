'use client'

import { Spinner } from '@/components/ui/spinner';

export default function Loader() {
   return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
    }}>
      <Spinner className="spinner-text-color" />
    </div>
  )
}
