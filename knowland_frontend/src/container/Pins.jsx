import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components"; //importing multiple componenets at the same time

const Pins = ({ user, forwardedRef, scrollToRef }) => {
  const [searchTerm, setSearchTerm] = useState(""); //state to conatin the value of the search term
  const [visiblePins, setVisiblePins] = useState(20);

  const location = useLocation();
  const scrollRef = useRef(null);

  const loadMorePins = () => {
    setVisiblePins((prevVisablePins) => prevVisablePins + 20);
  };

  // const scrollToRef = () => {
  //   forwardedRef.current.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const onScroll = () => {
    if (forwardedRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = forwardedRef.current;
      if (scrollTop + clientHeight + 100 >= scrollHeight) {
        loadMorePins();
      }
    }
  };

  //resetting the visible pins number and scroll to top between pathname changes
  useEffect(() => {
    setVisiblePins(20);
    scrollToRef();
  }, [location.pathname]);

  return (
    <div
      onScroll={onScroll}
      className="px-2 md:px-5 h-full overflow-y-scroll overscroll-contain"
      ref={scrollRef}
      ref={forwardedRef}
    >
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full ">
        {/* everything above the routes is alwys there */}
        <Routes>
          <Route path="/" element={<Feed visiblePins={visiblePins} />} />
          {/* :categoryId is written as a dynamic path so that its value can be retreaved later with useParamas */}
          <Route
            path="/category/:categoryId"
            element={<Feed visiblePins={visiblePins} />}
          />
          <Route
            path="/pin-detail/:pinId"
            element={
              <PinDetail
                user={user}
                scrollToRef={scrollToRef}
                visiblePins={visiblePins}
              />
            }
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
