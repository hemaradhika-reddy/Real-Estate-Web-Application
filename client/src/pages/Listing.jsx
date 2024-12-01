import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from  'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { useSelector } from 'react-redux'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
    FaHeart,
    FaShoppingCart
  } from "react-icons/fa";

  import Contact from "../components/Contact"

const Listing = () => {

    SwiperCore.use([Navigation]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(true);
    const { currentUser } = useSelector((state) => state.user);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async() => {
            try {
                setLoading(true);
                const res = await fetch(`/server/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }

        fetchListing()
    }, [params.listingId])

    

  return (
<main>
  {loading && <p className="text-center my-7 text-2xl text-sky-500">Loading...</p>}
  {error && <p className="text-center my-7 text-2xl text-red-500">Something went wrong!!</p>}

  {listing && !loading && !error && (
    <div>
      <Swiper
        navigation
        loop
        effect="slide"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="transition-all duration-500 transform hover:scale-101"
      >
        {listing.imageUrls.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-[550px] bg-cover bg-center rounded-lg transform transition-transform duration-500 hover:scale-105"
              style={{ background: `url(${item.url}) center no-repeat` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer transition-all duration-300 hover:bg-sky-500">
        <FaShare
          className="text-slate-500 hover:text-white transition-all duration-300"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>

      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 text-sky-700 transition-all duration-300">
          Link copied!
        </p>
      )}

      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          {listing.name} - ${" "}
          {listing.offer
            ? listing.discountedPrice.toLocaleString()
            : listing.regularPrice.toLocaleString()}
          {listing.type === "rent" && " / month"}
        </p>
        <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-500 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing.offer && (
            <p className="bg-green-500 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              ${+listing.regularPrice - +listing.discountedPrice} OFF
            </p>
          )}
        </div>
        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>
        <ul className="text-blue-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg" />
            {listing.bedrooms > 1 ? `${listing.bedrooms} beds ` : `${listing.bedrooms} bed `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg" />
            {listing.bathrooms > 1 ? `${listing.bathrooms} baths ` : `${listing.bathrooms} bath `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaParking className="text-lg" />
            {listing.parking ? "Parking spot" : "No Parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaChair className="text-lg" />
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </li>
        </ul>

        {/* Wishlist and Cart Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleAddToWishlist(listing)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-sky-600 text-sky-600 rounded-lg transition-transform transform duration-300 hover:bg-sky-600 hover:text-white hover:scale-105"
          >
            <FaHeart className="text-lg" />
            Add to Wishlist
          </button>
          <button
            onClick={() => handleAddToCart(listing)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg transition-transform transform duration-300 hover:bg-green-600 hover:text-white hover:scale-105"
          >
            <FaShoppingCart className="text-lg" />
            Add to Cart
          </button>
        </div>

        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-sky-900 text-white rounded-lg uppercase hover:opacity-95 p-3 transition-all duration-300"
          >
            Contact landlord
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </div>
  )}
</main>



  )
}

export default Listing
