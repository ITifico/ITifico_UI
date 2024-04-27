import React, { useEffect, useState } from "react";
import "./BlogArticles.scss";
import { Pagination } from "@mui/material";

import {
  ArticleCard,
  LeftArrowIcon,
  Loader,
  RightArrowIcon,
  Tag,
} from "../../../../components";
import { useTranslation } from "react-i18next";

import { FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import {
  articlesPerPageLaptop,
  articlesPerPageMobile,
  defaultPageBlog,
  mobileMaxWidth,
  paginationOptionsBlogLaptop,
  paginationOptionsBlogMobile,
} from "../../../../constants";
import { useGetArticlesQuery } from "../../../../services/articleApi";
import { useGetTagsQuery } from "../../../../services/tagApi";
import { useTransition } from "react";
import HeaderFilter from "../HeaderFilter/HeaderFilter";

const BlogArticles = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { data: articlesList, isLoading } = useGetArticlesQuery();
  const { data: tags, isLoading: tagLoading } = useGetTagsQuery();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [articlesPerPage, setArticlesPerPage] = useState(articlesPerPageLaptop);
  const [paginationOption, setPaginationOption] = useState(
    paginationOptionsBlogLaptop
  );
  const [articles, setArticles] = useState([]);
  const [pageArticles, setPageArticles] = useState([]);

  const [filter, setFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [pageCount, setPageCount] = useState(
    Math.ceil(articles?.length / articlesPerPage)
  );
  const [pagination, setPagination] = useState(defaultPageBlog);

  useEffect(() => {
    setFilter("");
  }, [t]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    if (windowWidth > mobileMaxWidth) {
      setArticlesPerPage(articlesPerPageLaptop);
      setPaginationOption(paginationOptionsBlogLaptop);

      if (!isLoading) {
        setPageCount(Math.ceil(articles.length / articlesPerPageLaptop));
      }
    } else {
      setArticlesPerPage(articlesPerPageMobile);
      setPaginationOption(paginationOptionsBlogMobile);

      if (!isLoading) {
        setPageCount(Math.ceil(articles.length / articlesPerPageMobile));
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, articles, articlesList, isLoading]);

  const onChangeFilter = (event) => {
    const {
      target: { value },
    } = event;
    if (value === filter) {
      setFilter("");
    } else {
      setPagination(() => defaultPageBlog);
      setFilter(value);
    }
  };

  const onChangeTag = (tag) => {
    if (tag === tagFilter) {
      setTagFilter("");
    } else {
      setTagFilter(tag);
    }
  };

  useEffect(() => {
    if (location.state?.tag) {
      setTagFilter(location.state?.tag);
      navigate("/blog");
    }
  }, [location]);

  // changing pagination
  const onChangePagination = (e) => {
    if (!e.target.textContent) return;

    const page = Number(e.target.textContent);

    if (page > pageCount) {
      setPagination(pageCount);
    } else {
      setPagination(page);
    }
  };

  // realizing pagination change
  const onSlidePagination = (alt) => {
    alt === "prev"
      ? setPagination((prev) => {
          if (prev - 1 > 0) {
            return prev - 1;
          } else {
            return 1;
          }
        })
      : setPagination((prev) => {
          if (prev + 1 < pageCount) {
            return prev + 1;
          } else {
            return pageCount;
          }
        });
  };

  return (
    <div className="blog__articles">
      <div className="container">
        <div className="header__navbar--layout">
          <div className="navbar__icon">
            <FaHome />
          </div>
          <ul className="navbar__menu">
            <li className="menu__item">
              <Link to="/" className="item__link">
                {t("header_nav_home")}
              </Link>
            </li>
            <li className="menu__item menu__item--active">
              <span className="item_arrow">
                <HiArrowRight />
              </span>
              <Link to="/blog" className="item__link">
                {t("header_nav_blog")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="asticles__content">
          <div className="header__banner">
            <h1 className="banner__text">blog</h1>
          </div>
          <h1 className="blog__articles__title">{t("blog_title")}</h1>
          <header className="articles__header">
            <div className="header__tags">
              {tagLoading ? (
                <p className="empty__message">{t("loading_tags_message")}</p>
              ) : tags?.data?.length ? (
                tags?.data?.map((tag, idx) => (
                  <Tag
                    blog
                    onClick={() => onChangeTag(tag.name)}
                    active={tagFilter === tag.name}
                    key={idx + "tag"}
                    tag={tag}
                  />
                ))
              ) : (
                <p className="empty__message">{t("tags_empty_message")}</p>
              )}
            </div>
            <HeaderFilter filter={filter} onChangeFilter={onChangeFilter} />
          </header>
          <div className="articles__body">
            {isLoading || isPending ? (
              <Loader />
            ) : pageArticles.length ? (
              <div className="body__menu">
                {pageArticles.map((article, idx) => (
                  <ArticleCard article={article} key={idx + "article"} />
                ))}
              </div>
            ) : (
              <p className="empty__message">{t("articles_empty_message")}</p>
            )}
            <div className="body__pagination">
              <button
                onClick={() => onSlidePagination("prev")}
                className="pagination__button"
              >
                <LeftArrowIcon disabled={pagination <= 1} />
              </button>
              <Pagination
                page={pagination}
                onChange={onChangePagination}
                count={pageCount}
                boundaryCount={paginationOption.boundaryCount}
                siblingCount={paginationOption.siblingCount}
                variant="outlined"
                shape="rounded"
              />
              <button
                onClick={() => onSlidePagination("next")}
                className="pagination__button"
              >
                <RightArrowIcon disabled={pagination >= pageCount} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticles;
