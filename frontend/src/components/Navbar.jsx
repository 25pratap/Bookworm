import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const role = localStorage.getItem("role");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search.trim())}`);
    }
  };


  const navStyle = ({isActive}) =>
    `transition ${
      isActive
      ? "text-yellow-400 font-semibold"
      : "text-gray-300 hover:text-yellow-400"
    }`;


  return (
    <nav className="bg-linear-to-r from-gray-950 via-gray-900 to-gray-950 text-white shadow-lg border-b border-gray-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-16">

        <Link 
          to="/"
          className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition"
        >
          📚 BookWorm
        </Link>


        <div className="flex items-center gap-5">


          <NavLink to="/" className={navStyle}>
            Home
          </NavLink>


          {token ? (
            <>

              <NavLink to="/books" className={navStyle}>
                Books
              </NavLink>

               <NavLink to="/cart" className={navStyle}>
                Cart
              </NavLink>


              {role === "admin" && (
                <NavLink to="/admin" className={navStyle}>
                  Admin
                </NavLink>
              )}



              {/* Search */}

              <div className="relative">

                <input
                  type="text"
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search books..."
                  className="
                  w-60 px-4 py-2.5 pr-10
                  bg-gray-800/80
                  border border-gray-700
                  rounded-2xl
                  text-white
                  placeholder-gray-400
                  focus:ring-2
                  focus:ring-yellow-400
                  outline-none
                  transition
                  "
                />


                {search && (

                  <button
                    onClick={()=>{
                      setSearch("");
                      navigate("/books");
                    }}

                    className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-white
                    "
                  >
                    ✕
                  </button>

                )}

              </div>



              {/* Account */}

              <div className="relative" ref={menuRef}>


                <button
                  onClick={()=>setOpenMenu(!openMenu)}

                  className="
                  bg-gray-800
                  px-4 py-2
                  rounded-xl
                  border border-gray-700
                  hover:bg-gray-700
                  hover:border-yellow-400
                  transition
                  "
                >
                  👤 Account ▾
                </button>



                {openMenu && (

                  <div className="
                  absolute right-0 mt-2
                  w-48
                  bg-white
                  text-gray-800
                  rounded-lg
                  shadow-lg
                  overflow-hidden
                  z-50
                  ">


                    <NavLink
                      to="/change-password"
                      onClick={()=>setOpenMenu(false)}

                      className="
                      block px-4 py-3
                      hover:bg-gray-100
                      "
                    >
                      🔒 Change Password
                    </NavLink>


                    <button

                      onClick={()=>{
                        setOpenMenu(false);
                        handleLogout();
                      }}

                      className="
                      w-full text-left
                      px-4 py-3
                      hover:bg-red-100
                      text-red-600
                      "
                    >

                      🚪 Logout

                    </button>


                  </div>

                )}

              </div>


            </>


          ) : (

            <>
              <NavLink to="/login" className={navStyle}>
                Login
              </NavLink>

              <NavLink to="/register" className={navStyle}>
                Register
              </NavLink>
            </>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;