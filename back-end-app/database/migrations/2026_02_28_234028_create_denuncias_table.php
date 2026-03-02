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
        Schema::create('denuncias', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->string('category');
            $table->json('mediaUrls')->nullable();
            $table->string('status')->default('em análise');
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->string('addressType')->nullable();
            $table->text('manualAddress')->nullable();
            $table->string('addressStreet')->nullable();
            $table->string('addressNumber')->nullable();
            $table->string('addressNeighborhood')->nullable();
            $table->string('addressCity')->nullable();
            $table->string('addressState')->nullable()->default('AC');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('denuncias');
    }
};
