"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from 'next-intl'

type ImportDutyDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export default function ImportDutyDialog({
    open,
    onOpenChange,
    onConfirm,
}: ImportDutyDialogProps) {
    const [accepted, setAccepted] = useState(false);
    const t = useTranslations('frontend')

    function handleConfirm() {
        if (!accepted) return;

        onOpenChange(false);
        onConfirm();
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <TriangleAlert className="h-5 w-5 text-amber-500" />
                        {t('checkout.import_duty_dialog.header')}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-4 pt-2 text-left">
                        <p>
                            {t('checkout.import_duty_dialog.text_1')}
                        </p>

                        <p>
                            {t.rich('checkout.import_duty_dialog.text_2', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>

                        <p>
                            {t.rich('checkout.import_duty_dialog.text_3', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>

                        <div className="flex items-start space-x-3 rounded-lg border p-3">
                            <Checkbox
                                id="accept-import-fees"
                                checked={accepted}
                                onCheckedChange={(checked) =>
                                    setAccepted(checked === true)
                                }
                            />

                            <Label
                                htmlFor="accept-import-fees"
                                className="cursor-pointer leading-6"
                            >
                                {t('checkout.import_duty_dialog.accept_text')}
                            </Label>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            setAccepted(false);
                        }}
                    >
                        {t('checkout.import_duty_dialog.cancel_button')}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={!accepted}
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                    >
                        {t('checkout.import_duty_dialog.accept_button')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
