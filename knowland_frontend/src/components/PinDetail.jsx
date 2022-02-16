import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md"; //icon
import { AiFillHeart } from "react-icons/ai"; //icon
import { Link, useParams } from "react-router-dom"; //for navigation an retreaving dynamic path
import { v4 as uuidv4 } from "uuid"; //for creating unique keys
import { AiTwotoneDelete } from "react-icons/ai"; //icon
import { client, urlFor } from "../client"; //sanity config and image url maker
import MasonryLayout from "./MasonryLayout"; //the componenet that contains all the pins
import { pinDetailQuery, pinDetailAdvancedMorePinsQuery } from "../utils/data"; //sanity queries
import Spinner from "./Spinner"; //loading animation componenet
import { useRef } from "react";

const PinDetail = ({ user, scrollToRef }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  //id of a post from the useParams as we made it a dynamic string in the path
  // /pin-detail/pinId
  const { pinId } = useParams(); //thats how u fetch a dynamic param from a path

  let query = useRef(pinDetailQuery(pinId));
  let morePins = useRef([]);
  let uniquMorePins = useRef([]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  //taking an array of oins and comparing keys and removing duplicates
  const uniqBy = (a, key) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  };

  const fetchPinDetails = () => {
    query = pinDetailQuery(pinId);

    if (query) {
      //getting the pin
      client.fetch(query).then((data) => {
        setPinDetail(data[0]); //as the fetch queryreturns an array of pins
        //getting related pins(simmiler pins, with the same category)
        if (data[0]) {
          let words = data[0].title?.split(" ");
          words?.push(
            ...data[0].about?.split(" "),
            ...data[0].category?.split(" ")
          );

          //removing some symboles from strings
          words = words?.map((word) => {
            const newWord = word
              .replace(",", "")
              .replace(":", "")
              .replace(";", "")
              .replace("?", "")
              .replace("!", "");
            return newWord.toLowerCase();
          });
          //removing duplicate words
          words = [...new Set(words)];

          morePins = [];
          // uniquMorePins = [];

          words.forEach((word) => {
            query = pinDetailAdvancedMorePinsQuery(word, data[0]._id);

            client
              .fetch(query)
              .then((res) => {
                if (res.length !== 0) {
                  morePins.push(...res);
                  uniquMorePins = uniqBy(morePins, (it) => it._id);
                }
              })
              .then(() => {
                setPins(uniquMorePins);
              });
          });
        }
      });
    }
  };

  const alreadySaved = !!pinDetail?.save?.filter(
    (item) => item.postedBy._id === user._id
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user._id,
            postedBy: {
              _type: pinDetail?.postedBy,
              _ref: user._id,
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
        .unset([`save[userId == "${user._id}"]`])
        .commit()
        .then(() => {
          setSavingPost(false);
          window.location.reload();
        });
    }
  };

  //delete the pin
  const deletePin = (id) => {
    client.delete(id).then(() => {
      //refresh page
      window.location.reload();
    });
  };

  //the location of this useeffect is important to be before the if statment
  useEffect(() => {
    fetchPinDetails(); //whenever the pinid changes feth the new pin details
  }, [pinId]);

  useEffect(() => {
    scrollToRef();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin..." />; //if pindetail is still null then just render a loading animation

  return (
    <>
      <div
        className="flex xl-flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          {/* c */}

          <div className="flex justify-center">
            {alreadySaved ? (
              <button
                type="button"
                disabled={savingPost}
                onClick={(e) => {
                  e.stopPropagation();
                  unSavePin(pinDetail?._id);
                }}
                className="bg-red-500 opacity-90 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
              >
                {pinDetail?.save?.length}
                {savingPost ? " loading" : " Saved"}
              </button>
            ) : (
              <button
                disabled={savingPost}
                onClick={(e) => {
                  e.stopPropagation();
                  savePin(pinDetail?._id);
                }}
                type="button"
                className="flex items-center bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
              >
                {pinDetail?.save?.length != 0 && pinDetail?.save?.length}
                {savingPost ? (
                  " loading"
                ) : (
                  <AiFillHeart size={32} className="m-1" />
                )}
              </button>
            )}
          </div>

          {/* c */}

          {/* changed justify-between to start */}
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none mr-10" //added a mr-10
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {/* {pinDetail.destination} */}
                {/*{pinDetail.destination.slice(8).length > 0
                ? pinDetail.destination.slice(8, 30) + "...": undefined} */}

                {pinDetail.destination.slice(8).length > 0
                  ? pinDetail.destination.length > 30
                    ? pinDetail.destination.slice(0, 30) + "..."
                    : pinDetail.destination
                  : undefined}
              </a>
            </div>
            {pinDetail.postedBy?._id === user._id && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(pinDetail._id);
                }}
                className="ml-5  bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none hover:bg-red-500 "
              >
                <AiTwotoneDelete />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>

            <p className="mt-3">{pinDetail.about}</p>
            <p className="mt-1">Category: {pinDetail.category}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            {/* changed pinDetail.postedBy to user */}
            <Link to={`user-profile/${user?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                //changed this from pinDetail.postedBy?.image to user?.image
                src={user?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mn-4">
            More like this
          </h2>

          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
