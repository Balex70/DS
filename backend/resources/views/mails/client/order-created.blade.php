@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    {{ __('mails.order_created.greeting', ['name' => $fullName]) }}
</h2>

<p>
    {{ __('mails.order_created.created') }}
</p>
<p>
    {{ __('mails.order_created.order_number') }}: <strong>{{ $orderNumber }}</strong>.
</p>

<p style="margin:32px 0;">
    <a
        href="{{ $link }}"
        style="display:inline-block;background:#0f6776;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;"
    >
        View Order
    </a>
</p>

<p>
    {{ __('mails.order_created.thanks') }},<br>
    {{ config('app.name') }}
</p>

@endsection
