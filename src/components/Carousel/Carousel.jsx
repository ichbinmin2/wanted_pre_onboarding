import React, { useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";
import DATA from "./bannerData";
import CarouselItem from "./CarouselItem/CarouselItem";
import ArrowIcon from "../ArrowIcon/ArrowIcon";

function Carousel() {
  const [count, setCount] = useState(0);
  const [isTranstioning, setIsTranstioning] = useState(false);

  // ref
  const slideContainer = useRef();

  // DATA
  const bannerList = DATA;
  const slideLength = bannerList.length;
  const firstBanner = bannerList[0];
  const lastBanner = bannerList[bannerList.length - 1];

  const rightMargin = 24;
  const bannerInnerWidth = 1060;
  const bannerWidth = bannerInnerWidth + rightMargin;

  const width = (slideLength + 2) * bannerWidth;
  const leftMargin = (window.innerWidth - bannerWidth) / 2;
  const offset = bannerWidth * (count + 1) - leftMargin;

  const nextArrow = () => {
    if (!isTranstioning) {
      setCount((old) => old + 1);
      setIsTranstioning(true);
    }
  };

  const prevArrow = () => {
    if (!isTranstioning) {
      setCount((old) => old + -1);
      setIsTranstioning(true);
    }
  };

  useEffect(() => {
    console.log(slideLength);
    console.log(count);
    const handler = () => {
      setIsTranstioning(false);

      if (count >= slideLength) {
        slideContainer.current.style.transition = "none";
        setCount(0);
      } else if (count <= -1) {
        slideContainer.current.style.transition = "none";
        setCount(slideLength - 1);
      }
    };

    slideContainer.current.addEventListener("transitionend", handler);
    slideContainer.current.style.transition = `transform 350ms ease-in-out`;

    return () => {
      slideContainer.current.removeEventListener("transitionend", handler);
    };
  }, [count, setCount]);

  const mouseDownHandler = (downEvent) => {
    downEvent.preventDefault();
    const startX = downEvent.clientX;

    const mouseMoveHandler = (event) => {
      const dx = startX - event.clientX;
      slideContainer.current.style.transform = `translateX(${-(
        offset + dx
      )}px)`;
    };

    const mouseUpHandler = (event) => {
      const dx = startX - event.clientX;
      if (Math.abs(dx) > 300) {
        if (dx > 0) {
          nextArrow();
        } else {
          prevArrow();
        }
      } else {
        slideContainer.current.style.transform = `translateX(${-offset}px)`;
      }

      slideContainer.current.removeEventListener("mousemove", mouseMoveHandler);
      slideContainer.current.removeEventListener("mouseup", mouseUpHandler);
    };

    slideContainer.current.addEventListener("mousemove", mouseMoveHandler);
    slideContainer.current.addEventListener("mouseup", mouseUpHandler);
  };

  useEffect(() => {
    slideContainer.current.style.transform = `translateX(${-offset}px)`;
  }, [count]);

  return (
    <section className={styles.main}>
      <div className={styles.bannerWarp}>
        <div className={`${styles.slickSlider} ${styles.initialized}`}>
          <div className={styles.slickList}>
            <div
              className={styles.slickTrack}
              style={{
                width: `${width}px`,
              }}
              ref={slideContainer}
              onMouseDown={mouseDownHandler}
            >
              <div className={styles.slickSlide}>
                <CarouselItem info={lastBanner} key="lastCopy" />
              </div>
              {bannerList.map((info) => (
                <div className={styles.slickSlide}>
                  <CarouselItem info={info} key={info.id} />
                </div>
              ))}
              <div className={styles.slickSlide}>
                <CarouselItem info={firstBanner} key="firstCopy" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={nextArrow} style={{ fontSize: "40px" }}>
          {">"}
        </button>
        <button onClick={prevArrow} style={{ fontSize: "40px" }}>
          {"<"}
        </button>
      </div>
    </section>
  );
}

export default Carousel;
