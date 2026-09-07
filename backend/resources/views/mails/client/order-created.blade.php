@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    {{ __('mails.order_created.greeting', ['name' => $fullName]) }}
</h2>

<p>
    {{ __('mails.order_created.created') }}
</p>
<p>
    {{ __('mails.order_created.order_number') }}: <strong>{{ $orderNumber }}</strong>
</p>

@include('mails.includes.order-items', [
    'items' => $items,
    'subtotal' => $subtotal,
    'shipping_cost' => $shipping_cost,
    'total' => $total
])

<p>
    {{ __('mails.order_created.thanks') }},<br>
    {{ config('app.name') }}
</p>

@endsection
