import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //for navigation
import { v4 as uuidv4 } from "uuid"; //for creating unique keys for mapping
import { MdDownloadForOffline } from "react-icons/md"; //icon
// import { AiTwotoneDelete } from "react-icons/ai"; //icon
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"; //icon
import { AiFillHeart } from "react-icons/ai"; //icon
import { client, urlFor } from "../client"; //sanity client config and image url maker
import { fetchUser } from "../utils/fetchUser"; //util function that fiches the user from local storage

//destructureing the pin doc/obbject properties
const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate(); //using the usenavigate hook
  const user = fetchUser(); //fetching user from localstorage
  //checking if alrdy saved by user
  //getting all the saves of this pin (the likes of the pin) and comparing these ids of the users who posted these saves(postedBy._id) with the current user id
  //if that condition is true then get the length of that array
  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user.googleId
  )?.length;

  //we check the length to get a number instead of an array as filter() returns an array,
  //and then we have a double negative (!!) so that the value of alrdysaved becomes ether true or false
  //1, [2, 3, 1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  //4, [2, 3, 1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: postedBy,
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          setSavingPost(false);
          window.location.reload();
        });
    }
  };

  //added an unsave functionallty
  const unSavePin = (id) => {
    if (alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .unset([`save[userId == "${user.googleId}"]`])
        .commit()
        .then(() => {
          setSavingPost(false);
          window.location.reload();
        });
    }
  };

  //delete the pin
  // const deletePin = (id) => {
  //   client.delete(id).then(() => {
  //     //refresh page
  //     window.location.reload();
  //   });
  // };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => {
          setPostHovered(true);
        }}
        onMouseLeave={() => {
          setPostHovered(false);
        }}
        onClick={() => {
          navigate(`/pin-detail/${_id}`);
        }}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img
            className="rounded-lg w-full"
            alt="user-post"
            src={urlFor(image).width(250).url()}
          />
        )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none "
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  disabled={savingPost}
                  onClick={(e) => {
                    e.stopPropagation();
                    unSavePin(_id);
                  }}
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length}
                  {savingPost ? " loading" : " Saved"}
                </button>
              ) : (
                <button
                  disabled={savingPost}
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="flex items-center bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length != 0 && save?.length}
                  {savingPost ? " loading" : <AiFillHeart className="m-1" />}
                </button>
              )}
            </div>

            <div className="flex justify-between items-center gap-2 w-full ">
              {destination.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {/* changed this to slice from 12 instead of 8 */}
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              ) : undefined}

              {/* {postedBy?._id === user.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )} */}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        //if current url is user-profile/blablabla then replace with
        //    `/user-profile/${postedBy?._id}`
        //else replace is false

        // replace={location.pathname.startsWith("/user-profile/")}

        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        {/* <p className="font-semibold capitalize">{postedBy?.userName}</p> */}
        <p className="font-semibold capitalize">
          {postedBy?.userName.length > 16
            ? `${postedBy.userName.slice(0, 16)}...`
            : postedBy.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
