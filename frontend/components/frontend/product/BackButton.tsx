"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();
    const t = useTranslations('frontend')

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 pl-0"
        >
            <ArrowLeft className="mr-2 size-4" />
            {t('product.back')}
        </Button>
    );
}
