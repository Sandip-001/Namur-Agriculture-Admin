import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageHoverSlider = ({ images }) => {
  const settings = {
    dots: false, // no dots
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // arrows enabled
    autoplay: true,
    autoplaySpeed: 1500,
  };

  return (
    <div
      className="group"
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Default static image */}
      <img
        src={images[0]?.url}
        alt="Main"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "6px",
        }}
        className="main-img"
      />

      {/* Slider on hover */}
      <div className="slider-overlay">
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div key={idx}>
              <img
                src={img.url}
                alt={`slide-${idx}`}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageHoverSlider;