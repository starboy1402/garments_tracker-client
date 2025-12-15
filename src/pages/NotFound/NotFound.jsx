import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
                    404
                </h1>
                <h2 className="text-4xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been
                    moved or deleted.
                </p>
                <Link
                    to="/"
                    className="btn-primary inline-flex items-center space-x-2"
                >
                    <FiHome />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
