import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import {
    FiPackage,
    FiScissors,
    FiTool,
    FiCheckCircle,
    FiBox,
    FiTruck,
    FiHome,
    FiClock,
    FiMapPin,
    FiFileText,
    FiArrowLeft,
} from 'react-icons/fi';

const TrackOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Track Order - Buyer Dashboard';
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await axiosInstance.get(`/api/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            toast.error('Failed to fetch order details');
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        const statusLower = status.toLowerCase();
        const icons = {
            'order placed': <FiPackage />,
            'cutting completed': <FiScissors />,
            'cutting started': <FiScissors />,
            'sewing started': <FiTool />,
            'sewing completed': <FiTool />,
            'finishing': <FiCheckCircle />,
            'qc checked': <FiCheckCircle />,
            'quality check': <FiCheckCircle />,
            'packed': <FiBox />,
            'packing': <FiBox />,
            'shipped': <FiTruck />,
            'out for delivery': <FiTruck />,
            'delivered': <FiHome />,
        };

        for (const [key, icon] of Object.entries(icons)) {
            if (statusLower.includes(key)) {
                return icon;
            }
        }
        return <FiPackage />;
    };

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('delivered')) return 'text-green-600';
        if (statusLower.includes('shipped') || statusLower.includes('delivery'))
            return 'text-blue-600';
        if (statusLower.includes('packed') || statusLower.includes('qc'))
            return 'text-purple-600';
        if (statusLower.includes('sewing') || statusLower.includes('finishing'))
            return 'text-indigo-600';
        if (statusLower.includes('cutting')) return 'text-orange-600';
        return 'text-gray-600';
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="card text-center py-12">
                <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Order Not Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The order you're looking for doesn't exist or you don't have access to it.
                </p>
                <Link
                    to="/dashboard/my-orders"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to My Orders
                </Link>
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
                <Link
                    to="/dashboard/my-orders"
                    className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to My Orders
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Order Tracking
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track your order's production and delivery status
                </p>
            </motion.div>

            {/* Order Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {order.productName}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Order ID:{' '}
                            <span className="font-mono font-medium text-gray-900 dark:text-white">
                                {order._id}
                            </span>
                        </p>
                    </div>
                    <span
                        className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full capitalize ${getStatusBadgeClass(
                            order.status
                        )}`}
                    >
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                            {order.quantity} units
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                            ${order.orderPrice}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                            {order.paymentMethod}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Delivery Information */}
            {order.deliveryAddress && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card mb-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Delivery Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Customer Name</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                                {order.firstName} {order.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Contact Number</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                                {order.contactNumber}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Address</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                                {order.deliveryAddress}
                            </p>
                        </div>
                        {order.additionalNotes && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Additional Notes
                                </p>
                                <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                                    {order.additionalNotes}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Tracking Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Production Timeline
                </h3>

                {order.tracking && order.tracking.length > 0 ? (
                    <div className="space-y-6">
                        {order.tracking.map((track, index) => {
                            const isLast = index === order.tracking.length - 1;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="flex gap-4">
                                        {/* Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isLast
                                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 ring-4 ring-primary-200 dark:ring-primary-800'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }`}
                                            >
                                                {getStatusIcon(track.status)}
                                            </div>
                                            {index < order.tracking.length - 1 && (
                                                <div className="w-0.5 h-full min-h-[60px] bg-gray-200 dark:bg-gray-700 mt-2"></div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-8">
                                            <div
                                                className={`rounded-lg border p-4 ${isLast
                                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4
                                                        className={`text-lg font-semibold ${isLast
                                                                ? 'text-primary-700 dark:text-primary-400'
                                                                : 'text-gray-900 dark:text-white'
                                                            }`}
                                                    >
                                                        {track.status}
                                                    </h4>
                                                    {isLast && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-600 text-white">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    <FiClock className="mr-2" />
                                                    {new Date(track.timestamp).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>

                                                {track.location && (
                                                    <div className="flex items-start text-sm mb-2">
                                                        <FiMapPin className="mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {track.location}
                                                        </span>
                                                    </div>
                                                )}

                                                {track.note && (
                                                    <div className="flex items-start text-sm">
                                                        <FiFileText className="mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {track.note}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Tracking Updates Yet
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Your order is being processed. Tracking updates will appear here once
                            production begins.
                        </p>
                        {order.status === 'pending' && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3">
                                Waiting for manager approval...
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TrackOrder;
