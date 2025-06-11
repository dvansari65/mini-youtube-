import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/api'
import { useUser } from '../../context/authcontext'

function useComment(videoId) {   
    const { user } = useUser()
    const [comments, setComments] = useState([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [formData, setFormData] = useState({
        content: ""
    })

    const fetchComments = async () => {
        if (!user || !videoId) return
        try {
            const res = await axiosInstance.get(`/comments/get-all-comment?videoId=${videoId}`)
            if (!res.data) {
                throw new Error("No response from backend")
            }
            setComments(res.data.data || [])
            setCommentsCount(res.data.data?.length || 0)
        } catch (error) {
            console.error("Comments cannot be fetched:", error)
        }
    }

    const postComment = async () => {
        if (!user || !videoId || !formData.content.trim()) return
        try {
            const res = await axiosInstance.post(`/comments/add-comment?videoId=${videoId}`, formData)
            if (!res.data) {
                throw new Error("No response from backend")
            }
            
            
            setCommentsCount(res.data.data.commentCount)
            
            
            setComments(prevComments => [res.data.data.newComment, ...prevComments])
            
           
            setFormData({ content: "" })
        } catch (error) {
            console.error("Cannot post comment:", error)
        }
    }

    useEffect(() => {
        if (videoId) {
            fetchComments()
        }
    }, [videoId])

    return { comments, commentsCount, formData, setFormData, postComment }
}

export default useComment