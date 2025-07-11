import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { close, menu } from "../assets";
import { navLinks } from "../data";

const Navbar = ({ scrollContainer }) => {
  const [active, setActive] = useState("hero");
  const [toggle, setToggle] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 100;

  useEffect(() => {
    const scrollElement = scrollContainer.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const currentScrollY = scrollElement.scrollTop;
      const previousScrollY = lastScrollY.current;

      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > previousScrollY) {
          setVisible(false);
        } else if (currentScrollY < previousScrollY) {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer]);

  useEffect(() => {
    // Get all section elements with IDs
    const sections = document.querySelectorAll("div[id]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.1, // Lowered threshold to make detection more sensitive
        rootMargin: '0px 0px -40% 0px' // Adjusted to trigger earlier when scrolling down
      }
    );

    // Log the sections being observed for debugging
    console.log('Observing sections:', Array.from(sections).map(s => s.id));
    
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <nav
      className={`flex items-center bg-black p-1 sm:p-4 fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 z-40 rounded-full w-fit sm:w-auto max-w-3xl transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div className='flex items-center mx-auto'>
        <ul className='list-none hidden sm:flex flex-row gap-8 items-center'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`relative flex items-center ${
                active === nav.id ? "text-white" : "text-slate-500"
              } hover:text-white text-[16px] lg:text-[18px] font-bold pointer-events-auto cursor-pointer`}
              onClick={() => setActive(nav.id)}
            >
              {active === nav.id && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-quaternary"></div>
              )}
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        <div className='sm:hidden flex flex-1 justify-center items-center'>
          <ul className='list-none flex flex-row gap-2 items-center py-1'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`relative flex items-center ${
                  active === nav.id ? "text-white" : "text-slate-500"
                } hover:text-white text-[11px] font-bold pointer-events-auto cursor-pointer whitespace-nowrap`}
                onClick={() => setActive(nav.id)}
              >
                {active === nav.id && (
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-quaternary"></div>
                )}
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
