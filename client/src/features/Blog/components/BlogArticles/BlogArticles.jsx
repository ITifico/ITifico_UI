import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
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
import { Link } from "react-router-dom";
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

const BlogArticles = () => {
  const { t } = useTranslation();
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

  const [filter, setFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState("");
  const [pageCount, setPageCount] = useState(
    Math.ceil(articles?.length / articlesPerPage)
  );
  const [pagination, setPagination] = useState(defaultPageBlog);

  useEffect(() => {
    setFilter([]);
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
    setFilter(typeof value === "string" ? value.split(",") : value);
  };

  const onChangeTag = (tag) => {
    if (tag === tagFilter) {
      setTagFilter("");
    } else {
      setTagFilter(tag);
    }
  };

  useEffect(() => {
    startTransition(() => {
      if (!isLoading) {
        let cloneArticles = [...articlesList?.data];

        if (filter.length) {
          if (filter.includes(t("blog_sort_new"))) {
            cloneArticles = cloneArticles.sort((first, next) => {
              return +new Date(next.date) - +new Date(first.date);
            });
          }
          if (filter.includes(t("blog_sort_view"))) {
            cloneArticles = cloneArticles.sort((first, next) => {
              return +next.views - +first.views;
            });
          }
        } else {
          cloneArticles = cloneArticles.sort((first, next) => {
            return +new Date(next.date) - +new Date(first.date);
          });
        }

        if (tagFilter) {
          cloneArticles = cloneArticles.filter((article) => {
            let tagNames = article.tags.map((tag) => tag.name);
            return tagNames.includes(tagFilter);
          });
        }

        setArticles([...cloneArticles]);

        let sortedArticles = [];
        cloneArticles?.map((a, i) =>
          Math.ceil((i + 1) / articlesPerPage) === pagination
            ? sortedArticles.push(a)
            : a
        );
        setPageArticles(sortedArticles);
      }
    });
  }, [
    tagFilter,
    filter,
    isLoading,
    articlesList,
    articlesPerPage,
    pagination,
    t,
  ]);

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
              {tagLoading
                ? "Loading tags..."
                : tags?.data?.length
                ? tags?.data?.map((tag, idx) => (
                    <Tag
                      onClick={() => onChangeTag(tag.name)}
                      active={tagFilter === tag.name}
                      key={idx + "tag"}
                      tag={tag}
                    />
                  ))
                : "There is not any tags"}
            </div>
            <div className="header__filter">
              <FormControl className="filter__select">
                <Select
                  id="demo-multiple-chip"
                  multiple
                  value={filter}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={onChangeFilter}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>{t("blog_sort_title")}</em>;
                    }

                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    );
                  }}
                  input={<OutlinedInput id="select-multiple-chip" />}
                >
                  <MenuItem disabled value="">
                    <em>{t("blog_sort_title")}</em>
                  </MenuItem>
                  <MenuItem
                    className="filter__item"
                    key={"filter-elem--1"}
                    value={t("blog_sort_view")}
                  >
                    {t("blog_sort_view")}
                  </MenuItem>
                  <MenuItem
                    className="filter__item"
                    key={"filter-elem--2"}
                    value={t("blog_sort_new")}
                  >
                    {t("blog_sort_new")}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
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
              <p>Articles not found</p>
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
