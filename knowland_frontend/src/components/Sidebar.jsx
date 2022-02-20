import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../Assets/logo.png";
import { categories } from "../utils/data";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    //if closeToggle is not undefined
    if (closeToggle) {
      closeToggle(false);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <div className="fixed mr-0 pl-3 md:w-fit w-3/5 bg-white ">
          <Link
            to="/"
            className="flex gap-2 my-6 pt-1 w-190 items-center mr-2"
            onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" className="w-full" />
          </Link>
        </div>

        <div className="h-24"></div>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill size={50} className="p-3" />
            Home
          </NavLink>

          <h3 className=" px-5 text-base 2xl:text-xl font-light">
            Discover categories
          </h3>

          {categories.slice(0, categories.length).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                className="w-12 h-12 object-contain rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
          <div className="h-16"></div>
        </div>
      </div>
      {user && (
        <div className="fixed bottom-0 ">
          <Link
            to={`user-profile/${user._id}`}
            className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 w-48"
            onClick={handleCloseSidebar}
          >
            <img
              src={user.image}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />

            <p>
              {user.userName.length > 25
                ? `${user.userName.slice(0, 25)}...`
                : user.userName}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
