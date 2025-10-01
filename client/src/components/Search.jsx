import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setisSearchPage] = useState(false);

  useEffect(() => {
    const page = location.pathname === "/search";
    setisSearchPage(page);
  }, [location]);

  const redirectedToSearchPage = () => {
    navigate("/search");
  };
  const HandleOnChange = (e)=>{
      const value = e.target.value;
      const url = `/search?q=${value}`;
      navigate(url)
  }
const params = useLocation();
const searchText  = params.search.slice(3)
  return (
    <div className="search w-full flex items-center p-1 overflow-hidden min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg text-neutral-500 border-2 focus-within:border-amber-300 group">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex cursor-pointer justify-center items-center h-full p-3 text-neutral-600 bg-slate-50     group-focus-within:text-amber-500"
          >
            <FaArrowLeft />
          </Link>
        ) : (
          <button className="flex cursor-pointer justify-center items-center h-full p-3 text-neutral-600 bg-slate-50 group-focus-within:text-amber-500">
            <FaSearch size={20} />
          </button>
        )}
      </div>
      <div className="w-full">
        {!isSearchPage ? (
          <div onClick={redirectedToSearchPage}>
            <TypeAnimation
              sequence={[
                'Search "Milk"', // Types 'One'
                1000, // Waits 1s
                'Search "bread"', // Deletes 'One' and types 'Two'
                1000, // Waits 2s
                'Search "sugar"',
                2000,
                'Search "paneer"',
                2000,
                'Search "tea"',
                3000,
                'Search "icecream"',
                3000,
                'Search "fanta "', // Types 'Three' without deleting 'Two'
                () => {
                  // console.log("Sequence completed");
                },
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
            />
          </div>
        ) : (
          // i ws on search page
          <div className="w-full h-full">
            <input
              className="bg-transparent w-full h-full outline-none"
              autoFocus
              type="text"
              defaultValue={searchText}
              placeholder="search for groceries"
              onChange={HandleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
