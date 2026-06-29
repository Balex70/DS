'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Locale } from '@/i18n/config';
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname();
    const locale = useLocale();

    function switchLocale(nextLocale: Locale) {
        const segments = pathname.split('/');
        segments[1] = nextLocale; // replace locale segment
        const nextPath = segments.join('/');

        router.push(nextPath);
    }

    return (
        <Select value={locale} onValueChange={switchLocale}>
            <SelectTrigger className="w-[60px]">
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
            </SelectContent>
        </Select>
    )
}
