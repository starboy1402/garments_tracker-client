import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';

const About = () => {
    useEffect(() => {
        document.title = 'About Us - Garments Tracker';
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                        <p className="text-xl text-primary-100">
                            Revolutionizing garment production management with innovative
                            technology solutions
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="card"
                        >
                            <FiTarget className="w-12 h-12 text-primary-600 mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                To empower garment manufacturers and buyers with cutting-edge
                                technology that streamlines production workflows, enhances
                                transparency, and drives operational excellence. We're committed
                                to making garment production management accessible, efficient,
                                and scalable for businesses of all sizes.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="card"
                        >
                            <FiTrendingUp className="w-12 h-12 text-primary-600 mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                To become the world's leading platform for garment production
                                management, setting new standards in quality, efficiency, and
                                customer satisfaction. We envision a future where every garment
                                manufacturer has access to enterprise-grade tools that transform
                                their operations.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="section-title">Our Core Values</h2>
                        <p className="section-subtitle">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FiAward />,
                                title: 'Quality First',
                                description:
                                    'We never compromise on quality. Every feature is built with precision and tested thoroughly.',
                            },
                            {
                                icon: <FiUsers />,
                                title: 'Customer-Centric',
                                description:
                                    'Our users are at the heart of everything. We listen, adapt, and deliver what matters most.',
                            },
                            {
                                icon: <FiTrendingUp />,
                                title: 'Innovation',
                                description:
                                    'We continuously evolve, embracing new technologies to stay ahead of industry trends.',
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card text-center"
                            >
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400 text-2xl">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="container-custom max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card"
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                Founded in 2024, Garments Tracker was born from a simple
                                observation: the garment industry needed a modern, comprehensive
                                solution for managing production workflows.
                            </p>
                            <p>
                                Our founders, with decades of combined experience in both
                                technology and textile manufacturing, recognized the challenges
                                faced by factories, managers, and buyers. From order tracking to
                                quality control, the process was fragmented and inefficient.
                            </p>
                            <p>
                                Today, we serve over 1,000 active users, managing thousands of
                                orders and helping businesses streamline their operations. Our
                                platform has become the trusted choice for garment
                                manufacturers worldwide.
                            </p>
                            <p>
                                As we continue to grow, our commitment remains the same:
                                providing innovative, reliable, and user-friendly solutions that
                                drive success in the garment industry.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
