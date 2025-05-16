<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Reçu de Réservation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* lighter gray for better contrast */
        }

        .header-bg {
            background: linear-gradient(135deg, #6b7280, #374151); /* soft dark gradient */
            color: #f9fafb;
        }

        .logo {
            max-height: 56px;
            max-width: 56px;
        }

        table {
            border-collapse: separate;
            border-spacing: 0 0.75rem;
            width: 100%;
        }

        th {
            font-weight: 600;
            color: #6b7280;
            padding-bottom: 0.25rem;
            text-align: left;
        }

        td {
            background: #f9fafb;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem; /* rounded corners for each cell */
            box-shadow: 0 1px 3px rgb(0 0 0 / 0.05);
        }

        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: capitalize;
            user-select: none;
        }

        .status-confirmed {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .divider {
            height: 3px;
            background: linear-gradient(90deg, #fbbf24, #f97316);
            border-radius: 9999px;
            margin-top: 2rem;
            margin-left: auto;
            margin-right: auto;
            width: 80px;
        }
    </style>
</head>
<body class="p-8">
    <div class="max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class="bg-black p-6 text-center">
            <div class="bg-white inline-block px-6 py-4 rounded-lg shadow">
                <h1 class="text-3xl font-bold tracking-tight text-black">Reçu de Réservation</h1>
                <p class="mt-1 text-sm font-semibold text-black">{{ now()->format('d/m/Y') }}</p>
            </div>
        </div>
        

        <!-- Body -->
        <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">Détails de la Réservation</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Voiture</th>
                        <td>{{ $reservation->car->nom }}</td>
                    </tr>
                    <tr>
                        <th>Date de début</th>
                        <td>{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <th>Date de fin</th>
                        <td>{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <th>Prix par jour</th>
                        <td>{{ number_format($reservation->car->prix_par_jour, 2, ',', ' ') }} €</td>
                    </tr>
                    <tr>
                        <th>Prix total</th>
                        <td>{{ number_format($reservation->total_price, 2, ',', ' ') }} €</td>
                    </tr>
                    <tr>
                        <th>Statut</th>
                        <td>
                            <span
                                class="status
                                {{ $reservation->status === 'confirmed' ? 'status-confirmed' : '' }}
                                {{ $reservation->status === 'pending' ? 'status-pending' : '' }}
                                {{ $reservation->status === 'cancelled' ? 'status-cancelled' : '' }}
                                ">
                                {{ ucfirst($reservation->status) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Footer Note -->
            <div class="text-center mt-10">
                <p class="text-gray-600 text-base mb-1">Merci pour votre confiance.</p>
                <p class="text-gray-400 text-sm">Ce document est un reçu officiel de votre réservation.</p>
                <div class="divider"></div>
            </div>
        </div>
    </div>
</body>
</html>
