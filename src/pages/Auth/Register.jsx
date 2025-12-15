import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../providers/AuthProvider';
import { FiMail, FiLock, FiUser, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
    const { registerUser, googleLogin, githubLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await registerUser(
                data.email,
                data.password,
                data.name,
                data.photoURL,
                data.role
            );
            toast.success('Registration successful! Please wait for admin approval.');
            navigate('/login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already in use. Please login instead.');
            } else {
                toast.error(error.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            toast.success('Registration successful! Please wait for admin approval.');
            navigate('/');
        } catch (error) {
            toast.error('Google registration failed');
        }
    };

    const handleGithubLogin = async () => {
        try {
            await githubLogin();
            toast.success('Registration successful! Please wait for admin approval.');
            navigate('/');
        } catch (error) {
            toast.error('GitHub registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="card">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold">Create Account</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Join our platform today
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaGoogle className="text-red-500" />
                            <span>Continue with Google</span>
                        </button>
                        <button
                            onClick={handleGithubLogin}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaGithub />
                            <span>Continue with GitHub</span>
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                Or register with email
                            </span>
                        </div>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Name must be at least 3 characters',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Photo URL</label>
                            <div className="relative">
                                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    {...register('photoURL', {
                                        required: 'Photo URL is required',
                                        pattern: {
                                            value: /^https?:\/\/.+/,
                                            message: 'Please enter a valid URL',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                            {errors.photoURL && (
                                <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className="input-field"
                            >
                                <option value="">Select Role</option>
                                <option value="buyer">Buyer</option>
                                <option value="manager">Manager</option>
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                                            message:
                                                'Password must contain at least one uppercase and one lowercase letter',
                                        },
                                    })}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Min 6 characters, 1 uppercase, 1 lowercase
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
