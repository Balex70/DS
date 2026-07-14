<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('material_translations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('material_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('locale', 5); // en, de, pl, sv, en-US...

            $table->string('name');

            $table->timestamp('translated_at')->nullable();

            $table->timestamps();

            $table->unique(['material_id', 'locale']);
            $table->index('locale');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_translations');
    }
};
