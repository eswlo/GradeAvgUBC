import Slider from "react-slick";
import Card from "../Card/Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";

import { AvgObj } from "../../api";

interface CarouselProps {
  avgListGroup: AvgObj[][];
}

const Carousel: React.FC<CarouselProps> = (props) => {

    const settings = {
      dots: true,
      infinite: false,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div className={styles.sliderContainer}>
        <Slider {...settings}>
          {props.avgListGroup.map((list, index) => (
            <div key={index} className={styles.slide}>
            <Card fetchedAvgGrades={list}/>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
  
  export default Carousel;