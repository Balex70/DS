@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    {{ __('mails.order_shipped.greeting', ['name' => $fullName]) }}
</h2>

<p>
    {{ __('mails.order_shipped.shipped') }}
</p>

@if ($tracking_number)
    <p>
        {{ __('mails.order_shipped.tracking_number') }}: <strong>{{ $tracking_number }}</strong>
    </p>
    <p style="margin:32px 0;">
        <a
            href="{{ $link }}"
            style="display:inline-block;background:#0f6776;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;"
        >
           {{ __('mails.order_shipped.track_order_button') }}
        </a>
    </p>

    <p>
        {{ __('mails.order_shipped.order_number') }}: <strong>{{ $orderNumber }}</strong>
    </p>
@endif

@include('mails.includes.order-items', [
    'items' => $items,
    'subtotal' => $subtotal,
    'shipping_cost' => $shipping_cost,
    'total' => $total
])

<p>
    {{ __('mails.order_shipped.thanks') }},<br>
    {{ config('app.name') }}
</p>

@endsection
