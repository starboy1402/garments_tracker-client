import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../providers/AuthProvider';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderModalOpen, setOrderModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            email: user?.email || '',
            productTitle: '',
        },
    });

    const quantity = watch('quantity', 0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.get(`/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            toast.error('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitOrder = async (data) => {
        if (userRole?.status === 'suspended') {
            toast.error('Your account is suspended. Cannot place orders.');
            return;
        }

        if (userRole?.status !== 'approved') {
            toast.error('Your account is pending approval. Please wait for admin approval.');
            return;
        }

        try {
            const orderData = {
                ...data,
                productId: product._id,
                productName: product.name,
                orderPrice: quantity * product.price,
                paymentMethod: data.paymentMethod,
            };

            await axiosInstance.post('/api/orders', orderData);

            Swal.fire({
                title: 'Success!',
                text: 'Order placed successfully',
                icon: 'success',
                confirmButtonColor: '#0ea5e9',
            });

            setOrderModalOpen(false);
            navigate('/dashboard/my-orders');
        } catch (error) {
            toast.error('Failed to place order');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Product not found</p>
            </div>
        );
    }

    const canOrder = userRole?.role === 'buyer' && userRole?.status === 'approved';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <img
                            src={product.images?.[0] || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full rounded-xl shadow-lg"
                        />
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <span className="text-sm text-primary-600 font-medium">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
                        </div>

                        <div className="text-3xl font-bold text-primary-600">
                            ${product.price}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="card">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Available Quantity
                                </p>
                                <p className="text-2xl font-bold">{product.availableQuantity}</p>
                            </div>
                            <div className="card">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Minimum Order
                                </p>
                                <p className="text-2xl font-bold">{product.minimumOrderQuantity}</p>
                            </div>
                        </div>

                        <div className="card">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Payment Option
                            </p>
                            <p className="font-semibold">
                                {product.paymentOptions === 'cash'
                                    ? 'Cash on Delivery'
                                    : 'Pay First'}
                            </p>
                        </div>

                        {canOrder && (
                            <button
                                onClick={() => setOrderModalOpen(true)}
                                className="btn-primary w-full text-lg py-4"
                            >
                                Order / Book Now
                            </button>
                        )}

                        {!canOrder && userRole?.role === 'buyer' && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-yellow-800 dark:text-yellow-200">
                                    {userRole?.status === 'pending'
                                        ? 'Your account is pending approval. Please wait for admin approval to place orders.'
                                        : 'Your account is suspended. You cannot place orders.'}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Order Modal */}
                {orderModalOpen && (
                    <div className="modal-overlay" onClick={() => setOrderModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Place Order</h2>
                                <form onSubmit={handleSubmit(onSubmitOrder)} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email (Read-only)
                                            </label>
                                            <input
                                                type="email"
                                                value={user?.email}
                                                readOnly
                                                className="input-field bg-gray-100 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Product (Read-only)
                                            </label>
                                            <input
                                                type="text"
                                                value={product.name}
                                                readOnly
                                                className="input-field bg-gray-100 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('firstName', { required: true })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('lastName', { required: true })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                {...register('quantity', {
                                                    required: true,
                                                    min: product.minimumOrderQuantity,
                                                    max: product.availableQuantity,
                                                })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Order Price (Auto-calculated)
                                            </label>
                                            <input
                                                type="text"
                                                value={`$${(quantity * product.price) || 0}`}
                                                readOnly
                                                className="input-field bg-gray-100 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Contact Number *
                                            </label>
                                            <input
                                                type="tel"
                                                {...register('contactNumber', { required: true })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Payment Method *
                                            </label>
                                            <select
                                                {...register('paymentMethod', { required: true })}
                                                className="input-field"
                                            >
                                                <option value="">Select Payment</option>
                                                <option value="cash">Cash on Delivery</option>
                                                {product.paymentOptions === 'payfirst' && (
                                                    <option value="payfirst">Pay First</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Delivery Address *
                                        </label>
                                        <textarea
                                            {...register('deliveryAddress', { required: true })}
                                            className="input-field min-h-[80px]"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            {...register('additionalNotes')}
                                            className="input-field min-h-[80px]"
                                        ></textarea>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button type="submit" className="btn-primary flex-1">
                                            Place Order
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderModalOpen(false)}
                                            className="btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
