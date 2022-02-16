import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi"; //icon
import { AiFillCloseCircle } from "react-icons/ai"; //icon
import { Link, Route, Routes } from "react-router-dom"; //for routing
import { Sidebar, UserProfile } from "../components"; //imprting multiple componenets
import Pins from "../container/Pins";
import { userQuery } from "../utils/data"; //importing query syntax from data file
import { client } from "../client"; //importying sanity client configuration file
import logo from "../Assets/logo.png";
import { fetchUser } from "../utils/fetchUser"; //importing util. function that fetches the user from local storage

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false); //state for the navbar
  const [user, setUser] = useState(null); //state to store the user
  const scrollRef = useRef(null); //crating a scrollRef to scroll to
  //getting the user from local storage using a utility function,
  ////getting the user from local storage
  const userInfo = fetchUser();

  //only on mount set the user state to the user doc where the id is the one saved in localstorage
  ////getting the sanity user doc of our user
  useEffect(() => {
    const query = userQuery(userInfo?.googleId); //get me the sanity user doc where the id is the googleId from the userInfo we retreaved,
    //and assign its value to a const called query
    client.fetch(query).then((data) => {
      setUser(data[0]); //then fetch this query from sanity and then set user state to the first elment retreaved from the data array
    });
  }, []);

  //only on mount
  useEffect(() => {
    //scroll to the scroll ref
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="home flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        {/* if user exists then send the user otherwise pass false */}
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => {
              setToggleSidebar(true);
            }}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {/* if there is a user in the state then get his _id */}
          <Link to={`user-profile/${user?._id}`}>
            {/* if there is a user then get his image */}
            <img
              src={user?.image}
              alt="logo"
              className="w-9 h-9 rounded-full"
            />
          </Link>
        </div>
        {/* if toggleSidebar is true then render this jsx */}
        {toggleSidebar && (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 z-10 bg-blackOverlay"
            onClick={() => {
              setToggleSidebar(false);
            }}
          >
            <div
              className="fixed w-3/5 bg-white h-screen overflow-y-auto shadow-md z-20 animate-slide-in"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* <div className="absolute w-full flex justify-end items-center p-2">
                <AiFillCloseCircle
                  fontSize={30}
                  className="cursor-pointer "
                  onClick={(e) => {
                    setToggleSidebar(false);
                  }}
                />
              </div> */}
              <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            </div>
          </div>
        )}
      </div>

      {/* removed  */}
      <div className="pb-2 flex-1 h-screen " ref={scrollRef}>
        {/* the routes are here so that everything before them is always there in the app on all pages/routes */}
        <Routes>
          {/* : in the string means that what comes after will be dynamic, and this userId its value can be retreaved later useing useParams hook*/}
          {/* any path entered starting with /user-profile/ thena varibale path,  render the UserProfile component in it*/}
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          {/* any path entered starting with /  render the Pins component in it*/}
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
