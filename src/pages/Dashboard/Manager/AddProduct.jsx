import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import {
    FiUploadCloud,
    FiX,
    FiImage,
    FiVideo,
    FiDollarSign,
    FiPackage,
} from 'react-icons/fi';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        document.title = 'Add Product - Manager Dashboard';
    }, []);

    // ImgBB API for image upload
    const uploadToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            // Using ImgBB API - Replace with your API key
            // Get free API key from https://api.imgbb.com/
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY || 'demo_key'}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('ImgBB upload error:', error);
            // Fallback: Use placeholder or local URL
            return URL.createObjectURL(imageFile);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + imageFiles.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setImageFiles((prev) => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        if (imageFiles.length === 0) {
            toast.error('Please add at least one product image');
            return;
        }

        setLoading(true);
        setUploadingImages(true);

        try {
            // Upload all images
            const imageUrls = await Promise.all(
                imageFiles.map((file) => uploadToImgBB(file))
            );

            setUploadingImages(false);

            // Prepare product data
            const productData = {
                name: data.name,
                description: data.description,
                category: data.category,
                price: parseFloat(data.price),
                availableQuantity: parseInt(data.availableQuantity),
                minimumOrderQuantity: parseInt(data.minimumOrderQuantity),
                images: imageUrls,
                demoVideo: data.demoVideo || '',
                paymentOptions: data.paymentOptions,
                showOnHome: data.showOnHome || false,
            };

            // Submit to backend
            await axiosInstance.post('/api/products', productData);

            toast.success('Product added successfully!');
            reset();
            setImageFiles([]);
            setImagePreviews([]);

            // Redirect to manage products after 1 second
            setTimeout(() => {
                navigate('/dashboard/manage-products');
            }, 1000);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Add New Product
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Add a new garment product to your inventory
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card max-w-4xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('name', {
                                required: 'Product name is required',
                                minLength: {
                                    value: 3,
                                    message: 'Product name must be at least 3 characters',
                                },
                            })}
                            type="text"
                            placeholder="e.g., Premium Cotton T-Shirt"
                            className="input-field"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('description', {
                                required: 'Description is required',
                                minLength: {
                                    value: 20,
                                    message: 'Description must be at least 20 characters',
                                },
                            })}
                            rows="4"
                            placeholder="Detailed product description, materials, features..."
                            className="input-field resize-none"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Category & Price */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="input-field"
                            >
                                <option value="">Select Category</option>
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
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <FiDollarSign className="inline" /> Price (USD){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('price', {
                                    required: 'Price is required',
                                    min: { value: 0.01, message: 'Price must be greater than 0' },
                                })}
                                type="number"
                                step="0.01"
                                placeholder="99.99"
                                className="input-field"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Quantities */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <FiPackage className="inline" /> Available Quantity{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('availableQuantity', {
                                    required: 'Available quantity is required',
                                    min: { value: 1, message: 'Must be at least 1' },
                                })}
                                type="number"
                                placeholder="1000"
                                className="input-field"
                            />
                            {errors.availableQuantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.availableQuantity.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Minimum Order Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('minimumOrderQuantity', {
                                    required: 'Minimum order quantity is required',
                                    min: { value: 1, message: 'Must be at least 1' },
                                })}
                                type="number"
                                placeholder="50"
                                className="input-field"
                            />
                            {errors.minimumOrderQuantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.minimumOrderQuantity.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Product Images */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <FiImage className="inline" /> Product Images{' '}
                            <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">(Max 5 images)</span>
                        </label>

                        {/* Image Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                                disabled={imageFiles.length >= 5}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <FiUploadCloud className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, WEBP up to 5MB each
                                </p>
                            </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative group"
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiX />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Demo Video URL */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <FiVideo className="inline" /> Demo Video URL (Optional)
                        </label>
                        <input
                            {...register('demoVideo', {
                                pattern: {
                                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
                                    message: 'Please enter a valid YouTube URL',
                                },
                            })}
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            className="input-field"
                        />
                        {errors.demoVideo && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.demoVideo.message}
                            </p>
                        )}
                    </div>

                    {/* Payment Options */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Payment Options <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('paymentOptions', {
                                required: 'Payment option is required',
                            })}
                            className="input-field"
                        >
                            <option value="">Select Payment Option</option>
                            <option value="cash">Cash on Delivery</option>
                            <option value="payfirst">Pay First (Online Payment)</option>
                        </select>
                        {errors.paymentOptions && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.paymentOptions.message}
                            </p>
                        )}
                    </div>

                    {/* Show on Home */}
                    <div className="flex items-center space-x-3">
                        <input
                            {...register('showOnHome')}
                            type="checkbox"
                            id="showOnHome"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                            htmlFor="showOnHome"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Show this product on home page (Featured Product)
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploadingImages}
                            className="btn-primary flex-1"
                        >
                            {uploadingImages
                                ? 'Uploading Images...'
                                : loading
                                    ? 'Adding Product...'
                                    : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/manage-products')}
                            disabled={loading}
                            className="btn-secondary px-6"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Help Note */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mt-6 max-w-4xl"
            >
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <FiImage className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                            Image Upload Note
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            To use image upload, add your ImgBB API key to{' '}
                            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                                .env
                            </code>{' '}
                            file: <br />
                            <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded mt-1 inline-block">
                                VITE_IMGBB_API_KEY=your_api_key_here
                            </code>
                            <br />
                            <span className="text-xs">
                                Get your free API key from{' '}
                                <a
                                    href="https://api.imgbb.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    https://api.imgbb.com/
                                </a>
                            </span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddProduct;
