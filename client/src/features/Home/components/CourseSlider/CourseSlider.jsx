import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";

import {
  homeSlidesPerViewHomeLaptop,
  homeSlidesPerViewHomeMobile,
  mobileMaxWidth,
  slideSpaceBetween,
} from "../../../../constants";

import "./CourseSlider.scss";
import { LeftArrowIcon, Loader, RightArrowIcon } from "../../../../components";
import { useGetCoursesQuery } from "../../../../services/courseApi";
import CourseCard from "./CourseCard";

const CourseSlider = () => {
  const { t } = useTranslation();
  const { data: courseList, isLoading } = useGetCoursesQuery();

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [slidesPerView, setSlidesPerView] = useState(
    homeSlidesPerViewHomeLaptop
  );
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    if (windowWidth > mobileMaxWidth) {
      setSlidesPerView(homeSlidesPerViewHomeLaptop);
    } else {
      setSlidesPerView(homeSlidesPerViewHomeMobile);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, navigationPrevRef, navigationNextRef]);

  useEffect(() => {
    if (!isLoading) {
      let arr = courseList?.data.slice(0, 4);
      if (arr?.length) {
        setCourses([...arr]);
      }
    }
  }, [isLoading, courseList]);

  const onClickPrevButton = () => {
    setPrevDisabled(
      navigationPrevRef.current.classList.value === "swiper-button-disabled"
    );
    setNextDisabled(false);
  };

  const onClickNextButton = () => {
    setNextDisabled(
      navigationNextRef.current.classList.value === "swiper-button-disabled"
    );
    setPrevDisabled(false);
  };

  return (
    <div className="courseslider">
      <Swiper
        slidesPerView={slidesPerView}
        pagination={{
          clickable: true,
        }}
        spaceBetween={slideSpaceBetween}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {isLoading ? (
          <Loader />
        ) : courses?.length ? (
          <>
            {courses.map((course, idx) => (
              <SwiperSlide key={idx + "article"}>
                <CourseCard course={course} key={idx} />
              </SwiperSlide>
            ))}
            <div className="swiper__pagination">
              <div ref={navigationPrevRef} onClick={onClickPrevButton}>
                <LeftArrowIcon disabled={prevDisabled} />
              </div>
              <div ref={navigationNextRef} onClick={onClickNextButton}>
                <RightArrowIcon disabled={nextDisabled} />
              </div>
            </div>
          </>
        ) : (
          <p className="empty__message">{t("courses_empty_message")}</p>
        )}
      </Swiper>
    </div>
  );
};

export default CourseSlider;
