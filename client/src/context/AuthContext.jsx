import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import * as authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUser() {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            try {

                const response = await authService.getCurrentUser();

                setUser(response.data);

            } catch (error) {

                localStorage.removeItem("token");
                delete api.defaults.headers.common.Authorization;

            } finally {

                setLoading(false);

            }

        }

        loadUser();

    }, []);

    async function login(email, password) {

        const response = await authService.login({

            email,
            password

        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setUser(user);

    }

    function logout() {

        localStorage.removeItem("token");

        delete api.defaults.headers.common.Authorization;

        setUser(null);

    }

    async function refreshUser() {

        const response = await authService.getCurrentUser();

        setUser(response.data);

        return response.data;

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}