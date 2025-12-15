import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FiPackage,
    FiShoppingBag,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiTruck,
    FiEye,
} from 'react-icons/fi';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        document.title = 'My Orders - Buyer Dashboard';
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/api/buyer/orders');
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId, productName) => {
        const result = await Swal.fire({
            title: 'Cancel Order?',
            html: `
        <p class="mb-2">Are you sure you want to cancel this order?</p>
        <p class="text-sm text-gray-600"><strong>Product:</strong> ${productName}</p>
      `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, cancel order',
            cancelButtonText: 'Keep order',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.patch(`/api/orders/${orderId}/cancel`);
                toast.success('Order cancelled successfully');
                fetchOrders();
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Failed to cancel order';
                toast.error(errorMessage);
                console.error('Error cancelling order:', error);
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="text-yellow-600" />;
            case 'approved':
                return <FiCheckCircle className="text-green-600" />;
            case 'rejected':
                return <FiXCircle className="text-red-600" />;
            case 'cancelled':
                return <FiXCircle className="text-gray-600" />;
            default:
                return <FiPackage className="text-blue-600" />;
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    const filteredOrders = filterStatus
        ? orders.filter((order) => order.status === filterStatus)
        : orders;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    My Orders
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View and manage your product orders
                </p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Total Orders
                            </p>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                                {orders.length}
                            </p>
                        </div>
                        <FiShoppingBag className="text-4xl text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                Pending
                            </p>
                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                                {orders.filter((o) => o.status === 'pending').length}
                            </p>
                        </div>
                        <FiClock className="text-4xl text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Approved
                            </p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                                {orders.filter((o) => o.status === 'approved').length}
                            </p>
                        </div>
                        <FiCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                In Production
                            </p>
                            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                                {orders.filter((o) => o.tracking && o.tracking.length > 0).length}
                            </p>
                        </div>
                        <FiTruck className="text-4xl text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </motion.div>

            {/* Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mb-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">
                            Filter by Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field max-w-xs"
                        >
                            <option value="">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                </div>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {order.productName}
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div>
                                                    <span className="font-medium">Order ID:</span>{' '}
                                                    <span className="font-mono">{order._id.slice(-8)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Quantity:</span> {order.quantity}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Total:</span> ${order.orderPrice}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Payment:</span>{' '}
                                                    <span className="capitalize">{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col items-end gap-3">
                                    <span
                                        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full capitalize ${getStatusBadgeClass(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/dashboard/track-order/${order._id}`}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                        >
                                            <FiEye className="mr-2" />
                                            Track Order
                                        </Link>

                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id, order.productName)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                            >
                                                <FiXCircle className="mr-2" />
                                                Cancel
                                            </button>
                                        )}
                                    </div>

                                    {/* Tracking Info Preview */}
                                    {order.tracking && order.tracking.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Latest: {order.tracking[order.tracking.length - 1].status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card text-center py-12"
                >
                    <FiShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {filterStatus ? 'No orders with this status' : 'No orders yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {filterStatus
                            ? 'Try selecting a different status filter'
                            : "You haven't placed any orders yet. Start shopping now!"}
                    </p>
                    {!filterStatus && (
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default MyOrders;
