"use client";
import { AvailableGatewayResponse, PaymentResponse } from "@/types/payment";

function submitLiqPayForm(payment: PaymentResponse) {
    const form = document.createElement("form");

    form.method = "POST";
    form.action = payment.redirect_url!;

    form.innerHTML = `
        <input type="hidden" name="data" value="${payment.payload?.data}">
        <input type="hidden" name="signature" value="${payment.payload?.signature}">
    `;

    document.body.appendChild(form);
    
    form.submit();

}

export function SendToPaymentGateway(
    gateway: AvailableGatewayResponse,
    payment: PaymentResponse
) {
    switch (gateway.gateway) {
        case "liqpay":
            submitLiqPayForm(payment);
            break;

        default:
            window.location.href = payment.redirect_url!;
    }
}
