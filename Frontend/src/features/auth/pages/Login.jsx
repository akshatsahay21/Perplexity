import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Login = () => {
    const demoEmail = 'akshatsahay353@gmail.com'
    const demoPassword = '123456'
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const error = useSelector(state => state.auth.error)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const fillDemoCredentials = () => {
        setEmail(demoEmail)
        setPassword(demoPassword)
    }

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        setIsSubmitting(true)
        try {
            const data = await handleLogin(payload)
            if (data?.success) {
                navigate("/")
            }
        } finally {
            setIsSubmitting(false)
        }

    }

    if(!loading && user){
        return <Navigate to="/" replace />
    }

    return (
        <section className="min-h-screen min-h-dvh w-full overflow-x-hidden bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center sm:min-h-[85vh]">
                <div className="auth-card rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-5 shadow-2xl shadow-black/50 backdrop-blur sm:p-8">
                    <h1 className="text-2xl font-bold text-[#31b8c6] sm:text-3xl">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-zinc-300">
                        Sign in with your email and password.
                    </p>
                    {error && (
                        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 rounded-xl border border-[#31b8c6]/30 bg-[#31b8c6]/10 p-4 text-sm text-zinc-200">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="font-semibold text-[#7ee3ec]">Demo login</p>
                                <p className="mt-2 text-zinc-300">
                                    Email: <span className="break-all font-mono text-zinc-100">{demoEmail}</span>
                                </p>
                                <p className="mt-1 text-zinc-300">
                                    Password: <span className="break-all font-mono text-zinc-100">{demoPassword}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fillDemoCredentials}
                                className="w-full shrink-0 rounded-lg border border-[#31b8c6]/50 px-3 py-2 text-xs font-semibold text-[#7ee3ec] transition hover:bg-[#31b8c6]/15 sm:w-auto"
                            >
                                Use
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submitForm} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-200">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)]"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-300">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login
