import React, { useState, useEffect, useRef } from "react";
import { AiOutlineLogout } from "react-icons/ai"; //icon
import { MdDelete } from "react-icons/md"; //icon
import { FiCheck } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom"; //for navigation
import { GoogleLogout } from "react-google-login";
import { fetchUser } from "../utils/fetchUser"; //util function that fiches the user from local storage

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data"; //sanity quiry
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); //cteaed or saved
  const [activeBtn, setActiveBtn] = useState("created");
  const [coverImageAsset, setCoverImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const localUser = fetchUser(); //fetching user from localstorage
  const coverImageInput = useRef(null);
  const scrollRef = useRef(null);

  const scrollToTop = () => {
    scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  //uploading image to sanity db
  const uploadImage = (e) => {
    if (e !== undefined) {
      if (e.target.files[0] == undefined) return;
      const { type, name } = e.target.files[0];
      if (
        type === "image/png" ||
        type === "image/svg" ||
        type === "image/jpeg" ||
        type === "image/gif" ||
        type === "image/tiff"
      ) {
        // setWrongImageType(false);
        setLoading(true);

        client.assets
          .upload("image", e.target.files[0], {
            contentType: type,
            filename: name,
          })
          .then((document) => {
            setCoverImageAsset(document);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Image upload error", error);
          });
      } else {
        // console.log("Wronge image type");
        // setWrongImageType(true);
      }
    }
  };

  //creating a sanity doc storing the info obtained from the user
  const saveCover = () => {
    if (coverImageAsset?._id) {
      setSavingCover(true);
      client
        .patch(userId)
        // .unset([`coverImage`])
        .set({
          coverImage: {
            _type: "image",
            //becouse images are stored as assets somewhere else in sanity's system
            asset: {
              _type: "reference",
              _ref: coverImageAsset?._id, //we referance the image to connect it to out doc
            },
          },
        })
        .commit()
        .then(() => {
          setSavingCover(false);
          window.location.reload();
        });
    }
  };

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
    scrollToTop();
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="loading profile..." />;
  }

  const clickable =
    "cursor-pointer w-full h-370 2xl:h-510 shadow-lg object-cover";
  const unclickable = " w-full h-370 2xl:h-510 shadow-lg object-cover";
  return (
    <div
      ref={scrollRef}
      className="relative pb-2 h-full justify-center items-center overflow-y-scroll"
    >
      <div className="felx flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            {coverImageAsset && (
              <div className="absolute top-60 2xl:top-96 right-0">
                <div className="flex flex-col mr-3">
                  <button
                    type="button"
                    disabled={savingCover}
                    className="mb-1 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => {
                      setCoverImageAsset(null);
                    }}
                  >
                    <MdDelete />
                  </button>

                  <button
                    type="button"
                    disabled={savingCover}
                    className="mb-2 mt-1 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => {
                      saveCover();
                    }}
                  >
                    <FiCheck />
                  </button>
                </div>
              </div>
            )}

            <label
              className={
                userId === localUser.googleId ? clickable : unclickable
              }
            >
              {loading ? (
                <Spinner message="Uploading your new cover..." />
              ) : (
                <img
                  src={
                    coverImageAsset
                      ? coverImageAsset?.url
                      : user.coverImage === null
                      ? "https://source.unsplash.com/1600x900/?nature,photography,technology"
                      : urlFor(user.coverImage)
                  }
                  className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                  alt="banner-pic"
                />
              )}

              {userId === localUser.googleId && (
                <input
                  ref={coverImageInput}
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0 "
                ></input>
              )}
            </label>

            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>

            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === localUser.googleId && (
                <GoogleLogout //google Logout logic alrdy done for us
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} //verfy the link beween google and react
                  render={(
                    //to create a custme button
                    renderProps //get the functions of google logout to use later
                  ) => (
                    <button
                      type="button"
                      className="bg-white p-3 rounded-full cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={renderProps.onClick} //using the google logout onlcik funtion here
                      disabled={renderProps.disabled} //using the google logout disabled funtion
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout} //what to do with the response
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center fond-bold items-center w-full text-xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
