import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components"; //importing multiple componenets at the same time

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState(""); //state to conatin the value of the search term
  //this state is here so we can pass it through props to other componenes routed from this componenet

  const scrollRef = useRef(null);
  const scrollToRef = () => {
    scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollHandler = () => {
    // console.log(childRef);
    // if (window.pageYOffset + window.innerHeight >= childRef.current.offsetTop) {
    //   console.log(`Hidden element is now visible`);
    // } else {
    //   console.log("page" + window.pageYOffset + window.innerHeight);
    //   console.log("element" + childRef.current.offsetTop);
    // }
  };

  return (
    <div
      onScroll={scrollHandler}
      className="px-2 md:px-5 h-full overflow-y-scroll overscroll-contain"
      ref={scrollRef}
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
          <Route path="/" element={<Feed />} />
          {/* :categoryId is written as a dynamic path so that its value can be retreaved later with useParamas */}
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user} scrollToRef={scrollToRef} />}
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
