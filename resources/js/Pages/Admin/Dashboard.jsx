import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminNavbar from '@/Components/AdminNavbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const DashboardAdmin = () => {
    const [stats, setStats] = useState({
        reservationsToday: 0,
        reservationsChange: 0,
        totalClients: 0,
        clientsChange: 0,
        popularCars: [],
        totalRevenue: 0,
        currentMonthRevenue: 0,
        revenueChange: 0,
        reservationsByMonth: Array.from({ length: 12 }, () => 0),
    });

    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/admin/stats');
            const data = response.data;
    
            if (data.reservationsByMonth && typeof data.reservationsByMonth === 'object' && !Array.isArray(data.reservationsByMonth)) {
                const arr = Array(12).fill(0);
                Object.entries(data.reservationsByMonth).forEach(([month, count]) => {
                    const index = parseInt(month, 10) - 1;
                    if (index >= 0 && index < 12) {
                        arr[index] = count;
                    }
                });
                data.reservationsByMonth = arr;
            }
    
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur de chargement des stats:', error);
        }
    };
    
    

    useEffect(() => {
        fetchStats();

        const interval = setInterval(() => {
            fetchStats();
        }, 30000); 

        return () => clearInterval(interval);
    }, []);

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('fr-FR', { month: 'short' });
    };
    const reservationsArray = Array.isArray(stats.reservationsByMonth)
    ? stats.reservationsByMonth
    : Array.from({ length: 12 }, () => 0);
  
  const chartData = reservationsArray.map((count, index) => ({
    month: getMonthName(index + 1),
    reservations: count,
  }));
  
      
    const formatMAD = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9d5b3] to-[#9cb3c5]">
                <p className="text-[#2c3e50] font-medium">Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <>
         <AdminNavbar/>
        <div className="min-h-screen bg-gradient-to-br from-[#f9d5b3] to-[#9cb3c5] p-6">
           
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Tableau de Bord Admin</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Réservations aujourd'hui */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
                >
                    <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg bg-[#f9d5b3]/30 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d1b7b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-[#2c3e50]/80 text-sm font-medium">Réservations Aujourd'hui</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#2c3e50] my-2">{stats.reservationsToday}</p>
                    <div className={`flex items-center ${stats.reservationsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="text-sm font-medium">
                            {stats.reservationsChange > 0 ? '+' : ''}{stats.reservationsChange}%
                        </span>
                        <span className="text-xs ml-1">vs hier</span>
                    </div>
                </motion.div>

                {/* Clients inscrits */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
                >
                    <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg bg-[#f0c1a0]/30 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d1b7b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-[#2c3e50]/80 text-sm font-medium">Clients Inscrits</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#2c3e50] my-2">{stats.totalClients}</p>
                    <div className={`flex items-center ${stats.clientsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="text-sm font-medium">
                            {stats.clientsChange > 0 ? '+' : ''}{stats.clientsChange}%
                        </span>
                        <span className="text-xs ml-1">vs mois dernier</span>
                    </div>
                </motion.div>

                {/* Revenu mensuel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
                >
                    <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg bg-[#d1b7b5]/30 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d1b7b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-[#2c3e50]/80 text-sm font-medium">Revenu Mensuel</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#2c3e50] my-2">
                        {formatMAD(stats.currentMonthRevenue)}
                    </p>
                    <div className={`flex items-center ${stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="text-sm font-medium">
                            {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}%
                        </span>
                        <span className="text-xs ml-1">vs mois dernier</span>
                    </div>
                </motion.div>

                {/* Revenu total */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
                >
                    <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg bg-[#b7c7d6]/30 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d1b7b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-[#2c3e50]/80 text-sm font-medium">Revenu Total</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#2c3e50] my-2">
                        {formatMAD(stats.totalRevenue)}
                    </p>
                    <div className="flex items-center text-[#2c3e50]/60">
                        <span className="text-xs ml-1">Toutes les réservations</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voitures populaires */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
                >
                    <h3 className="text-[#2c3e50]/80 text-sm font-medium mb-4">Voitures les plus réservées</h3>
                    {stats.popularCars.length > 0 ? (
                        <div className="space-y-4">
                            {stats.popularCars.map((car, index) => (
                                <div key={car.id || index} className="flex items-center">
                                    <div className="w-2/3">
                                        <p className="text-sm font-medium text-[#2c3e50]">{car.name}</p>
                                        <div className="w-full bg-[#f0c1a0]/20 rounded-full h-2 mt-1">
                                            <div 
                                                className="h-2 rounded-full" 
                                                style={{ 
                                                    width: `${(car.reservations / Math.max(...stats.popularCars.map(c => c.reservations))) * 100}%`,
                                                    background: `linear-gradient(90deg, ${['#f9d5b3', '#f0c1a0', '#d1b7b5', '#b7c7d6', '#9cb3c5'][index % 5]}, ${['#f0c1a0', '#d1b7b5', '#b7c7d6', '#9cb3c5', '#f9d5b3'][index % 5]})`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-1/3 text-right">
                                        <p className="text-sm font-bold text-[#2c3e50]">
                                            {car.reservations} réservations
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#2c3e50]/60 text-sm">Aucune donnée disponible</p>
                    )}
                </motion.div>

                {/* Graphique des réservations par mois */}
                <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 lg:col-span-2"
      style={{ width: '100%', height: 300 }}
    >
      <h3 className="text-[#2c3e50]/80 text-sm font-medium mb-4">Réservations par Mois</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(value) => [value, 'Réservations']} />
          <Bar dataKey="reservations" fill="#f9d5b3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
            </div>
        </div>
        </>
    );
};

export default DashboardAdmin;