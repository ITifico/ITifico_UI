import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroCourse, newCourse } from "../../assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";

import {
  homeSlidesPerViewHomeLaptop,
  homeSlidesPerViewHomeMobile,
  homeSubCourseTextLaptop,
  homeSubCourseTextMobile,
  mobileMaxWidth,
  slideSpaceBetween,
  tabletMaxWidth,
} from "../../../../constants";

import "./CourseSlider.scss";

const CourseSlider = () => {
  const { t } = useTranslation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [substring, setSubstring] = useState(homeSubCourseTextLaptop);
  const [slidesPerView, setSlidesPerView] = useState(
    homeSlidesPerViewHomeLaptop
  );
  const [courses, setCourses] = useState([
    {
      icon: heroCourse,
      banner: "hero",
      bg: "#ccc1f6",
      title: t("home_courses_card1_title"),
      text: t("home_courses_card1_description"),
      link: {
        to: "#C#course",
        text: t("home_courses_card1_button"),
      },
    },
    {
      icon: newCourse,
      banner: "new",
      bg: "#e7eef3",
      title: t("home_courses_card2_title"),
      text: t("home_courses_card2_description"),
      link: {
        to: "#newcourse",
        text: t("home_courses_card2_button"),
      },
    },
  ]);

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

    if (windowWidth > tabletMaxWidth) {
      setSubstring(homeSubCourseTextLaptop);
    } else {
      setSubstring(homeSubCourseTextMobile);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <div className="courseslider">
      <Swiper
        slidesPerView={slidesPerView}
        pagination={{
          clickable: true,
        }}
        spaceBetween={slideSpaceBetween}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {courses.map((course, idx) => (
          <SwiperSlide key={idx + "article"}>
            <div className="course" style={{ background: course.bg }}>
              <div className="course__banner">
                <h2>{course.banner}</h2>
              </div>
              <div className="course__icon">
                <img src={course.icon} alt="course-icon" />
              </div>
              <h4 className="course__title">{course.title}</h4>
              <p className="course__text">
                {course.text.length > substring
                  ? course.text.substring(0, substring) + "..."
                  : course.text}
              </p>
              <div className="link__box">
                <Link className="box__link__link" to={course.link.to}>
                  {course.link.text}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CourseSlider;
