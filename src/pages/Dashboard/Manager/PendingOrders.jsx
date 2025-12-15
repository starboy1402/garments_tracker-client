import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FiPackage,
    FiCheck,
    FiX,
    FiUser,
    FiDollarSign,
    FiCalendar,
    FiInfo,
    FiClock,
} from 'react-icons/fi';

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Pending Orders - Manager Dashboard';
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/api/manager/orders/pending');
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch pending orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId, productName, buyerName) => {
        const result = await Swal.fire({
            title: 'Approve Order?',
            html: `
        <div class="text-left">
          <p class="mb-2"><strong>Product:</strong> ${productName}</p>
          <p><strong>Buyer:</strong> ${buyerName}</p>
        </div>
      `,
            text: 'This will move the order to approved status and production can begin.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve order',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.patch(`/api/orders/${orderId}/status`, {
                    status: 'approved',
                });
                toast.success('Order approved successfully!');
                fetchOrders();
            } catch (error) {
                toast.error('Failed to approve order');
                console.error('Error approving order:', error);
            }
        }
    };

    const handleReject = async (orderId, productName, buyerName) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Order',
            html: `
        <div class="text-left mb-4">
          <p class="mb-2"><strong>Product:</strong> ${productName}</p>
          <p><strong>Buyer:</strong> ${buyerName}</p>
        </div>
        <p class="text-sm text-gray-600 mb-2">Please provide a reason for rejection:</p>
      `,
            input: 'textarea',
            inputPlaceholder: 'Enter reason for rejection...',
            inputAttributes: {
                'aria-label': 'Rejection reason',
                'rows': 3,
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Reject Order',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You must provide a reason for rejection!';
                }
                if (value.length < 10) {
                    return 'Reason must be at least 10 characters long!';
                }
            },
        });

        if (reason) {
            try {
                await axiosInstance.patch(`/api/orders/${orderId}/status`, {
                    status: 'rejected',
                    rejectionReason: reason,
                });
                toast.success('Order rejected');
                fetchOrders();
            } catch (error) {
                toast.error('Failed to reject order');
                console.error('Error rejecting order:', error);
            }
        }
    };

    const showOrderDetails = (order) => {
        Swal.fire({
            title: 'Order Details',
            html: `
        <div class="text-left space-y-3">
          <div class="border-b pb-2">
            <p class="text-sm text-gray-600">Product</p>
            <p class="font-semibold">${order.productName}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <p class="text-sm text-gray-600">Quantity</p>
              <p class="font-semibold">${order.quantity} units</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Price</p>
              <p class="font-semibold">$${order.orderPrice}</p>
            </div>
          </div>
          <div class="border-b pb-2">
            <p class="text-sm text-gray-600">Customer</p>
            <p class="font-semibold">${order.firstName} ${order.lastName}</p>
            <p class="text-sm text-gray-500">${order.buyerEmail}</p>
            <p class="text-sm text-gray-500">${order.contactNumber}</p>
          </div>
          <div class="border-b pb-2">
            <p class="text-sm text-gray-600">Delivery Address</p>
            <p class="font-semibold">${order.deliveryAddress}</p>
          </div>
          ${order.additionalNotes
                    ? `
          <div class="border-b pb-2">
            <p class="text-sm text-gray-600">Additional Notes</p>
            <p class="text-gray-700">${order.additionalNotes}</p>
          </div>
          `
                    : ''
                }
          <div>
            <p class="text-sm text-gray-600">Payment Method</p>
            <p class="font-semibold capitalize">${order.paymentMethod}</p>
          </div>
        </div>
      `,
            width: 600,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Close',
        });
    };

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
                    Pending Orders
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Review and approve or reject pending orders
                </p>
            </motion.div>

            {/* Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                Pending Orders
                            </p>
                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                                {orders.length}
                            </p>
                        </div>
                        <FiClock className="text-4xl text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Total Units
                            </p>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                                {orders.reduce((sum, order) => sum + order.quantity, 0)}
                            </p>
                        </div>
                        <FiPackage className="text-4xl text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Total Value
                            </p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                                ${orders.reduce((sum, order) => sum + order.orderPrice, 0).toFixed(2)}
                            </p>
                        </div>
                        <FiDollarSign className="text-4xl text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </motion.div>

            {/* Orders List */}
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {order.productName}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Order ID:{' '}
                                                <span className="font-mono font-medium">
                                                    {order._id.slice(-8)}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => showOrderDetails(order)}
                                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                            title="View details"
                                        >
                                            <FiInfo className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <FiUser className="flex-shrink-0" />
                                            <span className="truncate">
                                                {order.firstName} {order.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <FiPackage className="flex-shrink-0" />
                                            <span>Qty: {order.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <FiDollarSign className="flex-shrink-0" />
                                            <span>${order.orderPrice}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <FiCalendar className="flex-shrink-0" />
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {order.additionalNotes && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Note:
                                            </span>{' '}
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {order.additionalNotes}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2 lg:w-40">
                                    <button
                                        onClick={() =>
                                            handleApprove(
                                                order._id,
                                                order.productName,
                                                `${order.firstName} ${order.lastName}`
                                            )
                                        }
                                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        <FiCheck className="mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleReject(
                                                order._id,
                                                order.productName,
                                                `${order.firstName} ${order.lastName}`
                                            )
                                        }
                                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        <FiX className="mr-2" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card text-center py-12"
                >
                    <FiClock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Pending Orders
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        All orders have been processed. New pending orders will appear here.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default PendingOrders;
