import {
    Loader2,
    ClipboardList,
    XCircle,
    ShoppingCart,
    Handbag,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

const steps = {
    "creating-order": {
        icon: ClipboardList,
        title: "checkout.checkout_dialog.creating_order_title",
        description: "checkout.checkout_dialog.creating_order_description",
        color: "text-blue-500",
    },
    "creating-payment": {
        icon: ShoppingCart,
        title: "checkout.checkout_dialog.creating_payment_title",
        description: "checkout.checkout_dialog.creating_payment_description",
        color: "text-indigo-500",
    },
    redirecting: {
        icon: Handbag,
        title: "checkout.checkout_dialog.redirecting_title",
        description: "checkout.checkout_dialog.redirecting_description",
        color: "text-emerald-500",
    },
    failed: {
        icon: XCircle,
        title: "checkout.checkout_dialog.failed_title",
        description: "checkout.checkout_dialog.failed_description",
        color: "text-red-500",
    },
};

type Props = {
    checkoutOpen: boolean;
    setCheckoutOpen: (v: boolean) => void;
    checkoutStatus: string;
}

export function CheckoutDialog({
    checkoutOpen,
    setCheckoutOpen,
    checkoutStatus,
}: Props) {
    const step = steps[checkoutStatus as keyof typeof steps];
    const Icon = step?.icon ?? Loader2;
    const t = useTranslations('frontend')

    const isLoading =
        checkoutStatus === "creating-order" ||
        checkoutStatus === "creating-payment" ||
        checkoutStatus === "redirecting";

    return (
        <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {t('checkout.checkout_dialog.header')}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center text-center space-y-4 py-6">
                    {/* Icon */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-10 h-10 rounded-full bg-primary/10 animate-ping" />

                        <Icon
                            className={`h-8 w-8 ${
                                step?.color ?? "text-muted-foreground"
                            } ${isLoading ? "animate-bounce opacity-80" : ""}`}
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            {t(step?.title)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t(step?.description)}
                        </p>
                    </div>

                    {/* Progress indicator */}
                    {isLoading && (
                        <div className="w-full space-y-2 pt-2">
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-primary animate-pulse rounded-full" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('checkout.checkout_dialog.do_not_close_warning')}
                            </p>
                        </div>
                    )}

                    {/* Error hint */}
                    {checkoutStatus === "failed" && (
                        <button
                            onClick={() => setCheckoutOpen(false)}
                            className="mt-2 text-sm text-red-500 hover:underline"
                        >
                            {t('checkout.checkout_dialog.close_button')}
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
