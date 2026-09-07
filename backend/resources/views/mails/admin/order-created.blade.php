@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    New order has been created!
</h2>

<p>
    Full name: {{ $fullName }}
</p>
<p>
    Order Number: <strong>{{ $orderNumber }}</strong>.
</p>

@endsection
