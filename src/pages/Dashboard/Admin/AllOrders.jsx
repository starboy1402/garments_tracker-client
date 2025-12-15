import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FiSearch,
    FiShoppingCart,
    FiDollarSign,
    FiPackage,
    FiClock,
    FiCheckCircle,
    FiTruck,
    FiXCircle,
} from 'react-icons/fi';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        document.title = 'All Orders - Admin Dashboard';
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [search, statusFilter, orders]);

    const filterOrders = () => {
            let filtered = orders;

            if (search) {
                filtered = filtered.filter(
                    (order) =>
                        order.buyerEmail.toLowerCase().includes(search.toLowerCase()) ||
                        order.firstName.toLowerCase().includes(search.toLowerCase()) ||
                        order.lastName.toLowerCase().includes(search.toLowerCase()) ||
                        order.productId?.name?.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (statusFilter) {
                filtered = filtered.filter((order) => order.status === statusFilter);
            }

                setFilteredOrders(filtered);
            };
    
        const getStatusBadge = (status) => {
            const badges = {
                pending:
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                approved:
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'in-production':
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                shipped:
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                delivered:
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            };
                return badges[status] || badges.pending;
            };
    
        const getStatusIcon = (status) => {
            const icons = {
                pending: <FiClock />,
                approved: <FiCheckCircle />,
                'in-production': <FiPackage />,
                shipped: <FiTruck />,
                delivered: <FiCheckCircle />,
                cancelled: <FiXCircle />,
                rejected: <FiXCircle />,
            };
                return icons[status] || <FiClock />;
            };
    
        const viewOrderDetails = (order) => {
            const latestTracking = order.tracking?.[order.tracking.length - 1];

            Swal.fire({
                title: `Order #${order._id.slice(-8)}`,
                html: `
        <div class="text-left space-y-3">
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-bold mb-2">Customer Information</h3>
            <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p><strong>Email:</strong> ${order.buyerEmail}</p>
            <p><strong>Contact:</strong> ${order.contactNumber}</p>
            <p><strong>Address:</strong> ${order.deliveryAddress}</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-bold mb-2">Product Information</h3>
            <p><strong>Product:</strong> ${order.productId?.name || 'N/A'}</p>
            <p><strong>Quantity:</strong> ${order.quantity} units</p>
            <p><strong>Unit Price:</strong> $${order.productId?.price || 0}</p>
            <p><strong>Total:</strong> $${order.orderPrice}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-bold mb-2">Order Status</h3>
            <p><strong>Status:</strong> <span class="capitalize">${order.status}</span></p>
            <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            ${latestTracking ? `
              <p><strong>Latest Update:</strong> ${latestTracking.status}</p>
              <p><strong>Location:</strong> ${latestTracking.location || 'N/A'}</p>
              <p><strong>Note:</strong> ${latestTracking.note || 'N/A'}</p>
            ` : ''}
          </div>
          
          ${order.specialNotes ? `
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-bold mb-2">Special Notes</h3>
              <p>${order.specialNotes}</p>
            </div>
          ` : ''}
        </div>
      `,
                width: 700,
                confirmButtonText: 'Close',
                confirmButtonColor: '#0ea5e9',
                });
            };
    
        const getTotalRevenue = () => {
            return orders
                .filter((order) => ['approved', 'in-production', 'shipped', 'delivered'].includes(order.status))
                    .reduce((sum, order) => sum + order.orderPrice, 0);
            };
    
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                );
        }
    
        return (
            <div>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        All Orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage all orders across the platform
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold">{orders.length}</p>
                            </div>
                            <FiShoppingCart className="text-5xl text-blue-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Pending</p>
                                <p className="text-3xl font-bold">
                                    {orders.filter((o) => o.status === 'pending').length}
                                </p>
                            </div>
                            <FiClock className="text-5xl text-yellow-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Completed</p>
                                <p className="text-3xl font-bold">
                                    {orders.filter((o) => o.status === 'delivered').length}
                                </p>
                            </div>
                            <FiCheckCircle className="text-5xl text-green-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Revenue</p>
                                <p className="text-3xl font-bold">${getTotalRevenue().toFixed(0)}</p>
                            </div>
                            <FiDollarSign className="text-5xl text-purple-200" />
                        </div>
                    </motion.div>
                </div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by buyer name, email, or product..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field md:w-48"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="in-production">In Production</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </motion.div>

                {/* Orders Table */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card text-center py-12"
                    >
                        <FiShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No Orders Found
                        </h3>
                        <p className="text-gray-500">
                            {search || statusFilter
                                ? 'Try adjusting your search or filters'
                                : 'No orders placed yet'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card overflow-x-auto"
                    >
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left p-4 font-semibold">Order ID</th>
                                    <th className="text-left p-4 font-semibold">Customer</th>
                                    <th className="text-left p-4 font-semibold">Product</th>
                                    <th className="text-left p-4 font-semibold">Quantity</th>
                                    <th className="text-left p-4 font-semibold">Total</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-left p-4 font-semibold">Date</th>
                                    <th className="text-left p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="p-4 font-mono text-sm">#{order._id.slice(-8)}</td>
                                        <td className="p-4">
                                            <p className="font-semibold">
                                                {order.firstName} {order.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{order.buyerEmail}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium">{order.productId?.name || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                                {order.quantity} units
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-green-600 dark:text-green-400">
                                            ${order.orderPrice}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${getStatusBadge(order.status)
                                                    }`}
                                            >
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize">{order.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => viewOrderDetails(order)}
                                                className="btn-secondary text-sm py-2 px-4"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>
        );
    };

    export default AllOrders;
