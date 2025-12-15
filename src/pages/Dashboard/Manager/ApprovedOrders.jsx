import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiClock,
  FiPlus,
  FiEye,
  FiCheckCircle,
} from 'react-icons/fi';

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Approved Orders - Manager Dashboard';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/manager/orders/approved');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch approved orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTrackingUpdate = async (orderId, productName) => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Tracking Update',
      html: `
        <div class="text-left mb-4">
          <p class="font-semibold mb-2">${productName}</p>
          <p class="text-sm text-gray-600">Order ID: ${orderId.slice(-8)}</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-left text-sm font-medium mb-2">Status *</label>
            <select id="status" class="swal2-input w-full" style="display: block;">
              <option value="">Select Status</option>
              <option value="Cutting Started">Cutting Started</option>
              <option value="Cutting Completed">Cutting Completed</option>
              <option value="Sewing Started">Sewing Started</option>
              <option value="Sewing Completed">Sewing Completed</option>
              <option value="Finishing">Finishing</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Packing">Packing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label class="block text-left text-sm font-medium mb-2">Location</label>
            <input id="location" class="swal2-input w-full" placeholder="e.g., Production Floor A" style="display: block;">
          </div>
          <div>
            <label class="block text-left text-sm font-medium mb-2">Note</label>
            <textarea id="note" class="swal2-textarea w-full" placeholder="Additional details..." rows="3" style="display: block;"></textarea>
          </div>
        </div>
      `,
      width: 600,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Add Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const status = document.getElementById('status').value;
        const location = document.getElementById('location').value;
        const note = document.getElementById('note').value;

        if (!status) {
          Swal.showValidationMessage('Please select a status');
          return false;
        }

        return { status, location, note };
      },
    });

    if (formValues) {
      try {
        await axiosInstance.post(`/api/orders/${orderId}/tracking`, {
          status: formValues.status,
          location: formValues.location || '',
          note: formValues.note || '',
        });
        toast.success('Tracking update added successfully!');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to add tracking update');
        console.error('Error adding tracking:', error);
      }
    }
  };

  const viewTrackingHistory = (order) => {
    const trackingHTML =
      order.tracking && order.tracking.length > 0
        ? order.tracking
          .map(
            (track, index) => `
          <div class="border-b pb-3 mb-3 text-left ${index === order.tracking.length - 1 ? 'border-0' : ''
              }">
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold text-blue-600">${track.status}</p>
              <span class="text-xs text-gray-500">${new Date(
                track.timestamp
              ).toLocaleDateString()}</span>
            </div>
            ${track.location
                ? `<p class="text-sm text-gray-600">📍 ${track.location}</p>`
                : ''
              }
            ${track.note
                ? `<p class="text-sm text-gray-700 mt-1">${track.note}</p>`
                : ''
              }
            <p class="text-xs text-gray-500 mt-1">${new Date(
                track.timestamp
              ).toLocaleTimeString()}</p>
          </div>
        `
          )
          .join('')
        : '<p class="text-gray-500 text-center py-4">No tracking updates yet</p>';

    Swal.fire({
      title: 'Tracking History',
      html: `
        <div class="text-left mb-3">
          <p class="font-semibold">${order.productName}</p>
          <p class="text-sm text-gray-600">Order ID: ${order._id.slice(-8)}</p>
        </div>
        <div class="max-h-96 overflow-y-auto">
          ${trackingHTML}
        </div>
      `,
      width: 600,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Close',
    });
  };

  const getLatestStatus = (order) => {
    if (order.tracking && order.tracking.length > 0) {
      return order.tracking[order.tracking.length - 1].status;
    }
    return 'Awaiting Production';
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
          Approved Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage production tracking for approved orders
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Approved Orders
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                {orders.length}
              </p>
            </div>
            <FiCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                In Production
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                {orders.filter((o) => o.tracking && o.tracking.length > 0).length}
              </p>
            </div>
            <FiPackage className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Shipped
              </p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                {
                  orders.filter((o) =>
                    getLatestStatus(o).toLowerCase().includes('shipped')
                  ).length
                }
              </p>
            </div>
            <FiTruck className="text-4xl text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Total Units
              </p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-2">
                {orders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
            </div>
            <FiPackage className="text-4xl text-orange-600 dark:text-orange-400" />
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
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
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
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Approved
                      </p>
                      <p className="text-sm font-medium">
                        {order.approvedAt
                          ? new Date(order.approvedAt).toLocaleDateString()
                          : new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Customer:
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.firstName} {order.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Quantity:
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.quantity} units
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Total:
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${order.orderPrice}
                      </p>
                    </div>
                  </div>

                  {/* Latest Tracking Status */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <FiMapPin className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        Current Status: {getLatestStatus(order)}
                      </p>
                      {order.tracking && order.tracking.length > 0 && (
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Updated:{' '}
                          {new Date(
                            order.tracking[order.tracking.length - 1].timestamp
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                      {order.tracking ? order.tracking.length : 0} updates
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:w-48">
                  <button
                    onClick={() => addTrackingUpdate(order._id, order.productName)}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add Update
                  </button>
                  <button
                    onClick={() => viewTrackingHistory(order)}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    <FiEye className="mr-2" />
                    View History
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
          <FiCheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Approved Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Approved orders will appear here for tracking and production management.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ApprovedOrders;
