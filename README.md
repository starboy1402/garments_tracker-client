# Garments Order & Production Tracker - Frontend

## Project Overview
A comprehensive full-stack web application for managing garment factory production workflows, orders, and inventory. This platform provides role-based access for Admins, Managers, and Buyers to streamline the entire production process.

## Live URL
[Client Live URL - To be deployed on Firebase/Vercel/Netlify]

## Features

### Core Features
- ✅ **Role-Based Authentication** - Three user roles (Admin, Manager, Buyer) with Firebase Auth
- ✅ **Secure JWT Authentication** - HTTP-only cookies for enhanced security
- ✅ **Product Management** - Browse, search, and filter products
- ✅ **Order Placement** - Detailed order forms with validation
- ✅ **Real-Time Tracking** - Track production stages with timeline visualization
- ✅ **User Management** - Admin approval/suspension system
- ✅ **Dark/Light Theme** - Persistent theme toggle
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Toast Notifications** - Real-time feedback for all actions
- ✅ **SweetAlert Modals** - Beautiful confirmation dialogs

### User Roles & Capabilities

#### Admin
- Manage all users (approve/suspend with feedback)
- View and manage all products
- Toggle "Show on Home" for products
- View all orders with search and filter
- Access analytics dashboard
- Full system oversight

#### Manager
- Add new products with images and details
- Manage own products (edit/delete)
- View pending orders
- Approve/reject orders
- Add tracking updates to approved orders
- Production workflow management

#### Buyer
- Browse and search products
- Place orders with detailed specifications
- Track order status in real-time
- View production timeline
- Cancel pending orders
- Personal order history

## Technology Stack

### Frontend Framework & Libraries
- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### State Management & Data Fetching
- **React Context API** - Global state (Auth, Theme)
- **Axios** - HTTP client
- **React Hook Form** - Form validation and management

### Authentication
- **Firebase Authentication** - Email/Password, Google, GitHub
- **JWT** - Secure token-based auth with HTTP-only cookies

### UI Components & Notifications
- **React Hot Toast** - Toast notifications
- **SweetAlert2** - Beautiful alert modals
- **React Icons** (Feather Icons) - Icon library
- **Swiper** - Touch slider for carousels

### Charts & Visualizations
- **Recharts** - Data visualization (for analytics dashboard)

### Payment Integration (Optional)
- **Stripe** - Payment processing

## NPM Packages Used

```json
{
  "dependencies": {
    "@stripe/react-stripe-js": "^2.5.1",
    "@stripe/stripe-js": "^3.0.6",
    "axios": "^1.6.7",
    "firebase": "^10.8.0",
    "framer-motion": "^11.0.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^5.0.1",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0",
    "sweetalert2": "^11.10.5",
    "swiper": "^11.0.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Backend server running

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
- Copy `.env.example` to `.env`
- Fill in your Firebase credentials
- Set your API URL

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

## Project Structure

```
client/
├── public/
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── components/
│   │   ├── Footer/
│   │   └── Navbar/
│   ├── firebase/
│   │   └── firebase.config.js
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── About/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Contact/
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   ├── Buyer/
│   │   │   ├── Common/
│   │   │   ├── Manager/
│   │   │   └── Dashboard.jsx
│   │   ├── Home/
│   │   ├── NotFound/
│   │   └── Products/
│   ├── providers/
│   │   ├── AuthProvider.jsx
│   │   └── ThemeProvider.jsx
│   ├── routes/
│   │   ├── AdminRoute.jsx
│   │   ├── BuyerRoute.jsx
│   │   ├── ManagerRoute.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── Routes.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Key Features Implementation

### 1. Authentication System
- Firebase Auth with email/password, Google, and GitHub
- JWT token stored in HTTP-only cookies
- Automatic token refresh on page reload
- Protected routes with role-based access control

### 2. Role-Based Access
- **Admin Route** - Only accessible by admin users
- **Manager Route** - Accessible by managers and admins
- **Buyer Route** - Accessible by buyers and admins
- **Private Route** - Requires authentication

### 3. Theme System
- Light/Dark mode toggle
- Persistent theme storage in localStorage
- Smooth transitions between themes
- Tailwind CSS dark mode classes

### 4. Form Management
- React Hook Form for all forms
- Built-in validation with error messages
- Auto-filled fields where applicable
- Real-time form validation

### 5. Animations
- Framer Motion for page transitions
- Smooth hover effects
- Card animations
- Modal entrance/exit animations

## Routing Structure

```
Public Routes:
  / - Home
  /products - All Products
  /products/:id - Product Details (Private)
  /about - About Us
  /contact - Contact
  /login - Login
  /register - Register

Dashboard Routes (Private):
  /dashboard - Overview
  /dashboard/profile - User Profile

Admin Routes:
  /dashboard/manage-users
  /dashboard/all-products
  /dashboard/all-orders
  /dashboard/analytics

Manager Routes:
  /dashboard/add-product
  /dashboard/manage-products
  /dashboard/pending-orders
  /dashboard/approved-orders

Buyer Routes:
  /dashboard/my-orders
  /dashboard/track-order/:id
```

## Design System

### Colors
- **Primary**: Blue shades (#0ea5e9)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 3xl to 6xl
- **Body**: Regular, base size

### Components
- **Buttons**: Primary, Secondary, Danger, Success
- **Cards**: White/Dark with shadow
- **Badges**: Status indicators
- **Modals**: Overlay with animation
- **Forms**: Consistent input styling

## Deployment

### Firebase Hosting
```bash
npm run build
firebase init hosting
firebase deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Important Configuration
- Set environment variables in hosting platform
- Configure Firebase domain authorization
- Update API_URL to production backend
- Ensure CORS is configured on backend

## Testing Credentials

### Admin Account
- Email: admin@garments.com
- Password: Admin123

### Manager Account
- Email: manager@garments.com
- Password: Manager123

### Buyer Account
- Email: buyer@garments.com
- Password: Buyer123

## Best Practices Followed

1. **Clean Code**
   - Consistent naming conventions
   - Component-based architecture
   - Reusable components

2. **Performance**
   - Lazy loading images
   - Code splitting
   - Optimized bundles

3. **Security**
   - HTTP-only cookies
   - Protected routes
   - Input validation
   - XSS prevention

4. **UX/UI**
   - Loading states
   - Error handling
   - Toast notifications
   - Responsive design
   - Accessibility

5. **Git Workflow**
   - Meaningful commit messages
   - Feature branches
   - Regular commits

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
ISC

## Author
[Your Name]

## Support
For support, email support@garmentstracker.com

---

**Note**: This is a comprehensive foundation. Additional dashboard pages (Admin, Manager, Buyer specific features) need full implementation with complete CRUD operations, search, filter, pagination, and tracking features as per the detailed requirements.
