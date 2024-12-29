import { useState, useRef, useEffect } from 'react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const minSwipeDistance = 50;
  const retractionThreshold = 0.3; // Maximum overscroll as percentage of carousel width

  const calculateBoundedTranslate = (rawTranslate) => {
    const maxTranslate = (images.length - 1) * 100;
    
    // Apply resistance when pulling beyond bounds
    if (rawTranslate > 0) { // Pulling right at the start
      return (rawTranslate * retractionThreshold);
    } else if (Math.abs(rawTranslate) > maxTranslate) { // Pulling left at the end
      const overscroll = Math.abs(rawTranslate) - maxTranslate;
      return -maxTranslate - (overscroll * retractionThreshold);
    }
    return rawTranslate;
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(null);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
    const distance = touchStart - e.touches[0].clientX;
    
    if (carouselRef.current) {
      const baseTranslate = currentIndex * 100;
      const rawTranslate = -(baseTranslate + (distance / carouselRef.current.offsetWidth * 100));
      const boundedTranslate = calculateBoundedTranslate(rawTranslate);
      
      carouselRef.current.style.transform = `translateX(${boundedTranslate}%)`;
      setDragOffset(distance);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    // Reset position with animation
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.3s ease-out';
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = '';
        }
      }, 300);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    setDragOffset(0);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const distance = dragStartX.current - e.clientX;
    
    if (carouselRef.current) {
      const baseTranslate = currentIndex * 100;
      const rawTranslate = -(baseTranslate + (distance / carouselRef.current.offsetWidth * 100));
      const boundedTranslate = calculateBoundedTranslate(rawTranslate);
      
      carouselRef.current.style.transform = `translateX(${boundedTranslate}%)`;
      setDragOffset(distance);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    const distance = startX - e.clientX;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (isRightDrag && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    // Reset position with animation
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.3s ease-out';
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = '';
        }
      }, 300);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      
      const rawTranslate = -(currentIndex * 100 + (e.deltaX / carouselRef.current.offsetWidth * 100));
      const boundedTranslate = calculateBoundedTranslate(rawTranslate);
      
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${boundedTranslate}%)`;
        
        if (e.deltaX > minSwipeDistance && currentIndex < images.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (e.deltaX < -minSwipeDistance && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    if (carouselRef.current && !isDragging && !touchStart) {
      carouselRef.current.style.transition = 'transform 0.3s ease-out';
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = '';
        }
      }, 300);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragOffset(0);
        
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 0.3s ease-out';
          carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = '';
            }
          }, 300);
        }
      }
    };

    window.addEventListener('mouseup', handleMouseUpOutside);
    return () => window.removeEventListener('mouseup', handleMouseUpOutside);
  }, [isDragging, currentIndex]);

  return (
    <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
      <div
        ref={carouselRef}
        className="flex touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ aspectRatio: '3/4' }}
          >
            <img
              src={image.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover select-none"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;