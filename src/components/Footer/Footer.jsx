import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 transition-colors duration-300">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">GT</span>
                            </div>
                            <span className="text-xl font-bold">Garments Tracker</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your trusted partner in garment production management. Streamline
                            orders, track production, and manage inventory with ease.
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                                <FaXTwitter className="w-4 h-4" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                                <FaFacebookF className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                                <FaLinkedinIn className="w-4 h-4" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                                <FaGithub className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-600 dark:text-gray-400">
                                Order Management
                            </li>
                            <li className="text-gray-600 dark:text-gray-400">
                                Production Tracking
                            </li>
                            <li className="text-gray-600 dark:text-gray-400">
                                Inventory Management
                            </li>
                            <li className="text-gray-600 dark:text-gray-400">
                                Quality Control
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                                <FiMapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                <span>123 Garment Street, Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <FiPhone className="w-5 h-5 flex-shrink-0" />
                                <span>+880 1234-567890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <FiMail className="w-5 h-5 flex-shrink-0" />
                                <span>info@garmentstracker.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t dark:border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        © {currentYear} Garments Tracker. All rights reserved. Developed
                        with ❤️ for garment industry.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
