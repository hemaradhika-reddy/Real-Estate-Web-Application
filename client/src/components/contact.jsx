import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/server/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Error fetching landlord information");
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {loading ? (
        <p className="text-center my-7 text-2xl text-sky-500">Loading...</p>
      ) : error ? (
        <p className="text-center my-7 text-2xl text-red-500">Error: {error}</p>
      ) : (
        landlord && (
          <div className="flex flex-col gap-4 p-4 bg-sky-50 rounded-lg shadow-md">
            <p className="text-xl text-sky-800">
              Contact <span className="font-semibold">{landlord.username}</span> for{" "}
              <span className="font-semibold">{listing.name.toLowerCase()}</span>
            </p>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={message}
              onChange={onChange}
              placeholder="Enter your message here..."
              className="border border-slate-300 p-3 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-500 transition-all duration-300"
            ></textarea>

            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className="bg-sky-900 text-white text-center p-3 rounded-lg uppercase hover:bg-sky-700 transition-all duration-300"
            >
              Send Message
            </Link>
          </div>
        )
      )}
    </>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Contact;
