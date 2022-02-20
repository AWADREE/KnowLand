import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"; //icon
import { MdDelete } from "react-icons/md"; //icon
import { useNavigate } from "react-router-dom"; //for path navigation
import { client } from "../client"; //sanity congigeration
import Spinner from "./Spinner"; //loading componenet
import { categories } from "../utils/data"; //sanity quiery

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate(); //using the user navigation hook
  const validateFields = () => {
    if (title && about && destination && imageAsset?._id && category) {
      setFields(false);
    }
  };
  //uploading image to sanity db
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);

      //we upload the image to the sanity assets
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        }) //then we set the image asset state to the doc we created in the assets
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
          validateFields();
          setFields(false);
        })
        .catch((error) => {
          console.log("Image upload error", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  //creating a sanity doc storing the info obtained from the user
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        //when the key and value pairs are of the same name we can just write it like this
        title,
        about,
        destination,
        image: {
          _type: "image",
          //becouse images are stored as assets somewhere else in sanity's system
          asset: {
            _type: "reference",
            _ref: imageAsset?._id, //we referance the image to connect it to out doc
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      //clear the fields after 2 seconds
      // setTimeout(() => {
      //   setFields(false);
      // }, 5000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className=" bg-secondaryColor p-3 flex flex-0.7 w-full rounded-lg">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}

            {wrongImageType && (
              <div className="rounded-3xl bg-white p-2 px-3 m-2">
                <p className="text-red-600 text-xl font-light">
                  Wrong image type
                </p>
              </div>
            )}
            {!imageAsset ? (
              <label className="cursor-pointer bg-stone-50 p-5 rounded-xl">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400 ">
                    JPG, SVG, PNG, GIF or TIFF
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0 p-0"
                ></input>
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className=" object-contain h-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => {
                    setImageAsset(null);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full ">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validateFields();
            }}
            placeholder="Add your title here"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
              validateFields();
            }}
            placeholder="What is your pin about"
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              validateFields();
            }}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Chosse Pin Category
              </p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                  validateFields();
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {categories.map((category, index) => (
                  <option
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                    value={category.name}
                    key={index + 1}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {fields && (
              <div className="flex justify-center mt-3">
                <p className="text-red-600 mb-5 text-xl transition-all duration-150 ease-in ">
                  Please fill in all the fields
                </p>
              </div>
            )}
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                //added hover:bg-red-400
                className="bg-red-500 hover:bg-red-400 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
