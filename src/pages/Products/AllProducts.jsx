import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiArrowRight } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        document.title = 'All Products - Garments Tracker';
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/api/products');
            // Ensure we always set an array
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Set empty array on error
            setProducts([]);
            toast.error('Failed to fetch products. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter
            ? product.category === categoryFilter
            : true;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map((p) => p.category))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-4">All Products</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Browse our complete collection of garment products
                    </p>
                </motion.div>

                {/* Search and Filter */}
                <div className="card mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
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

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No products found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
