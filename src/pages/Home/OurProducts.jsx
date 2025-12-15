import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const OurProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/api/products/home');
            // Ensure we always set an array
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Set empty array on error
            setProducts([]);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container-custom">
                    <div className="flex justify-center">
                        <div className="loader"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">Our Products</h2>
                    <p className="section-subtitle">
                        Explore our wide range of high-quality garment products
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card group hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    ${product.price}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {product.category}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Available: {product.availableQuantity}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Min: {product.minimumOrderQuantity}
                                    </span>
                                </div>
                                <Link
                                    to={`/products/${product._id}`}
                                    className="btn-primary w-full mt-4 inline-flex items-center justify-center space-x-2"
                                >
                                    <span>View Details</span>
                                    <FiArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No products available at the moment
                        </p>
                    </div>
                )}

                {products.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            to="/products"
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <span>View All Products</span>
                            <FiArrowRight />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurProducts;
