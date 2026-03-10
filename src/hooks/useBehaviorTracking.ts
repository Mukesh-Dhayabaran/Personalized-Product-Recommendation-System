import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export function useBehaviorTracking(productId?: number) {
  const { user } = useUser();
  const startTime = useRef(Date.now());
  const scrollDepth = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const depth = (scrollTop + winHeight) / docHeight;
      if (depth > scrollDepth.current) {
        scrollDepth.current = depth;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      if (productId && user) {
        const timeOnPage = (Date.now() - startTime.current) / 1000;
        const event = {
          user_id: user.id,
          product_id: productId,
          event_type: 'view',
          time_on_page: timeOnPage,
          scroll_depth: scrollDepth.current,
          time_of_day: getTimeOfDay(),
          device_type: getDeviceType(),
          day_of_week: getDayOfWeek(),
          entry_source: 'direct'
        };
        
        axios.post('/api/track', event).catch(console.error);
      }
    };
  }, [productId, user]);
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getDayOfWeek() {
  const day = new Date().getDay();
  return (day === 0 || day === 6) ? 'weekend' : 'weekday';
}
