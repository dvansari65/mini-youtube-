import React,{useState} from 'react'
import { useUser } from '../context/authcontext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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
           
            const success =  await login(formData.userName,formData.password)
            console.log("succes res:",success)
            if(success){
             setError("")
             navigate("/")
            }else{
                setError("password or user name is wrong")
                setLoading(false)
            }
            
    }


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold text-center mb-4">login</h2>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">user name</label>
                    <input 
                    type="text"
                    placeholder='user name'
                    name='userName'
                    value={formData.userName}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">password</label>
                    <input 
                    type="password"
                    name='password'
                    placeholder='password'
                    value={formData.password}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={handleChange}
                    required
                    />
                </div>

                <button 
                type='submit' 
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}>{loading ?"login...": "Login"}</button>
                <p>
                    New here? {''}
                    <Link to="/register" className="text-blue-500 hover:underline">REGISTER</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Login