import React, { useEffect, useState } from 'react'
import axiosInstance from '../services/api'

function useComment(videoId) {   
  const [comments,setComments]= useState('')
  const [commentsCount,setCommentsCount] = useState(0)
  const fetchComments = async ()=>{
    try {
        const res = await axiosInstance.get(`/comments/get-all-comment?videoId=${videoId}`)
        if(!res){
            console.error("response not obtain from backend",error)
        }
       setComments(res.data.data)
    } catch (error) {
        console.error("comments can not be fetched ",error)
    }
  }
  const postComment = async(content)=>{
    try {
        const res = await axiosInstance.post(`/comments/add-comment?videoId=${videoId}`,
            {
            content
            },
            {
                withCredentials:true
            }
    )
        if(!res){
            console.error("response not obtain from backend",error)
        }
        setComments(prev=>{
         const updatedComment =  [
                ...prev,
                ...res.data.data.newComment
            ]
            return updatedComment
        })
        setCommentsCount(res.data.data.commentsCount)
        fetchComments();
        
    } catch (error) {
        console.error("can post comment",error)
    }
  }


  useEffect(()=>{
    if(!videoId) return;
    fetchComments()
  },[videoId])

  return {comments,commentsCount,postComment}
}

export default useComment