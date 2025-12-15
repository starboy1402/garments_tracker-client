import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import heroimage from '../../assets/images/hero-garment.jpeg';

const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

            <div className="container-custom py-20 lg:py-32 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Streamline Your Garment Production
                        </h1>
                        <p className="text-xl text-primary-100 mb-8">
                            Manage orders, track production, and optimize your garment
                            manufacturing workflow with our comprehensive platform.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/products"
                                className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center space-x-2"
                            >
                                <span>Browse Products</span>
                                <FiArrowRight />
                            </Link>
                            <Link
                                to="/register"
                                className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={heroimage}
                                alt="Garment Production"
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-primary-400 rounded-full opacity-20 blur-3xl"></div>
                        <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
