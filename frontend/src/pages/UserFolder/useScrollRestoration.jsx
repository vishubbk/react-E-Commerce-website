import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const key = location.pathname + location.search;

    // Restore scroll when entering the page
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }

    // Save scroll before leaving the page
    return () => {
      sessionStorage.setItem(key, window.scrollY);
    };
  }, [location]);
}
