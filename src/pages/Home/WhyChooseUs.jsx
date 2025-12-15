import { motion } from 'framer-motion';
import { FiAward, FiClock, FiShield, FiTrendingUp } from 'react-icons/fi';

const features = [
    {
        icon: <FiAward className="w-8 h-8" />,
        title: 'Quality Assurance',
        description: 'Rigorous quality checks at every production stage ensure premium products.',
    },
    {
        icon: <FiClock className="w-8 h-8" />,
        title: 'On-Time Delivery',
        description: 'Reliable production timelines with real-time tracking and updates.',
    },
    {
        icon: <FiShield className="w-8 h-8" />,
        title: 'Secure Platform',
        description: 'Enterprise-grade security protecting your data and transactions.',
    },
    {
        icon: <FiTrendingUp className="w-8 h-8" />,
        title: 'Scalable Solutions',
        description: 'Flexible platform that grows with your business needs.',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">Why Choose Us</h2>
                    <p className="section-subtitle">
                        Experience excellence in garment production management
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card text-center group hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
