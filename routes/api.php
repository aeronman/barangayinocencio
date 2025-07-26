<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\CollectedBottleController;
use App\Http\Controllers\CommitteeMemberController;
use App\Http\Controllers\ComputerServiceReservationsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegistrationServiceController;
use App\Http\Controllers\FacilityReservationServiceController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OtherServiceReservationsController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PrintingServiceReservationController;
use App\Http\Controllers\ResourceLendingServiceController;
use App\Http\Controllers\ResourceReservationServiceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TransparencyController;
use App\Http\Controllers\VolunteerServiceController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('auth.login');
Route::apiResource('members', MemberController::class);
Route::apiResource('news', NewsController::class);
Route::apiResource('announcements', AnnouncementController::class);
Route::apiResource('transparencies', TransparencyController::class);
Route::apiResource('printing-services', PrintingServiceReservationController::class);
Route::apiResource('computer-services', ComputerServiceReservationsController::class);
Route::apiResource('other-services', OtherServiceReservationsController::class);

Route::apiResource('participants', ParticipantController::class);
Route::apiResource('teams', TeamController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('carousel', CarouselController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource('rrs', ResourceReservationServiceController::class);
Route::apiResource('ers', EventRegistrationServiceController::class);
Route::apiResource('frs', FacilityReservationServiceController::class);
Route::apiResource('rls', ResourceLendingServiceController::class);
Route::apiResource('vs', VolunteerServiceController::class);

Route::apiResource('committee', CommitteeMemberController::class);
Route::apiResource('faqs', FaqController::class);

Route::get('settings', [SettingController::class, 'index']);
Route::get('available-resources/computer', [ResourceReservationServiceController::class, 'availableComputerResources']);
Route::get('available-resources/printing', [ResourceReservationServiceController::class, 'availablePrintingResources']);
Route::get('available-resources/rrs/{service_name}', [ResourceReservationServiceController::class, 'availableResources']);
Route::get('available-resources/computer-reservations-weekly', [ResourceReservationServiceController::class, 'computerWeeklyReservations']);
Route::get('available-resources/printing-reservations-weekly', [ResourceReservationServiceController::class, 'printingWeeklyReservations']);
Route::get('/collected-bottles', [CollectedBottleController::class, 'getCollectedBottles']);
Route::put('/collected-bottles', [CollectedBottleController::class, 'updateCollectedBottles']);

Route::post('settings/save', [SettingController::class, 'save'])->name('settings.save');
Route::post('/feedback', [FeedbackController::class, 'store']);
Route::post('transparencies/{categoryId}/upload', [TransparencyController::class, 'uploadFile'])->name('transparency.uploadFile');
Route::post('/check-email', [MemberController::class, 'checkEmail']);
Route::delete('settings/{setting}', [SettingController::class, 'destroy']);

Route::put('/printing-services/{id}/mark-as-done', [PrintingServiceReservationController::class, 'markAsDone']);
Route::put('/printing-services/{id}/cancel', [PrintingServiceReservationController::class, 'cancel']);
Route::put('/computer-services/{id}/mark-as-done', [ComputerServiceReservationsController::class, 'markAsDone']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
});