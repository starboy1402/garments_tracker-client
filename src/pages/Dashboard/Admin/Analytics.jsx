import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
} from 'react-icons/fi';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    document.title = 'Analytics - Admin Dashboard';
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get(`/api/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card text-center py-12">
        <FiActivity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Analytics Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics data will appear here once you have users, products, and orders.
        </p>
      </div>
    );
  }

  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    usersByRole,
    ordersByStatus,
    recentOrders,
    topProducts,
    revenueByPeriod,
  } = analytics;

  // Prepare chart data
  const userRoleData = Object.entries(usersByRole || {}).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
  }));

  const orderStatusData = Object.entries(ordersByStatus || {}).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    })
  );

  const revenueData =
    revenueByPeriod?.map((item) => ({
      date: new Date(item._id).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      revenue: item.total,
      orders: item.count,
    })) || [];

  const topProductsData =
    topProducts?.map((product) => ({
      name: product.name.length > 20 ? product.name.slice(0, 20) + '...' : product.name,
      orders: product.orderCount,
      revenue: product.totalRevenue,
    })) || [];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive insights and statistics
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Total Users
              </p>
              <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                {totalUsers}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
                <FiTrendingUp className="mr-1" />
                Active Platform Users
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <FiUsers className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Total Products
              </p>
              <p className="text-4xl font-bold text-green-700 dark:text-green-300 mt-2">
                {totalProducts}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
                <FiPackage className="mr-1" />
                Available Inventory
              </p>
            </div>
            <div className="w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
              <FiPackage className="text-3xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Total Orders
              </p>
              <p className="text-4xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                {totalOrders}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center">
                <FiShoppingCart className="mr-1" />
                All Time Orders
              </p>
            </div>
            <div className="w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <FiShoppingCart className="text-3xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Total Revenue
              </p>
              <p className="text-4xl font-bold text-orange-700 dark:text-orange-300 mt-2">
                ${totalRevenue?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center">
                <FiDollarSign className="mr-1" />
                All Time Earnings
              </p>
            </div>
            <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
              <FiDollarSign className="text-3xl text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Products by Orders
          </h3>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No product data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Orders by Status
          </h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No order data available
            </div>
          )}
        </motion.div>

        {/* User Role Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Users by Role
          </h3>
          {userRoleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No user data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Orders
        </h3>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {order.buyerEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${order.orderPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${order.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No recent orders</div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
