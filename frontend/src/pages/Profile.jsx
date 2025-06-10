import React, { useEffect, useState } from 'react';
import { UserCircle, Users, Heart, Video, ChevronRight, Edit2, Settings, X } from 'lucide-react';
import axiosInstance from "../services/api"
import { useNavigate } from 'react-router-dom';
import useFetchUser from '../hooks/fetchUser';
import useFetchLikesOfChanel from '../hooks/LikesHooks/fetchLikesOfChanel';
import useChannelStatus from '../hooks/subscribeStatus';
import useFetchMyVideos from '../hooks/videoHooks/fetchMyVideos';
import emitter from '../eventEmitter';
function Profile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState('')
    const [input,setInput] = useState({
      email:'',
      userName:'',
      fullName:''
  })

    const navigate = useNavigate()

    const {User,fetchUser} = useFetchUser()
    const {numberOfSubscriber,fetchSubscriberCount} = useChannelStatus(User?._id)
   
    const {myVideos,fetchVideos}= useFetchMyVideos()
    const {channelLikes,fetchTotalChannelLikes} = useFetchLikesOfChanel(User?._id)

    const handleNavigate=()=>{
        navigate('/my-videos')
    }
  
    useEffect(()=>{
      fetchUser()
      fetchTotalChannelLikes()
      fetchSubscriberCount()
      fetchVideos()
    },[])

    useEffect(()=>{
      if(User){
        setInput(
          {
            email:User.email || '',
            fullName: User.fullName || '',
            userName:User.userName || ''
          }
        )
      }
      setLoading(false)
      setError('')
    },[User])

    const updateAccountDetails = async()=>{
        try {
            const res = await axiosInstance.patch('/users/update-Account',input) 
            if(!res){
                console.error("response not obtain from backend",error)
                setError("response not obtain from backend")
            }
            setInput({
                email:res.data.data.user.email,
                fullName:res.data.data.fullName,
                userName:res.data.data.userName
            })
            fetchUser()
            emitter.emit('userUpdated');
            setLoading(false)
            setError('')
            setIsEditModalOpen(false)
        } catch (error) {
            console.error("account can not be update",error)
            setError("account can not be update")
        }
    }
    const handleChange = (e)=>{
        const {name,value} = e.target
        setInput(prev=>(
            {
                ...prev,
                [name]:value
            }
        ))
    }

    const handleFormData = (e)=>{
      setError('')
      setLoading(true)
       try {
         e.preventDefault()
         updateAccountDetails()
       } catch (error) {
        console.error("data can not be submit",error)
        setError("data can not be submit")
       }finally{
        setLoading(false)
       }
    }

    if(loading){
      return(
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      )
    }
    if(error){
      return(
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-red-500 text-lg">can not load user</p>
        </div>
      )
    }
    if (!User) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white text-lg">Loading user profile...</p>
        </div>
      );
    }
    
    return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute -bottom-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            <UserCircle className="h-full w-full text-gray-300" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 pb-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 size={20} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Profile Info Form */}
          <form onSubmit={handleFormData} className="space-y-6">
            <div>
              <label htmlFor='username' className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
              type="text"
              name="userName"
              value={input.userName}
              id='username'
              onChange={handleChange}
               />
            </div>

            <div>
              <label htmlFor='Email' className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
              type="email"
              name="email"
              value={input.email}
              id='Email'
              onChange={handleChange}
               />
            </div>

            <div>
              <label htmlFor='FullName' className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
              type="email"
              name="fullName"
              value={input.fullName}
              id='FullName'
              onChange={handleChange}
               />
            </div>
          </form>

          {/* Stats Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Video className="text-blue-600" size={24} />
                  <span className="text-gray-700"><button onClick={handleNavigate} className="no-underline">Videos Uploaded</button></span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{myVideos.length || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Users className="text-blue-600" size={24} />
                  <span className="text-gray-700 no-underline">total subscribers:</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{numberOfSubscriber}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Heart className="text-blue-600" size={24} />
                  <span className="text-gray-700 no-underline">Total Likes:</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{channelLikes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Edit Profile Modal */}
  {isEditModalOpen && (
    <div className="bg-white rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out hover:shadow-3xl [&_*]:no-underline">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Edit2 className="h-6 w-6 text-blue-600" />
                <span>Edit Profile</span>
            </h1>
            <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
            >
                <X className="h-6 w-6 text-gray-500" />
            </button>
        </div>

        {/* Main Content */}
        <div className="p-8">
            {/* Profile Information */}
            <div className="max-w-2xl mx-auto">
                <div className="space-y-8">
                    {/* Username Field */}
                    <div className="transform transition-all duration-200 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Username</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input.userName}
                                onChange={(e) => setInput({...input, userName: e.target.value})}
                                className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                transition-all duration-200
                                group-hover:border-blue-400
                                placeholder-gray-400"
                                placeholder="Enter your username"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="transform transition-all duration-200 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                            <Settings className="h-4 w-4 text-blue-600" />
                            <span>Email Address</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={input.email}
                                onChange={(e) => setInput({...input, email: e.target.value})}
                                className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                transition-all duration-200
                                group-hover:border-blue-400
                                placeholder-gray-400"
                                placeholder="Enter your email"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Settings className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                        </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="transform transition-all duration-200 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                            <UserCircle className="h-4 w-4 text-blue-600" />
                            <span>Full Name</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input.fullName}
                                onChange={(e) => setInput({...input, fullName: e.target.value})}
                                className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                transition-all duration-200
                                group-hover:border-blue-400
                                placeholder-gray-400"
                                placeholder="Enter your full name"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <UserCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                            <p className="text-sm text-red-600 flex items-center space-x-2">
                                <X className="h-4 w-4" />
                                <span>{error}</span>
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
                            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                            transition-all duration-200 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFormData}
                            disabled={loading}
                            className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg 
                            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            transition-all duration-200 transform hover:scale-105
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Saving...</span>
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )}
</div>

    )
}

export default Profile; 