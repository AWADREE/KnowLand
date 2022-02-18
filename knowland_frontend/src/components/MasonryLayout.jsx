import React, { useState } from "react";
import Masonry from "react-masonry-css"; //importing masonry for a cool grd effect to render the pins in
import Pin from "./Pin"; //inporting the pin componenet to map into
//on screens 3000px break to the next line at 6 pins
//on screens 2000px break to the next line at 5 pins and so on
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  const [visiblePins, setVisiblePins] = useState(20);
  //   // const scrollRef = useRef();
  //   // const scrollable = useRef();

  const loadMorePins = () => {
    setVisiblePins((prevVisablePins) => prevVisablePins + 20);
  };

  //   // useEffect(() => {
  //   //   console.log(`effect`);
  //   //   window.addEventListener("scroll", scrollHandler);

  //   //   return () => window.removeEventListener("scroll", scrollHandler);
  //   // }, []);

  return (
    <>
      <Masonry
        className="flex animate-slide-fwd "
        breakpointCols={breakpointObj}
      >
        {/* if pins are not null then map the array and give each a key which is = to the pin doc _id*/}
        {pins?.slice(0, visiblePins).map((pin) => (
          <Pin key={pin._id} pin={pin} className="w-max" />
        ))}
      </Masonry>
      {/* <div ref={forwardedRef} className="p-5 w-full bg-black"></div> */}
      {pins?.length > visiblePins && (
        <div className="flex justify-center pt-5">
          <button
            type="button"
            className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            onClick={loadMorePins}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default MasonryLayout;
