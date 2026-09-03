<?php

namespace App\Mail\Client;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class ClientOrderCreated extends Mailable
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
            subject: __('mails.order_created.subject'),
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

        return new Content(
            markdown: 'mails.client.order-created',
            with: [
                'orderNumber' => $this->order->order_number,
                'fullName' => $this->order->shipping_full_name,
                'link' => '/orders',
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
