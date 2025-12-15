import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import AllProducts from '../pages/Products/AllProducts';
import ProductDetails from '../pages/Products/ProductDetails';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ManagerRoute from './ManagerRoute';
import BuyerRoute from './BuyerRoute';

// Dashboard Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Dashboard/Common/Profile';

// Admin Pages
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import AllProductsAdmin from '../pages/Dashboard/Admin/AllProductsAdmin';
import AllOrders from '../pages/Dashboard/Admin/AllOrders';
import Analytics from '../pages/Dashboard/Admin/Analytics';

// Manager Pages
import AddProduct from '../pages/Dashboard/Manager/AddProduct';
import ManageProducts from '../pages/Dashboard/Manager/ManageProducts';
import PendingOrders from '../pages/Dashboard/Manager/PendingOrders';
import ApprovedOrders from '../pages/Dashboard/Manager/ApprovedOrders';

// Buyer Pages
import MyOrders from '../pages/Dashboard/Buyer/MyOrders';
import TrackOrder from '../pages/Dashboard/Buyer/TrackOrder';

import NotFound from '../pages/NotFound/NotFound';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/products',
                element: <AllProducts />,
            },
            {
                path: '/products/:id',
                element: (
                    <PrivateRoute>
                        <ProductDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: '/about',
                element: <About />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
        ],
    },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/dashboard/profile',
                element: <Profile />,
            },
            // Admin Routes
            {
                path: '/dashboard/manage-users',
                element: (
                    <AdminRoute>
                        <ManageUsers />
                    </AdminRoute>
                ),
            },
            {
                path: '/dashboard/all-products',
                element: (
                    <AdminRoute>
                        <AllProductsAdmin />
                    </AdminRoute>
                ),
            },
            {
                path: '/dashboard/all-orders',
                element: (
                    <AdminRoute>
                        <AllOrders />
                    </AdminRoute>
                ),
            },
            {
                path: '/dashboard/analytics',
                element: (
                    <AdminRoute>
                        <Analytics />
                    </AdminRoute>
                ),
            },
            // Manager Routes
            {
                path: '/dashboard/add-product',
                element: (
                    <ManagerRoute>
                        <AddProduct />
                    </ManagerRoute>
                ),
            },
            {
                path: '/dashboard/manage-products',
                element: (
                    <ManagerRoute>
                        <ManageProducts />
                    </ManagerRoute>
                ),
            },
            {
                path: '/dashboard/pending-orders',
                element: (
                    <ManagerRoute>
                        <PendingOrders />
                    </ManagerRoute>
                ),
            },
            {
                path: '/dashboard/approved-orders',
                element: (
                    <ManagerRoute>
                        <ApprovedOrders />
                    </ManagerRoute>
                ),
            },
            // Buyer Routes
            {
                path: '/dashboard/my-orders',
                element: (
                    <BuyerRoute>
                        <MyOrders />
                    </BuyerRoute>
                ),
            },
            {
                path: '/dashboard/track-order/:id',
                element: (
                    <BuyerRoute>
                        <TrackOrder />
                    </BuyerRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
