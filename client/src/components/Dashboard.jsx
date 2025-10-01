import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/useAxios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    Axios.get('/api/admin/dashboard-stats'),
                    Axios.get('/api/admin/order-analytics'),
                ]);

                setStats(statsRes.data.data);
                setAnalytics(analyticsRes.data.data);

                // compute orders by status (from stats.recentOrders OR backend should provide)
                const statusCounts = {};
                statsRes.data.data?.recentOrders?.forEach(order => {
                    const status = order.order_status?.toLowerCase();
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                });
                setOrdersByStatus(Object.entries(statusCounts).map(([key, count]) => ({ _id: key, count })));
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'ADMIN') {
            fetchDashboardData();
        }
    }, [user]);

    // Chart data
    const lineChartData = {
        labels: analytics.map(item => item._id),
        datasets: [
            {
                label: 'Orders',
                data: analytics.map(item => item.orders),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: analytics.map(item => item._id),
        datasets: [
            {
                label: 'Revenue (₹)',
                data: analytics.map(item => item.revenue),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    const doughnutData = {
        labels: ordersByStatus.map(item => item._id),
        datasets: [
            {
                data: ordersByStatus.map(item => item.count),
                backgroundColor: [
                    '#3B82F6', // Blue
                    '#10B981', // Green
                    '#F59E0B', // Yellow
                    '#EF4444', // Red
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
            x: { grid: { color: 'rgba(0,0,0,0.1)' } },
        },
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center text-red-500 text-xl">Access Denied - Admin Only</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back<br></br>{user.name},Here's what's happening with your store.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon="📦" color="blue" />
                    <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="green" />
                    <StatCard title="Total Products" value={stats?.totalProducts || 0} icon="🛍️" color="purple" />
                    <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} icon="💰" color="yellow" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Orders Trend</h2>
                        <div className="h-80">
                            {analytics.length > 0 ? <Line data={lineChartData} options={chartOptions} /> : <p className="text-gray-500">No data</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Orders by Status</h2>
                        <div className="h-80">
                            {ordersByStatus.length > 0 ? (
                                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                            ) : (
                                <p className="text-gray-500">No data</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue Bar Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue Analytics</h2>
                    <div className="h-80">
                        {analytics.length > 0 ? <Bar data={barChartData} options={chartOptions} /> : <p className="text-gray-500">No data</p>}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats?.recentOrders?.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.userId?.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{order.userId?.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalAmount?.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <div className="bg-white overflow-hidden shadow-md rounded-lg">
            <div className="p-6">
                <div className="flex items-center">
                    <div className={`p-3 rounded-md ${colorClasses[color]}`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    <div className="ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
