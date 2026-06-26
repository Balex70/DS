'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function LanguageSwitcher() {
    const router = useRouter()
    const [locale, setLocale] = useState('en')

    const handleChange = (value: string) => {   
        setLocale(value)

        document.cookie = `locale=${value}; path=/; max-age=31536000`

        router.refresh() // re-fetch server components
    }

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-[60px]">
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="pl">PL</SelectItem>
                <SelectItem value="de">DE</SelectItem>
            </SelectContent>
        </Select>
    )
}
