@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    {{ __('mails.order_paid.greeting', ['name' => $fullName]) }}
</h2>

<p>
    {{ __('mails.order_paid.paid') }}
</p>
<p>
    {{ __('mails.order_paid.order_number') }}: <strong>{{ $orderNumber }}</strong>
</p>

@include('mails.includes.order-items', [
    'items' => $items,
    'subtotal' => $subtotal,
    'shipping_cost' => $shipping_cost,
    'total' => $total
])

<p>
    {{ __('mails.order_paid.thanks') }},<br>
    {{ config('app.name') }}
</p>

@endsection
