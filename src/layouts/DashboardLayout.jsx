import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
    FiHome,
    FiUsers,
    FiPackage,
    FiShoppingCart,
    FiPlusCircle,
    FiList,
    FiClock,
    FiCheckCircle,
    FiUser,
    FiBarChart2,
    FiTruck,
    FiArrowLeft,
} from 'react-icons/fi';
import { useEffect } from 'react';

const DashboardLayout = () => {
    const { userRole } = useAuth();

    useEffect(() => {
        document.title = 'Dashboard - Garments Tracker';
    }, []);

    const adminLinks = [
        { path: '/dashboard', label: 'Overview', icon: <FiHome /> },
        { path: '/dashboard/manage-users', label: 'Manage Users', icon: <FiUsers /> },
        { path: '/dashboard/all-products', label: 'All Products', icon: <FiPackage /> },
        { path: '/dashboard/all-orders', label: 'All Orders', icon: <FiShoppingCart /> },
        { path: '/dashboard/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    ];

    const managerLinks = [
        { path: '/dashboard', label: 'Overview', icon: <FiHome /> },
        { path: '/dashboard/add-product', label: 'Add Product', icon: <FiPlusCircle /> },
        { path: '/dashboard/manage-products', label: 'Manage Products', icon: <FiList /> },
        { path: '/dashboard/pending-orders', label: 'Pending Orders', icon: <FiClock /> },
        { path: '/dashboard/approved-orders', label: 'Approved Orders', icon: <FiCheckCircle /> },
        { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    ];

    const buyerLinks = [
        { path: '/dashboard', label: 'Overview', icon: <FiHome /> },
        { path: '/dashboard/my-orders', label: 'My Orders', icon: <FiShoppingCart /> },
        { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    ];

    const getLinks = () => {
        if (userRole?.role === 'admin') return adminLinks;
        if (userRole?.role === 'manager') return managerLinks;
        return buyerLinks;
    };

    const links = getLinks();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden lg:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        Dashboard
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {userRole?.role?.toUpperCase()} Panel
                    </p>
                    <Link
                        to="/"
                        className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        <FiArrowLeft />
                        <span>Back to Home</span>
                    </Link>
                </div>

                <nav className="px-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`
                            }
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-40">
                <nav className="flex justify-around">
                    {links.slice(0, 4).map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/dashboard'}
                            className={({ isActive }) =>
                                `flex flex-col items-center py-3 px-4 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
                                }`
                            }
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span className="text-xs mt-1">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default DashboardLayout;
