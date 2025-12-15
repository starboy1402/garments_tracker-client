import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Register with Email & Password
    const registerUser = async (email, password, name, photoURL, role) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photoURL,
            });

            // Save user to database
            await axios.post(`${API_URL}/api/users`, {
                name,
                email,
                photoURL,
                role: role || 'buyer',
                status: 'pending',
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login with Email & Password
    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Generate JWT token
            await axios.post(`${API_URL}/api/auth/jwt`,
                { email: result.user.email },
                { withCredentials: true }
            );

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const googleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Save user to database
            await axios.post(`${API_URL}/api/users`, {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: 'buyer',
                status: 'pending',
            });

            // Generate JWT token
            await axios.post(`${API_URL}/api/auth/jwt`,
                { email: result.user.email },
                { withCredentials: true }
            );

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // GitHub Login
    const githubLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, githubProvider);

            // Save user to database
            await axios.post(`${API_URL}/api/users`, {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: 'buyer',
                status: 'pending',
            });

            // Generate JWT token
            await axios.post(`${API_URL}/api/auth/jwt`,
                { email: result.user.email },
                { withCredentials: true }
            );

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logoutUser = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
            await signOut(auth);
            setUserRole(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch user role from database
    const fetchUserRole = async (email) => {
        try {
            const response = await axios.get(`${API_URL}/api/users/${email}`, {
                withCredentials: true,
            });
            setUserRole(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user role:', error);
            return null;
        }
    };

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Generate JWT token
                try {
                    await axios.post(`${API_URL}/api/auth/jwt`,
                        { email: currentUser.email },
                        { withCredentials: true }
                    );

                    // Fetch user role
                    await fetchUserRole(currentUser.email);
                } catch (error) {
                    console.error('Error in auth state:', error);
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userRole,
        loading,
        registerUser,
        loginUser,
        googleLogin,
        githubLogin,
        logoutUser,
        fetchUserRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
