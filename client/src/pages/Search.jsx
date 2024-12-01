import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import ListingItem from '../components/ListingItem';

const Search = () => {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
      searchTerm: "",
      type: "all",
      parking: false,
      furnished: false,
      offer: false,
      sort: "created_at",
      order: "desc",
    });

    console.log(sidebardata);
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    console.log(listings);
    

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFromUrl = urlParams.get("type");
        const parkingFromUrl = urlParams.get("parking");
        const furnishedFromUrl = urlParams.get("furnished");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");
    
        if (
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||
          offerFromUrl ||
          sortFromUrl ||
          orderFromUrl
        ) {
          setSidebardata({
            searchTerm: searchTermFromUrl || "",
            type: typeFromUrl || "all",
            parking: parkingFromUrl === "true" ? true : false,
            furnished: furnishedFromUrl === "true" ? true : false,
            offer: offerFromUrl === "true" ? true : false,
            sort: sortFromUrl || "created_at",
            order: orderFromUrl || "desc",
          });
        }
        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/server/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
              setShowMore(true);
            } else {
              setShowMore(false);
            }
            setListings(data);
            setLoading(false);
          };
      
          fetchListings();
        }, [location.search]);    
    

    const handleChange = (e) => {
        if (
          e.target.id === "all" ||
          e.target.id === "rent" ||
          e.target.id === "sale"
        ) {
          setSidebardata({ ...sidebardata, type: e.target.id });
        }
    
        if (e.target.id === "searchTerm") {
          setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }
    
        if (
          e.target.id === "parking" ||
          e.target.id === "furnished" ||
          e.target.id === "offer"
        ) {
          setSidebardata({
            ...sidebardata,
            [e.target.id]:
              e.target.checked || e.target.checked === "true" ? true : false,
          });
        }
    
        if (e.target.id === "sort_order") {
          const sort = e.target.value.split("_")[0] || "created_at";
    
          const order = e.target.value.split("_")[1] || "desc";
    
          setSidebardata({ ...sidebardata, sort, order });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebardata.searchTerm);
        urlParams.set("type", sidebardata.type);
        urlParams.set("parking", sidebardata.parking);
        urlParams.set("furnished", sidebardata.furnished);
        urlParams.set("offer", sidebardata.offer);
        urlParams.set("sort", sidebardata.sort);
        urlParams.set("order", sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

      const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/server/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };

    
      
  return (
<div className='flex flex-col md:flex-row lg:mx-10'>
    {/* Left Sidebar */}
    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen bg-white'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold text-sky-700'>Search Term:</label>
                <input 
                    type="text" 
                    id='searchTerm' 
                    placeholder='Search...'
                    className='border rounded-lg p-3 w-full transition-all duration-300 hover:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none'
                    value={sidebardata.searchTerm} 
                    onChange={handleChange}
                />
            </div>

            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold text-sky-700'>Type: </label>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='all' 
                            className='custom-checkbox' 
                            checked={sidebardata.type === 'all'} 
                            onChange={handleChange}
                        />
                        <span>Rent & Sale</span>
                    </label>
                </div>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='rent' 
                            className='custom-checkbox' 
                            checked={sidebardata.type === 'rent'} 
                            onChange={handleChange}
                        />
                        <span>Rent</span>
                    </label>
                </div>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='sale' 
                            className='custom-checkbox' 
                            checked={sidebardata.type === 'sale'} 
                            onChange={handleChange}
                        />
                        <span>Sale</span>
                    </label>
                </div>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='offer' 
                            className='custom-checkbox' 
                            checked={sidebardata.offer} 
                            onChange={handleChange}
                        />
                        <span>Offer</span>
                    </label>
                </div>
            </div>

            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold text-sky-700'>Amenities:</label>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='parking' 
                            className='custom-checkbox' 
                            checked={sidebardata.parking} 
                            onChange={handleChange}
                        />
                        <span>Parking</span>
                    </label>
                </div>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            id='furnished' 
                            className='custom-checkbox'
                            checked={sidebardata.furnished} 
                            onChange={handleChange} 
                        />
                        <span>Furnished</span>
                    </label>
                </div>
            </div>

            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold text-sky-700'>Sort:</label>
                <select 
                    id='sort_order'
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    className='border rounded-lg p-3 transition-all duration-300 hover:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none'
                >
                    <option value={"regularPrice_desc"}>Price high to low</option>
                    <option value={"regularPrice_asc"}>Price low to high</option>
                    <option value={"createdAt_desc"}>Latest</option>
                    <option value={"createdAt_asc"}>Oldest</option>
                </select>
            </div>

            <button 
                className='bg-sky-600 text-white p-3 rounded-lg uppercase hover:bg-sky-700 transition-all duration-300 transform hover:scale-105'>
                Search
            </button>
        </form>
    </div>

    {/* Right Content Section */}
    <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-sky-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {
                !loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found</p>
                )
            }
            {
                loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                )
            }

            {
                !loading && listings &&
                listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                ))
            }

            {showMore && (
                <button
                    onClick={onShowMoreClick}
                    className="rounded-xl text-xl bg-blue-600 text-white hover:bg-blue-500 p-7 text-center w-full transition-all duration-300 transform hover:scale-105">
                    Show more
                </button>
            )}
        </div>
    </div>
</div>


  )
}

export default Search
