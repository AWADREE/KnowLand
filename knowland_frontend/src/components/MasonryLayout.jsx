import React from "react";
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
  return (
    <Masonry className="flex animate-slide-fwd " breakpointCols={breakpointObj}>
      {/* if pins are not null then map the array and give each a key which is = to the pin doc _id*/}
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
