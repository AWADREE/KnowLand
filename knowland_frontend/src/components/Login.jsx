import React from "react";
import GoogleLogin from "react-google-login"; //for authentication
import { useNavigate } from "react-router-dom"; //to be able to navigate paths
import { FcGoogle } from "react-icons/fc"; //google icon
import shareVideo from "../Assets/share.mp4"; //login screen background video
import logo from "../Assets/logowhite.png"; //home screen app logo

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate(); //useing  usenavigate hook

  //a function that takes the logged in google user info and creates a sanity user with his name and image
  const responseGoogle = (response) => {
    //getting the profile object from the response and turning it into json,
    //and setting it to be the key value for the key name user in the local storage
    localStorage.setItem("user", JSON.stringify(response.profileObj)); //so that we can retreave the user data from it when we need to(in the Util. function)

    const { name, googleId, imageUrl } = response.profileObj; //destructuring the name, googleId, and imageUrl from the profileObj

    //_property is written like that so that sanity knows which docs are we creating,
    //the _ is a property which sanity alrdy has
    //and in this case its the user
    //created a const object
    const doc = {
      _id: googleId, //set the _id to the googleId we retreaved from the profileObj
      _type: "user", //we want the type of the doc we will create using this object to be of type user
      //these next two values are the only fields needed to create a new user
      userName: name, //set the username property to the name we retreaved
      image: imageUrl, //set the image prop to the  imageurl we retreaved
    };

    //creating a sanity doc if it doesnt alrdy exist, with the valuse of the doc object
    client
      .createIfNotExists(doc)
      //after we reate a doc, if it wasnt alrdy created before
      .then(() => {
        //we use the nvigate hook we created, and navigate to the path /
        navigate("/", { replace: true }); //replace the current route with the new one
      });
  };

  return (
    //check tailwind docs for the styling classes
    <div className="flex jusify-start items-center flex-col h-screen">
      <div className="realtive w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin //google Login logic alrdy done for us
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} //verfy the link beween google and react
              render={(
                //to create a custme button
                renderProps //get the functions of google login to use later
              ) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick} //using the google login onlcik funtion here
                  disabled={renderProps.disabled} //using the google login disabled funtion
                >
                  <FcGoogle className="mr-4" />
                  Sign in With Google
                </button>
              )}
              onSuccess={responseGoogle} //what to do with the response
              onFailure={responseGoogle} //what to do with the response
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
