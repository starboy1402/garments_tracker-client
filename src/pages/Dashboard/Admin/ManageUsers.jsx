import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FiSearch, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        document.title = 'Manage Users - Admin Dashboard';
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'Approve User?',
            text: `Are you sure you want to approve ${userName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.patch(`/api/users/${userId}`, {
                    status: 'approved',
                });
                toast.success('User approved successfully!');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to approve user');
                console.error('Error approving user:', error);
            }
        }
    };

    const handleSuspend = async (userId, userName) => {
        const { value: reason } = await Swal.fire({
            title: 'Suspend User',
            html: `
        <p class="mb-4">You are about to suspend <strong>${userName}</strong></p>
        <p class="text-sm text-gray-600 mb-2">Please provide a reason for suspension:</p>
      `,
            input: 'textarea',
            inputPlaceholder: 'Enter the reason for suspension...',
            inputAttributes: {
                'aria-label': 'Suspension reason',
                'rows': 4,
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Suspend User',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You must provide a reason for suspension!';
                }
                if (value.length < 10) {
                    return 'Reason must be at least 10 characters long!';
                }
            },
        });

        if (reason) {
            try {
                await axiosInstance.patch(`/api/users/${userId}`, {
                    status: 'suspended',
                    suspendedReason: reason,
                });
                toast.success('User suspended successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to suspend user');
                console.error('Error suspending user:', error);
            }
        }
    };

    const handleReactivate = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'Reactivate User?',
            text: `Do you want to reactivate ${userName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reactivate',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.patch(`/api/users/${userId}`, {
                    status: 'approved',
                    suspendedReason: '',
                });
                toast.success('User reactivated successfully!');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to reactivate user');
                console.error('Error reactivating user:', error);
            }
        }
    };

    // Filter users based on search term and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole ? user.role === filterRole : true;
        const matchesStatus = filterStatus ? user.status === filterStatus : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'suspended':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'buyer':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
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
                    Manage Users
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Approve, suspend, or manage user accounts
                </p>
            </motion.div>

            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2">
                            <FiSearch className="inline mr-2" />
                            Search Users
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    {/* Filter by Role */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Filter by Role
                        </label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Filter by Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </motion.div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {/* User Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={user.photoURL || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40';
                                                    }}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleBadgeClass(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(
                                                        user.status
                                                    )}`}
                                                >
                                                    {user.status}
                                                </span>
                                                {user.status === 'suspended' && user.suspendedReason && (
                                                    <button
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: 'Suspension Reason',
                                                                html: `<p class="text-left"><strong>User:</strong> ${user.name}</p><p class="text-left mt-2"><strong>Reason:</strong> ${user.suspendedReason}</p>`,
                                                                icon: 'info',
                                                                confirmButtonColor: '#3b82f6',
                                                            });
                                                        }}
                                                        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        title="View suspension reason"
                                                    >
                                                        <FiAlertCircle />
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {user.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(user._id, user.name)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        <FiCheck className="mr-1" />
                                                        Approve
                                                    </button>
                                                )}

                                                {user.status === 'approved' && user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleSuspend(user._id, user.name)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    >
                                                        <FiX className="mr-1" />
                                                        Suspend
                                                    </button>
                                                )}

                                                {user.status === 'suspended' && (
                                                    <button
                                                        onClick={() => handleReactivate(user._id, user.name)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    >
                                                        <FiCheck className="mr-1" />
                                                        Reactivate
                                                    </button>
                                                )}

                                                {user.role === 'admin' && user.status === 'approved' && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                        Admin user
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center">
                                            <FiSearch className="w-12 h-12 mb-4 text-gray-400" />
                                            <p className="text-lg font-medium">No users found</p>
                                            <p className="text-sm mt-1">
                                                Try adjusting your search or filter criteria
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
            >
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Total Users
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                        {users.length}
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        Pending Approval
                    </p>
                    <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                        {users.filter((u) => u.status === 'pending').length}
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Approved Users
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                        {users.filter((u) => u.status === 'approved').length}
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Suspended Users
                    </p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                        {users.filter((u) => u.status === 'suspended').length}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ManageUsers;
