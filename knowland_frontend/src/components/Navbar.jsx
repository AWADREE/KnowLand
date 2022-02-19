import React from "react";
import { Link, useNavigate } from "react-router-dom"; //importing navigation, by pressing a link element(without triggering a refresh) and by calling the navigate function
import { IoIosAdd, IoMdSearch } from "react-icons/io"; //importing icons

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  //if there is no user then dont render the jsx below
  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => {
            //when the value of the text in the search bar changes then sen the searchTerm state to that value
            setSearchTerm(e.target.value);
          }}
          placeholder="Search"
          value={searchTerm} //setting the value to be the value written
          onFocus={() => {
            //when the input field is clicked, navigate to /search
            navigate("/search");
          }}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img src={user.image} alt="user" className="w-14 h-12 rounded-lg" />
        </Link>
        <Link
          to="/create-pin"
          //changed bg-black to bg-red-500 and hover:bg-red-400
          className="bg-red-500 hover:bg-red-400 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        >
          <IoIosAdd
          // to="create-pin"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
