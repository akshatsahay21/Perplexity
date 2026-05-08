import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({ email, username, password })
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getMe()
            dispatch(setUser(data.user))
            return data
        } catch (err) {
            dispatch(setError(err.response?.status === 401 ? null : err.response?.data?.message || "Failed to fetch user data"))
            dispatch(setUser(null))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            return await logout()
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Logout failed"))
            return null
        } finally {
            dispatch(setUser(null))
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    }

}
