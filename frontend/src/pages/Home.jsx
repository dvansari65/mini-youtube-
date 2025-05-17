import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/api';
import { MessageCircleIcon, HeartIcon ,UserCircleIcon} from 'lucide-react';
import {  useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1); // Start from 1 instead of empty string
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigateToWatchVideo = (videoId)=>{
    if(loading) return;
    navigate(`/watch-video/${videoId}`)
  }
  
  const LIMIT = 9;
  const observer = useRef();

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/videos/get-all-video?page=${page}&limit=${LIMIT}`);

        const newVideos = res.data?.data || [];
        if (newVideos.length === 0) {
          setHasMore(false);
          return;
        }

        setVideos((prev) => [...prev, ...newVideos]);
        setHasMore(newVideos.length === LIMIT);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch videos from the database', error);
        setLoading(false);
      }
    
  }
  fetchVideos();
}, [page]);

  return (
    <div className="flex justify-center items-center mt-5 bg-none h-16/18 w-full">
     
      
      <div className="grid grid-cols-1 h-screen mt-25  sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {videos.map((video, index) => {
          const isLast = index === videos.length - 1;

          return (
            <div
              key={video._id}
              ref={isLast ? lastVideoRef : null}
              className="bg-white p-3 rounded-lg shadow "
            >
              <video
                src={video?.videoFile}
                controls
                onClick={()=>navigateToWatchVideo(video._id)}
                className=" w-full rounded-md "
              />
              <div className='flex  flex-col justify-start items-start mt-2 gap-3 mb-auto'>
                <div className='flex flex-row gap-2'>
                  <UserCircleIcon />
                  <h1 className='font-bold'>{video.owner.userName}</h1>
                </div>
                <div className='flex gap-3'>
                  <div className="text-sm font-bold text-gray-800 mt-1">Likes: {video?.likes?.length || 0}</div>
                  <div className="text-sm font-bold text-gray-800 mt-1">views: {video?.views.length || 0 }</div>
                </div>
                <div className="text-sm text-gray-800 mt-1">created at: {video.createdAt}</div>
            </div>
          </div>
          );
        })}
      </div>

      {loading && <p className="text-center my-6">Loading more videos...</p>}
   
    </div>
  );
}

export default Home;
