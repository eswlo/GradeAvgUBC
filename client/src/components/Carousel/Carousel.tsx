import Slider from "react-slick";
import Card from "../Card/Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";

import { AvgObj } from "../../api";
import { useState } from "react";
import Modal from "../Modal/Modal";


interface CarouselProps {
  avgListGroup: AvgObj[][];
}

const Carousel: React.FC<CarouselProps> = (props) => {
  const [currentSlideNumber, setCurrentSlideNumber] = useState<number>(1);
  const [clickedTD, setClickedTD] = useState<string>("");


  const totalSlideCount = props.avgListGroup.length;
  const hideDotsShowPagination: boolean = totalSlideCount > 12;
  const settings = {
    dots: hideDotsShowPagination ? false : true,
    infinite: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const pagination = () => {
    // console.log(`currentSlideNumber: ${currentSlideNumber}`);
    if (props.avgListGroup.length > 0 && hideDotsShowPagination) {
      return (
        <div className={styles.pagination}>
          <p>{`slide ${currentSlideNumber} of ${totalSlideCount}`}</p>
        </div>
      );
    } else {
      return <div className={styles.pagination}></div>;
    }
  };

  const handleTDClick = (td: string) => {
    setClickedTD(td);
  }

  return (
    <div className={styles.sliderContainer}>
      <Slider
        className={styles.customSliderCSS}
        {...settings}
        beforeChange={(_: number, nextSlide: number) =>
          setCurrentSlideNumber(nextSlide + 1)
        }
      >
        {props.avgListGroup.map((list, index) => (
          <div key={index} className={styles.slide}>
            <Card fetchedAvgGrades={list} handleTDClick={handleTDClick}/>
          </div>
        ))}
      </Slider>
      {props.avgListGroup.length > 0 && pagination()}
      <Modal clickedTD={clickedTD} />
    </div>
  );
};

export default Carousel;
