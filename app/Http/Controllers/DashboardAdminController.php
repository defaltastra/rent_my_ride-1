<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Car;
use App\Models\Role;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAdminController extends Controller
{
    public function index()
    {
        try {
            // Rôle admin
            $adminRole = Role::where('name', 'admin')->first();
            
            // Comptage des clients (non admin)
            $totalClientsQuery = User::query();
            if ($adminRole) {
                $totalClientsQuery->where('role_id', '!=', $adminRole->id);
            }
            $totalClients = $totalClientsQuery->count();
            
            // Clients du mois dernier (hors admin)
            $clientsLastMonthQuery = User::whereDate('created_at', '<=', now()->subMonth());
            if ($adminRole) {
                $clientsLastMonthQuery->where('role_id', '!=', $adminRole->id);
            }
            $clientsLastMonth = $clientsLastMonthQuery->count();
            
            $clientsChange = $clientsLastMonth > 0 
                ? round((($totalClients - $clientsLastMonth) / $clientsLastMonth * 100), 2)
                : ($totalClients > 0 ? 100 : 0);

            // Réservations aujourd'hui
            $reservationsToday = Reservation::whereDate('created_at', today())->count();
            
            // Changement des réservations
            $reservationsYesterday = Reservation::whereDate('created_at', today()->subDay())->count();
            $reservationsChange = $reservationsYesterday > 0 
                ? round((($reservationsToday - $reservationsYesterday) / $reservationsYesterday * 100), 2)
                : ($reservationsToday > 0 ? 100 : 0);

            // Voitures les plus réservées
            $popularCars = Car::select('cars.*', DB::raw('COUNT(reservations.id) as reservations_count'))
                ->leftJoin('reservations', function($join) {
                    $join->on('cars.id', '=', 'reservations.car_id')
                         ->where('reservations.status', 'confirmed');
                })
                ->groupBy('cars.id')
                ->orderBy('reservations_count', 'desc')
                ->limit(3)
                ->get()
                ->map(function($car) {
                    return [
                        'id' => $car->id,
                        'name' => $car->marque . ' ' . $car->nom,
                        'reservations' => $car->reservations_count,
                        'image' => $car->photo,
                        'price_per_day' => $car->prix_par_jour
                    ];
                });

            // Revenus
            $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_price');
            
            $currentMonthRevenue = Reservation::where('status', 'confirmed')
                ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
                ->sum('total_price');
                
            $lastMonthRevenue = Reservation::where('status', 'confirmed')
                ->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])
                ->sum('total_price');
                
            $revenueChange = $lastMonthRevenue > 0 
                ? round(($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue * 100, 2)
                : ($currentMonthRevenue > 0 ? 100 : 0);

            // Réservations par mois
            $reservationsByMonth = Reservation::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();
            

            // Remplissage des mois manquants
            $completeReservationsByMonth = array_fill(1, 12, 0);
            foreach ($reservationsByMonth as $month => $count) {
                $completeReservationsByMonth[$month] = $count;
            }

            return inertia('Admin/DashboardAdmin', [
                'stats' => [
                    'reservationsToday' => $reservationsToday,
                    'reservationsChange' => $reservationsChange,
                    'totalClients' => $totalClients,
                    'clientsChange' => $clientsChange,
                    'popularCars' => $popularCars,
                    'totalRevenue' => $totalRevenue,
                    'currentMonthRevenue' => $currentMonthRevenue,
                    'revenueChange' => $revenueChange,
                    'reservationsByMonth' => $completeReservationsByMonth,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            return inertia('Admin/DashboardAdmin', ['stats' => []]);
        }
    }
    public function fetchStats()
{
    try {
        $adminRole = Role::where('name', 'admin')->first();

        $totalClientsQuery = User::query();
        if ($adminRole) {
            $totalClientsQuery->where('role_id', '!=', $adminRole->id);
        }
        $totalClients = $totalClientsQuery->count();

        $clientsLastMonthQuery = User::whereDate('created_at', '<=', now()->subMonth());
        if ($adminRole) {
            $clientsLastMonthQuery->where('role_id', '!=', $adminRole->id);
        }
        $clientsLastMonth = $clientsLastMonthQuery->count();

        $clientsChange = $clientsLastMonth > 0 
            ? round((($totalClients - $clientsLastMonth) / $clientsLastMonth) * 100, 2)
            : ($totalClients > 0 ? 100 : 0);

        $reservationsToday = Reservation::whereDate('created_at', today())->count();

        $reservationsYesterday = Reservation::whereDate('created_at', today()->subDay())->count();
        $reservationsChange = $reservationsYesterday > 0
            ? round((($reservationsToday - $reservationsYesterday) / $reservationsYesterday) * 100, 2)
            : ($reservationsToday > 0 ? 100 : 0);

        $popularCars = Car::select('cars.*', DB::raw('COUNT(reservations.id) as reservations_count'))
            ->leftJoin('reservations', function($join) {
                $join->on('cars.id', '=', 'reservations.car_id')
                     ->where('reservations.status', 'confirmed');
            })
            ->groupBy('cars.id')
            ->orderBy('reservations_count', 'desc')
            ->limit(3)
            ->get()
            ->map(function($car) {
                return [
                    'id' => $car->id,
                    'name' => $car->marque . ' ' . $car->nom,
                    'reservations' => $car->reservations_count,
                    'image' => $car->photo,
                    'price_per_day' => $car->prix_par_jour,
                ];
            });

        $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_price');

        $currentMonthRevenue = Reservation::where('status', 'confirmed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('total_price');

        $lastMonthRevenue = Reservation::where('status', 'confirmed')
            ->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])
            ->sum('total_price');

        $revenueChange = $lastMonthRevenue > 0 
            ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2)
            : ($currentMonthRevenue > 0 ? 100 : 0);

        $reservationsByMonth = Reservation::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $completeReservationsByMonth = array_fill(1, 12, 0);
        foreach ($reservationsByMonth as $month => $count) {
            $completeReservationsByMonth[$month] = $count;
        }

        return response()->json([
            'reservationsToday' => $reservationsToday,
            'reservationsChange' => $reservationsChange,
            'totalClients' => $totalClients,
            'clientsChange' => $clientsChange,
            'popularCars' => $popularCars,
            'totalRevenue' => $totalRevenue,
            'currentMonthRevenue' => $currentMonthRevenue,
            'revenueChange' => $revenueChange,
            'reservationsByMonth' => $completeReservationsByMonth,
        ]);

    } catch (\Exception $e) {
        Log::error('Dashboard API error: ' . $e->getMessage());
        return response()->json([], 500);
    }
}

}