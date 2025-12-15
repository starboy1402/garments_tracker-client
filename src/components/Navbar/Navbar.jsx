import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, userRole, logoutUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/products"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                }
            >
                All Products
            </NavLink>
            <NavLink
                to="/about"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                }
            >
                About Us
            </NavLink>
            <NavLink
                to="/contact"
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                }
            >
                Contact
            </NavLink>
            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-colors ${isActive
                            ? 'bg-primary-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors duration-300">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">GT</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
                            Garments Tracker
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {navLinks}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <FiMoon className="w-5 h-5" />
                            ) : (
                                <FiSun className="w-5 h-5" />
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <img
                                        src={user.photoURL || 'https://via.placeholder.com/40'}
                                        alt={user.displayName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="hidden md:block font-medium">
                                        {user.displayName}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                                        >
                                            <div className="px-4 py-2 border-b dark:border-gray-700">
                                                <p className="text-sm font-medium">{user.displayName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {userRole?.role || 'User'}
                                                </p>
                                            </div>
                                            <Link
                                                to="/dashboard/profile"
                                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <FiUser className="w-4 h-4" />
                                                <span>Profile</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                                            >
                                                <FiLogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden py-4 space-y-2"
                        >
                            {navLinks}
                            {!user && (
                                <div className="flex flex-col space-y-2 pt-4 border-t dark:border-gray-700">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
