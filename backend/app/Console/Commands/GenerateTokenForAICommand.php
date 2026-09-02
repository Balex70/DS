<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:generate-token-for-ai')]
#[Description('Generate token for ai-texts and ai-images endpoints, should be saved in .env of ai-text/ai-images workers')]
class GenerateTokenForAICommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::where('email', env('SUPER_ADMIN_EMAIL'))->first();
        
        $token = $user->createToken('ai-worker', [
            'ai:texts',
            'ai:images',
        ])->plainTextToken;
        $this->info('Token for AI workers: ' . $token);
    }
}
