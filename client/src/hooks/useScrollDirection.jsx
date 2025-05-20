import { useEffect, useState } from 'react';

export const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState("down");

  /* useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 4) return; // threshold
      setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []); */

  useEffect(() => {
    let lastY = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;
      if (currentY > lastY) setScrollDir("down");
      else if (currentY < lastY) setScrollDir("up");
      lastY = currentY;
    };

    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollDir;
}
