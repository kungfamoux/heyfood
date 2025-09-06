import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerImage from "@/assets/banner-rice.jpg";
import "./BannerCarousel.css";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
}

const banners: Banner[] = [
  {
    id: "1",
    title: "FREE DELIVERY",
    subtitle: "Feedwell Supermarket",
    image: bannerImage,
    buttonText: "Order now"
  },
  {
    id: "2", 
    title: "50% OFF",
    subtitle: "Fresh Bread & Bites",
    image: bannerImage,
    buttonText: "Order now"
  },
  {
    id: "3",
    title: "NEW MENU",
    subtitle: "Taste the Difference",
    image: bannerImage,
    buttonText: "Explore"
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl">
          <div 
            className="banner-track"
            style={{ '--slide-offset': `${currentSlide * 100}%` } as React.CSSProperties}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 relative"
              >
                <div
                  className="banner-slide"
                  style={{ '--banner-image': `url(${banner.image})` } as React.CSSProperties}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">
                      {banner.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-4 opacity-90">
                      {banner.subtitle}
                    </p>
                    <Button className="w-fit bg-primary hover:bg-primary/90">
                      {banner.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            onClick={prevSlide}
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            onClick={nextSlide}
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;