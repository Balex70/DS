@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    Order is shipped!
</h2>

<p>
    Full name: {{ $fullName }}
</p>
<p>
    Order Number: <strong>{{ $orderNumber }}</strong>
</p>

@endsection
