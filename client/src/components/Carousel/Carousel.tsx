import Slider from "react-slick";
import Card from "../Card/Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";

import { AvgObj } from "../../api";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

interface CarouselProps {
  avgListGroup: AvgObj[][];
  alterNavBarIndexZ: () => void;
}

const Carousel: React.FC<CarouselProps> = (props) => {
  const [currentSlideNumber, setCurrentSlideNumber] = useState<number>(1);
  const [clickedTDAvgObj, setClickedTDAvgObj] = useState<AvgObj | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const totalSlideCount = props.avgListGroup.length;
  const hideDotsShowPagination: boolean = totalSlideCount > 12;
  const settings = {
    dots: hideDotsShowPagination ? false : true,
    infinite: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
    // Cleanup function to remove the class when the component unmounts or modal is closed
    return () => {
      document.body.classList.remove("active-modal");
    };
  }, [showModal]);

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

  const handleTDClick = (td: AvgObj) => {
    console.log(`td: ${td}`);
    props.alterNavBarIndexZ();
    setClickedTDAvgObj(td);
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("close modal");
    props.alterNavBarIndexZ();
    setClickedTDAvgObj(null);
    setShowModal(false);
  };

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
            <Card fetchedAvgGrades={list} handleTDClick={handleTDClick} />
          </div>
        ))}
      </Slider>
      {props.avgListGroup.length > 0 && pagination()}
      {showModal && (
        <Modal clickedTDAvgObj={clickedTDAvgObj} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Carousel;
