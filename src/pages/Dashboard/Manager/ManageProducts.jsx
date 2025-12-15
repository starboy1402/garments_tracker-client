import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiSearch,
    FiPackage,
    FiDollarSign,
    FiEye,
} from 'react-icons/fi';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        document.title = 'Manage Products - Manager Dashboard';
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [search, category, products]);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/api/manager/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete <strong>${name}</strong>.<br/>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/api/products/${id}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const updatedData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            availableQuantity: parseInt(formData.get('availableQuantity')),
            minimumOrderQuantity: parseInt(formData.get('minimumOrderQuantity')),
            paymentOptions: formData.get('paymentOptions'),
            showOnHome: formData.get('showOnHome') === 'on',
        };

        try {
            await axiosInstance.put(`/api/products/${editingProduct._id}`, updatedData);
            toast.success('Product updated successfully');
            setShowEditModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Manage Products
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Edit and delete your products
                        </p>
                    </div>
                    <Link to="/dashboard/add-product" className="btn-primary">
                        <FiPlus className="inline mr-2" />
                        Add New Product
                    </Link>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Value</p>
                            <p className="text-3xl font-bold">
                                ${products.reduce((sum, p) => sum + p.price * p.availableQuantity, 0).toFixed(0)}
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
                transition={{ delay: 0.4 }}
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
                    <p className="text-gray-500 mb-6">
                        {search || category
                            ? 'Try adjusting your search or filters'
                            : 'Start by adding your first product'}
                    </p>
                    <Link to="/dashboard/add-product" className="btn-primary inline-flex items-center">
                        <FiPlus className="mr-2" />
                        Add New Product
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
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
                                <th className="text-left p-4 font-semibold">Payment</th>
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
                                            className="w-16 h-16 object-cover rounded-lg"
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
                                    <td className="p-4 text-sm capitalize">{product.paymentOptions}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn-secondary text-sm py-2 px-3"
                                                title="Edit Product"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="btn-danger text-sm py-2 px-3"
                                                title="Delete Product"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
                            <form onSubmit={handleUpdateProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editingProduct.name}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingProduct.description}
                                        required
                                        rows="3"
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <select
                                            name="category"
                                            defaultValue={editingProduct.category}
                                            required
                                            className="input-field"
                                        >
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

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Price ($)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            step="0.01"
                                            defaultValue={editingProduct.price}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Available Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            defaultValue={editingProduct.availableQuantity}
                                            required
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Minimum Order Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="minimumOrderQuantity"
                                            defaultValue={editingProduct.minimumOrderQuantity}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Payment Options</label>
                                    <select
                                        name="paymentOptions"
                                        defaultValue={editingProduct.paymentOptions}
                                        required
                                        className="input-field"
                                    >
                                        <option value="cash">Cash on Delivery</option>
                                        <option value="payfirst">Pay First</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="showOnHome"
                                        id="editShowOnHome"
                                        defaultChecked={editingProduct.showOnHome}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="editShowOnHome" className="text-sm font-medium">
                                        Show on home page
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="btn-primary flex-1">
                                        Update Product
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="btn-secondary px-6"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
