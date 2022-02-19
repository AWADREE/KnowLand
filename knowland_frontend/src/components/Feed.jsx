import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //importing useparams to findout what are the passed in parameters

import { client } from "../client"; //importing the sanity client configueration
import { feedQuery, searchQuery } from "../utils/data"; //importing sanity quiries
import MasonryLayout from "./MasonryLayout"; //for rendering pins
import Spinner from "./Spinner"; //for loading

const Feed = ({ visiblePins }) => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams(); //this is how the useParams hook is used

  //when categoryId changes
  useEffect(() => {
    //if there is a categoryId
    setLoading(true); //rednder the loading animation, brought this out of the if

    if (categoryId) {
      const query = searchQuery(categoryId); //query sanity for the category with that categoryId
      client.fetch(query).then((data) => {
        //then set the pins to the data retreaved
        setPins(data);
        //and stop loading animation
        setLoading(false);
      });
    } else {
      //otherwise if there is no category id just fetch the feed
      client.fetch(feedQuery).then((data) => {
        //then set the pins to the data retreaved
        setPins(data);
        //and stop loading animation
        setLoading(false);
      });
    }
  }, [categoryId]);

  //if loading render loading animation
  if (loading)
    //we are passing this message as prop so that we can make it dynamic depending on the category
    return <Spinner message="We are adding new ideas to your feed!" />;

  //if there are no pins render this
  if (!pins?.length) {
    return (
      <div className="flex justify-center items-center">
        <h2>No pins available!</h2>
      </div>
    );
  }

  //if there are pins in the state then render the MasonryLoayout and give it these pins as props
  return (
    <div>{pins && <MasonryLayout pins={pins} visiblePins={visiblePins} />}</div>
  );
};

export default Feed;
