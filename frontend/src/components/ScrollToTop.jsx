import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures that whenever the route path or search parameters
 * (e.g., clicking a category, navigating pages, clicking a job card) change,
 * the window automatically scrolls to the top of the page.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
