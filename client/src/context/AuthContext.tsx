import { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
    userId: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Map 'sub' from JWT to 'userId'
                setUser({ ...decoded, userId: decoded.sub, role: decoded.role, username: decoded.username });
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        setUser({ ...decoded, userId: decoded.sub, role: decoded.role, username: decoded.username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // [SECURITY] Global Interceptor
    // If any API call returns 401 (Unauthorized) or 403 (Forbidden),
    // it means the session is invalid (revoked, expired, or role changed).
    // We strictly logout the user to prevent them from staying on a protected page.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
