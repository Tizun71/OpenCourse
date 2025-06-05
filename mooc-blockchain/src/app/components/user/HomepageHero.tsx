import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomepageHeroCarousel = () => {
  const slides = [
    {
      image: "science.png",
      cta: "Đăng Ký Ngay",
      ctaLink: "/courses/full-stack",
    },
    {
      image: "/ai.png",
      cta: "Bắt Đầu Học",
      ctaLink: "/courses/data-science",
    },
    {
      image: "/space.png",
      cta: "Khám Phá Ngay",
      ctaLink: "/courses/ux-ui",
    },
  ];

  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.1)]"></div>

              <div className="absolute bottom-10 left-10 z-10 hover:scale-120"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          opacity: 1;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          width: 44px;
          height: 44px;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </section>
  );
};

export default HomepageHeroCarousel;
