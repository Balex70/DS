import { CheckoutPaymentResultComponent } from "@/components/frontend/checkout/payment-result-component";

type Props = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function CheckoutPaymentResultPage({searchParams}: Props) {
    const { token } = await searchParams
    return (
        <div className="container mx-auto px-0 sm:px-4 py-0">
            <CheckoutPaymentResultComponent token={token} />
        </div>
    );
}
