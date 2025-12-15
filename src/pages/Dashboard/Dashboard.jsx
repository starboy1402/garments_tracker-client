import { useAuth } from '../../providers/AuthProvider';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, userRole } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">
                    {getGreeting()}, {user?.displayName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome to your {userRole?.role} dashboard
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Account Status</h3>
                    <p className="text-3xl font-bold capitalize text-primary-600">
                        {userRole?.status}
                    </p>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Role</h3>
                    <p className="text-3xl font-bold capitalize text-primary-600">
                        {userRole?.role}
                    </p>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                    <p className="text-lg font-semibold">
                        {new Date(userRole?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {userRole?.status === 'pending' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Account Pending Approval
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                        Your account is currently pending admin approval. You will be able to
                        access full features once your account is approved.
                    </p>
                </div>
            )}

            {userRole?.status === 'suspended' && userRole?.suspendedReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                        Account Suspended
                    </h3>
                    <p className="text-red-700 dark:text-red-300">
                        Reason: {userRole.suspendedReason}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
