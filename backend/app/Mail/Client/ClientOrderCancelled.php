<?php

namespace App\Mail\Client;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class ClientOrderCancelled extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(private Order $order)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        App::setLocale($this->order->locale);

        return new Envelope(
            subject: __('mails.order_cancelled.subject'),
            from: new Address(
                config('mail.from.address'),
                __('mails.from.name'),
            ),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        App::setLocale($this->order->locale);
        $items = $this->order->items->map(function ($item) {
            $variant = ProductVariant::with([
                'translation' => fn ($q) => $q->where('locale', $this->order->locale),
            ])->find($item->product_id);

            $item->translated_title =
                $variant?->translation?->name
                ?? $variant?->name
                ?? $item->title;

            return $item;
        });

        return new Content(
            markdown: 'mails.client.order-cancelled',
            with: [
                'orderNumber' => $this->order->order_number,
                'fullName' => $this->order->shipping_full_name,
                'items' => $items,
                'subtotal' => $this->order->subtotal,
                'shipping_cost' => $this->order->shipping_cost,
                'total' => $this->order->total,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
