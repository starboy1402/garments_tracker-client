import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

const stats = [
    { icon: <FiUsers />, value: '1,000+', label: 'Active Users' },
    { icon: <FiPackage />, value: '5,000+', label: 'Products' },
    { icon: <FiShoppingCart />, value: '10,000+', label: 'Orders Completed' },
    { icon: <FiTrendingUp />, value: '98%', label: 'Customer Satisfaction' },
];

const Statistics = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-5xl mb-4 flex justify-center">{stat.icon}</div>
                            <div className="text-4xl font-bold mb-2">{stat.value}</div>
                            <div className="text-primary-100">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
