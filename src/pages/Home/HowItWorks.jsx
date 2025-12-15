import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiTruck, FiCheckCircle } from 'react-icons/fi';

const steps = [
    {
        icon: <FiSearch className="w-8 h-8" />,
        title: 'Browse Products',
        description: 'Explore our extensive catalog of garment products and find what you need.',
    },
    {
        icon: <FiShoppingCart className="w-8 h-8" />,
        title: 'Place Order',
        description: 'Submit your order with detailed specifications and quantity requirements.',
    },
    {
        icon: <FiTruck className="w-8 h-8" />,
        title: 'Production & Tracking',
        description: 'Track your order through every stage of production with real-time updates.',
    },
    {
        icon: <FiCheckCircle className="w-8 h-8" />,
        title: 'Receive Products',
        description: 'Get your high-quality garments delivered on time, every time.',
    },
];

const HowItWorks = () => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        Simple steps to manage your garment production efficiently
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="card text-center h-full">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300 dark:bg-primary-700"></div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
