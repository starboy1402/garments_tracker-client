import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FiSearch,
    FiPackage,
    FiDollarSign,
    FiEye,
    FiEyeOff,
    FiUser,
} from 'react-icons/fi';

const AllProductsAdmin = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        document.title = 'All Products - Admin Dashboard';
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [search, category, products]);

    const filterProducts = () => {
            let filtered = products;

            if (search) {
                filtered = filtered.filter(
                    (product) =>
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.category.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (category) {
                filtered = filtered.filter((product) => product.category === category);
            }

                setFilteredProducts(filtered);
            };
    
        const handleToggleShowOnHome = async (productId, currentStatus) => {
            const result = await Swal.fire({
                title: currentStatus ? 'Hide from Home?' : 'Show on Home?',
                text: currentStatus
                    ? 'This product will be removed from the homepage'
                    : 'This product will be featured on the homepage',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0ea5e9',
                cancelButtonColor: '#6b7280',
                confirmButtonText: currentStatus ? 'Yes, hide it' : 'Yes, show it',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                try {
                    await axiosInstance.patch(`/api/products/${productId}/toggle-home`, {
                        showOnHome: !currentStatus,
                    });
                    toast.success(
                        currentStatus
                            ? 'Product hidden from homepage'
                            : 'Product now showing on homepage'
                    );
                    fetchProducts();
                } catch (error) {
                    console.error('Error toggling product visibility:', error);
                    toast.error('Failed to update product');
                    }
                }
            };
    
        const viewProductDetails = (product) => {
            Swal.fire({
                title: product.name,
                html: `
        <div class="text-left space-y-3">
          <img src="${product.images[0]}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4" />
          <p><strong>Description:</strong> ${product.description}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Available Quantity:</strong> ${product.availableQuantity}</p>
          <p><strong>Minimum Order:</strong> ${product.minimumOrderQuantity}</p>
          <p><strong>Payment:</strong> ${product.paymentOptions}</p>
          <p><strong>Created By:</strong> ${product.createdBy}</p>
          <p><strong>Show on Home:</strong> ${product.showOnHome ? 'Yes' : 'No'}</p>
        </div>
      `,
                width: 600,
                confirmButtonText: 'Close',
                confirmButtonColor: '#0ea5e9',
                });
            };
    
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/api/products');
                const data = Array.isArray(response.data) ? response.data : [];
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setFilteredProducts([]);
                toast.error('Failed to fetch products. Please check your connection.');
            }
        };
    
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            );
        }

        return (
            <div>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        All Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage all products across the platform
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Products</p>
                                <p className="text-3xl font-bold">{products.length}</p>
                            </div>
                            <FiPackage className="text-5xl text-blue-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">In Stock</p>
                                <p className="text-3xl font-bold">
                                    {products.filter((p) => p.availableQuantity > 0).length}
                                </p>
                            </div>
                            <FiEye className="text-5xl text-green-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Featured</p>
                                <p className="text-3xl font-bold">
                                    {products.filter((p) => p.showOnHome).length}
                                </p>
                            </div>
                            <FiEye className="text-5xl text-yellow-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Total Value</p>
                                <p className="text-3xl font-bold">
                                    $
                                    {products
                                        .reduce((sum, p) => sum + p.price * p.availableQuantity, 0)
                                        .toFixed(0)}
                                </p>
                            </div>
                            <FiDollarSign className="text-5xl text-purple-200" />
                        </div>
                    </motion.div>
                </div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field md:w-48"
                        >
                            <option value="">All Categories</option>
                            <option value="T-Shirts">T-Shirts</option>
                            <option value="Shirts">Shirts</option>
                            <option value="Pants">Pants</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Jackets">Jackets</option>
                            <option value="Hoodies">Hoodies</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </motion.div>

                {/* Products Table */}
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card text-center py-12"
                    >
                        <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-500">
                            {search || category
                                ? 'Try adjusting your search or filters'
                                : 'No products available yet'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card overflow-x-auto"
                    >
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left p-4 font-semibold">Image</th>
                                    <th className="text-left p-4 font-semibold">Product Name</th>
                                    <th className="text-left p-4 font-semibold">Category</th>
                                    <th className="text-left p-4 font-semibold">Price</th>
                                    <th className="text-left p-4 font-semibold">Stock</th>
                                    <th className="text-left p-4 font-semibold">Manager</th>
                                    <th className="text-left p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="p-4">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                                onClick={() => viewProductDetails(product)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold">{product.name}</p>
                                            {product.showOnHome && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-green-600 dark:text-green-400">
                                            ${product.price}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${product.availableQuantity > 50
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : product.availableQuantity > 0
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}
                                            >
                                                {product.availableQuantity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <FiUser className="text-gray-400" />
                                                <span>{product.createdBy}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => viewProductDetails(product)}
                                                    className="btn-secondary text-sm py-2 px-3"
                                                    title="View Details"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleShowOnHome(product._id, product.showOnHome)
                                                    }
                                                    className={`text-sm py-2 px-3 rounded-lg transition-colors ${product.showOnHome
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}
                                                    title={product.showOnHome ? 'Hide from Home' : 'Show on Home'}
                                                >
                                                    {product.showOnHome ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>
        );
    };

    export default AllProductsAdmin;
