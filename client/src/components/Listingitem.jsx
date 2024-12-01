import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md"; 

const ListingItem = ({ listing }) => {
  return (
    <div className='bg-white shadow-md shadow-blue-300 hover:shadow-lg overflow-hidden rounded-lg w-full sm:w-[330px] 
    transform hover:scale-105 transition-transform duration-300 '>
        <Link to={`/listing/${listing._id}`}>
            <img 
              src={listing.imageUrls[0].url || 
              "https://th.bing.com/th/id/OIP.OTraLZIT9N98YwJ1N6rVsAHaEK?rs=1&pid=ImgDetMain"}
              alt="listing cover"
              className='h-[320px] sm:h-[220px] w-full object-cover 
              hover:scale-105 transition-all duration-300' 
            />
            <div className='p-4 bg-white'>
                <p className='truncate text-lg font-semibold text-sky-700'>{listing.name}</p>
                <div className="flex items-center gap-1">
                    <MdLocationOn className="h-4 w-4 text-sky-600" />
                    <p className="text-sm text-gray-600 truncate w-full">
                    {listing.address}
                    </p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {listing.description}
                </p>
                <p className="text-sky-600 mt-2 font-semibold">
                    $ {listing.offer
                    ? listing.discountedPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                    {listing.type === "rent" && " / month"}
                </p>
                <div className="text-sky-700 flex gap-4">
                    <div className="font-bold text-xs">
                        {listing.bedrooms > 1
                            ? `${listing.bedrooms} beds `
                            : `${listing.bedrooms} bed `}
                    </div>
                    <div className="font-bold text-xs">
                        {listing.bathrooms > 1
                            ? `${listing.bathrooms} baths `
                            : `${listing.bathrooms} bath `}
                    </div>
                </div>
            </div>
        </Link>
    </div>
  );
}

export default ListingItem;
