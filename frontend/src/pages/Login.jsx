import React,{useState} from 'react'
import { useUser } from '../context/authcontext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { UserCircle, Lock } from 'lucide-react'

function Login() {
    const [formData,setFormData] = useState({userName:"",password:""})
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const {login} = useUser()
    const navigate= useNavigate()
    const handleChange = (e)=>{
        const {name,value} = e.target
        setFormData(prev =>({
            ...prev,
            [name]:value
        }))
    }
    const handleSubmit = async(e)=>{
            e.preventDefault();
            setError('')
            setLoading(true)
            try {
                const success =  await login(formData.userName,formData.password)
                console.log("succes res:",success)
                if(success){
                 setError("")
                 navigate("/")
                }else{
                    setError("password or user name is wrong")
                    setLoading(false)
                }
            } catch (error) {
                console.error("failed logged in!",error)
                setError(error.data.message || "something went wrong!")
            }finally{
                setLoading(false)
            }
            
    }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your account to continue
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-200 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor='userName' className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserCircle className="h-5 w-5 text-gray-400" />
                            </div>
                            
                            <input 
                                type="text"
                                id='userName'
                                autoComplete="username" 
                                placeholder='Enter your username'
                                name='userName'
                                value={formData.userName}
                                className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor='password' className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                                                  
                            <input 
                                id='password'
                                type="password"
                                name='password'
                                autoComplete="current-password"
                                placeholder='Enter your password'
                                value={formData.password}
                                className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                </div>

                <div>
                    <button 
                        type='submit' 
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        New here?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Create an account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login