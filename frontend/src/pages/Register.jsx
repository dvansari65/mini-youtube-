import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/api';

function Register() {
    const [formData, setFormData] = useState({
        userName: "",
        fullName:"",
        email: "",
        password: "",
        avatar: null,
        coverImage: null
    });
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [success,setSuccess]= useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleClose = (e)=>{
        e.preventDefault();
        navigate("/")
}

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        console.log('Form data:', formData);
        
        if (confirmPassword !== formData.password) {
            setError("Passwords do not match!");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append("userName", formData.userName);
            data.append("fullName", formData.fullName); 
            data.append("email", formData.email);
            data.append("password", formData.password);
            if (formData.avatar) data.append("avatar", formData.avatar);
            if (formData.coverImage) data.append("coverImage", formData.coverImage);

            const response = await axiosInstance.post(
               "/users/register",
               data,
               {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
               }
            )
            console.log('Registration successful:', response.data);
            navigate("/");
            
            if (success) {
                console.log('Registration successful');
                setSuccess(success.response?.data?.message || "user registered succesfully")
                navigate("/home");
            } else {
                console.log('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || "user already existed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className='flex flex-row justify-between '>
                <h2 className="text-2xl font-semibold text-center mb-4">Create an Account</h2>
                <button
                onClick={handleClose}
                className='text-red-600 -mt-5'  
                >close</button>
                </div>
                {(error && <div className="text-red-500 text-center mb-4">{error}</div>) || (success && <div className="text-blue-600 text-center mb-4">{success}</div>)}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            name="userName"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your username"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">full name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Avatar</label>
                        <input
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Cover Image</label>
                        <input
                            name="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <p className='m-2 p-2 flex justify-center align-middle'>
                        already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;