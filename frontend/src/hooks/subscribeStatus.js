import { useEffect, useState } from 'react';
import axiosInstance from '../services/api';

function useChannelStatus(channelId) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [numberOfSubscriber, setNumberOfSubscriber] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscribedTo,setSubscribedTo] = useState([])
  const fetchIsSubscribeStatus = async () => {
    try {
        if(!channelId) return
      const res = await axiosInstance.get(`/subscription/subscribe-status/${channelId}`);
      if (!res) throw new Error('No response from backend');
      setIsSubscribed(res.data.data.subscribed);
      setError('');
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setError('Could not fetch subscription status');
    }
  };

  const fetchSubscriberCount = async () => {
    try {
    if(!channelId) return
      const res = await axiosInstance.get(`/subscription/get-channel-subscriber/${channelId}`);
      if (!res) throw new Error('No response from backend');
      setNumberOfSubscriber(res.data.data.subscriberCount || 0);
      setError('');
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
      setError('Could not fetch subscriber count');
    }
  };

  const fetchSubscribedChannel = async ()=>{
    try {
      const res = await axiosInstance.get('/subscription/get-subscribed-channel')
      if(!res  ){
        console.error("response not obtain from backend")
        setLoading(false)
      }
      setSubscribedTo(res.data.data?.subscribedTo || [])
    } catch (error) {
      console.error("data can not be fetched",error)
      setLoading(false)
    }
  }

  const toggleSubscribe = async () => {
    try {
        if(!channelId) return
      const res = await axiosInstance.post(`/subscription/toggle-subscription?channelId=${channelId}`);
      setIsSubscribed(res.data.data.isSubscribed);
      setNumberOfSubscriber(res.data?.data?.subscribeCount || []);
      setError('');
    } catch (error) {
      console.error('Error toggling subscription:', error);
      setError('Failed to toggle subscription');
    }
  };
  
  useEffect(() => {
    if (!channelId) {
      setLoading(false); 
      return;
    }
  
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchIsSubscribeStatus(),
        fetchSubscriberCount(),
      ]);
      setLoading(false);
    };
  
    fetchAll();
    
  }, [channelId]);
  

  return {
    isSubscribed,
    numberOfSubscriber,
    error,
    loading,
    toggleSubscribe,
    fetchSubscriberCount,
    fetchIsSubscribeStatus,
    fetchSubscribedChannel,
    subscribedTo
  };
}

export default useChannelStatus;
