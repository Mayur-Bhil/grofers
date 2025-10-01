import React, { useState, useCallback } from "react";
import logo1 from "../assets/logo1.png";
import Search from "./Search";
import { Link, useLocation } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import Usermenu from "./Usermenu";
import { PriceInruppees } from "../utils/DisplayPriceinRuppes";
import { useGlobalContext } from "../provider/global.provider";
import DisplayCartItems from "./DisplayCartItems";

const Header = () => {
  const [isMobile] = useMobile();
  const [isUserMenuOpen, setUsermenuOpen] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  const [isCartButtonDisabled, setIsCartButtonDisabled] = useState(false);
  
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  
  const user = useSelector((store) => store?.user);
  
  // Use the consistent cart data from global context
  const { totalPrice, totalQty, cartItemsCount, isLoading } = useGlobalContext();
  
  const redirectToLoginpage = () => {
    navigate("/login");
  };

  const token = localStorage.getItem("accessToken");

  const handleMobileClick = async () => {
    if (!user._id || !token) {
      navigate("/login");
      return;
    } else {
      navigate("/user");
    }
  };

  // Debounced cart button handler
  const handleCartClick = useCallback(() => {
    if (isCartButtonDisabled || openCartSection) return;
    
    setIsCartButtonDisabled(true);
    setOpenCartSection(true);
    
    // Re-enable button after a short delay
    setTimeout(() => {
      setIsCartButtonDisabled(false);
    }, 200);
  }, [isCartButtonDisabled, openCartSection]);

  // Close cart handler
  const closeCart = useCallback(() => {
    setOpenCartSection(false);
    setIsCartButtonDisabled(false);
  }, []);

  return (
    <header className="h-24 z-12 select-none lg:h-20 lg:shadow-md top-0 flex justify-center sticky flex-col gap-1 bg-white lg:select-none ">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo1}
                alt="logo"
                width={169}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo1}
                alt="logo"
                width={102}
                height={60}
                className="lg:hidden rounded-lg"
              />
            </Link>
          </div>
          <div className="hidden lg:block">
            <Search />
          </div>
          <div className="flex items-center">
            {/* Mobile version */}
            <button className="text-neutral-800 lg:hidden " onClick={handleMobileClick}>
              {user.avatar ? (
                <img src={user.avatar} className="h-14 w-14 rounded-full" />
              ) : (
                <FaCircleUser size={34} />
              )}
            </button>
            
            {/* Desktop version */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              {user?._id ? (
                <div onBlur={() => setUsermenuOpen(false)} className="relative">
                  <div
                    onClick={() => setUsermenuOpen((prev) => !prev)}
                    className="flex select-none items-center gap-2 font-semibold cursor-pointer"
                  >
                    <p>Account</p>
                    {isUserMenuOpen ? (
                      <GoTriangleUp size={18} />
                    ) : (
                      <GoTriangleDown size={18} />
                    )}
                    {isUserMenuOpen && (
                      <div className="absolute -right-3 top-13">
                        <div className="bg-[#faeeee00] min-w-52 min-h-20 border rounded-lg lg:shadow-xl">
                          <Usermenu />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              
              <button
                onClick={redirectToLoginpage}
                className="cursor-pointer font-semibold"
              >
                {user._id ? "" : "login"}
              </button>
              
              <button
                onClick={handleCartClick}
                className={`flex items-center gap-2 px-2 py-3 rounded-lg ml-2 text-white transition-colors ${
                  isCartButtonDisabled || openCartSection
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-800 cursor-pointer'
                }`}
                disabled={isLoading || isCartButtonDisabled || openCartSection}
              >
                {/* Cart icon */}
                <div className={isCartButtonDisabled ? '' : 'animate-bounce'}>
                  <BsCart4 size={20} />
                </div>
                
                <div>
                  {cartItemsCount > 0 ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{PriceInruppees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCartSection && (
        <DisplayCartItems close={closeCart} />
      )}
    </header>
  );
};

export default Header;