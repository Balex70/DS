'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/context/CurrencyContext';

export default function CurrencySwitcher() {
 
    const {currency, setCurrency} = useCurrency();
    return (
        <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[60px]">
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UAH">UAH</SelectItem>
            </SelectContent>
        </Select>
    )
}
