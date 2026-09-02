@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    Hello, {{ $fullName }}
</h2>

<p>
    Your order has been sent!
</p>
<p>
    Order Number: <strong>{{ $orderNumber }}</strong>.
</p>

<p>
    {{ $message }}
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
    Thanks,<br>
    {{ config('app.name') }}
</p>

@endsection
