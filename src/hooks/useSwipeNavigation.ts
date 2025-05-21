import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function useSwipeNavigation(
  elementRef: React.RefObject<HTMLElement>,
  { onSwipeLeft, onSwipeRight }: SwipeHandlers
) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;
  
  // Track if we're currently processing a swipe
  const isSwipingRef = useRef(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
      isSwipingRef.current = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isSwipingRef.current) {
        setTouchEnd(e.targetTouches[0].clientX);
      }
    };
    
    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
      
      // Reset state
      setTouchStart(null);
      setTouchEnd(null);
      isSwipingRef.current = false;
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, touchStart, touchEnd, onSwipeLeft, onSwipeRight]);
  
  return {
    isSwipingRef,
  };
}
