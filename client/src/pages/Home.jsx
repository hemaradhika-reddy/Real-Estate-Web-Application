import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import Footer from "../components/Footer";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/server/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
<div className="bg-white py-10 px-5">
  {/* Top Section */}
  <div className="flex flex-col gap-4 max-w-6xl mx-auto">
    <h1 className="text-3xl lg:text-6xl text-sky-700 font-semibold transition-all duration-300">
      Find the best property for sale and rent in your area
    </h1>
    <div className="w-full sm:w-2/4">
      <p className="text-sm text-sky-600 transition-all duration-300">
        This is a property website where you can find the best properties for sale and rent, including all details like bedrooms, bathrooms, and more.
        You can also find the best offers on properties at affordable prices. Browse the website for more details.
      </p>
    </div>
    <Link to="/search" className="text-sm sm:text-lg text-sky-800 font-bold hover:underline transition-all duration-200">
      Let&apos;s Get Started...
    </Link>
  </div>

  {/* Swiper (Property Image Slider) */}
  <Swiper
    navigation
    loop
    spaceBetween={20}
    slidesPerView={1}
    breakpoints={{
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
    className=" mt-5 transition-all duration-500 transform hover:scale-105"
  >
    {offerListings && offerListings.length > 0 &&
      offerListings.map((listing) => (
        <SwiperSlide key={listing._id}>
          <div
            style={{
              background: `url(${listing.imageUrls[0].url}) center no-repeat`,
              backgroundSize: "cover",
            }}
            className="h-[400px] rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          ></div>
        </SwiperSlide>
      ))}
  </Swiper>

  {/* Listing Results */}
  <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 justify-center items-center">
    {offerListings && offerListings.length > 0 && (
      <div>
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-sky-700">
            Recent Offers
          </h2>
          <Link
            className="text-sm text-sky-800 hover:underline transition-all duration-200"
            to="/search?offer=true"
          >
            Show more offers
          </Link>
        </div>
        <div className="flex flex-wrap gap-6">
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

    {rentListings && rentListings.length > 0 && (
      <div>
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-sky-700">
            Recent Places for Rent
          </h2>
          <Link
            className="text-sm text-sky-800 hover:underline transition-all duration-200"
            to="/search?type=rent"
          >
            Show more places for rent
          </Link>
        </div>
        <div className="flex flex-wrap gap-6">
          {rentListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

    {saleListings && saleListings.length > 0 && (
      <div>
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-sky-700">
            Recent Places for Sale
          </h2>
          <Link
            className="text-sm text-sky-800 hover:underline transition-all duration-200"
            to="/search?type=sale"
          >
            Show more places for sale
          </Link>
        </div>
        <div className="flex flex-wrap gap-6">
          {saleListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}
  </div>

  <Footer />
</div>






  );
}
