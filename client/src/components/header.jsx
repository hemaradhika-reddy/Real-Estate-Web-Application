import React,{useState, useEffect} from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

const Header = () => {

    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl);
        }
      }, [location.search]);

    return (
<header>
    <div className="flex justify-evenly w-full bg-sky-800 p-3 shadow-md items-center rounded-lg transition-transform duration-300 hover:scale-105">
        
        {/* Left Section (Logo) */}
        <Link to="/" className="transition-all duration-300 transform hover:scale-110">
            <div className="flex justify-between items-center gap-1">
                <h1 className="text-sm sm:text-xl font-semibold text-white transition-all duration-200 hover:text-sky-200">
                    Dream
                </h1>
                <h1 className="text-xl font-extrabold text-white transition-all duration-200 hover:text-sky-200">
                    House
                </h1>
            </div>
        </Link>

        {/* Center Section (Search Bar) */}
        <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 flex items-center transition-all duration-200 hover:scale-105">
                <input
                    type="text"
                    placeholder="Search....."
                    className="bg-transparent focus:outline-none w-24 sm:w-64 text-sky-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                    <FaSearch className="text-sky-600 hover:text-sky-800 transition-transform duration-200 hover:scale-105" />
                </button>
            </form>
        </div>

        {/* Right Section (Navigation & Profile) */}
        <div>
            <ul className="flex gap-4">
                <Link to="/">
                    <li className="hidden sm:inline text-white hover:underline transition-transform duration-300 hover:scale-110">
                        Home
                    </li>
                </Link>

                <Link to="/about">
                    <li className="hidden sm:inline text-white hover:underline transition-transform duration-300 hover:scale-110">
                        About
                    </li>
                </Link>

                <Link to="/profile">
                    {currentUser ? (
                        <img
                            className="rounded-full w-7 h-7 object-cover transition-transform duration-300 hover:scale-110"
                            src={currentUser.avatar}
                            alt="profile"
                        />
                    ) : (
                        <li className="hidden sm:inline text-white hover:underline transition-transform duration-300 hover:scale-110">
                            Sign In
                        </li>
                    )}
                </Link>
            </ul>
        </div>
    </div>
</header>


    
    )
}

export default Header
