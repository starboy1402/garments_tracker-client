import { useAuth } from '../../../providers/AuthProvider';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiShield, FiCalendar } from 'react-icons/fi';

const Profile = () => {
    const { user, userRole, logoutUser } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card max-w-2xl"
            >
                <div className="flex items-center space-x-6 mb-8">
                    <img
                        src={user?.photoURL || 'https://via.placeholder.com/150'}
                        alt={user?.displayName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                        <div className="mt-2">
                            <span
                                className={`badge ${userRole?.status === 'approved'
                                        ? 'badge-approved'
                                        : userRole?.status === 'pending'
                                            ? 'badge-pending'
                                            : 'badge-suspended'
                                    }`}
                            >
                                {userRole?.status}
                            </span>
                            <span className="badge badge-approved ml-2 capitalize">
                                {userRole?.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiMail className="w-5 h-5 text-primary-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiUser className="w-5 h-5 text-primary-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                            <p className="font-medium">{user?.displayName}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiShield className="w-5 h-5 text-primary-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                            <p className="font-medium capitalize">{userRole?.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FiCalendar className="w-5 h-5 text-primary-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Member Since
                            </p>
                            <p className="font-medium">
                                {new Date(userRole?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {userRole?.status === 'suspended' && userRole?.suspendedReason && (
                    <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                            Suspension Reason
                        </h3>
                        <p className="text-red-700 dark:text-red-300">
                            {userRole.suspendedReason}
                        </p>
                    </div>
                )}

                <button
                    onClick={logoutUser}
                    className="btn-danger w-full mt-6"
                >
                    Logout
                </button>
            </motion.div>
        </div>
    );
};

export default Profile;
