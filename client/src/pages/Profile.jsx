import React, {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, list, uploadBytesResumable} from 'firebase/storage'
import {useSelector, useDispatch} from 'react-redux'
import { app } from '../firebase';
import {Link} from 'react-router-dom'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice.js';
import { account, storage_appwrite } from '../appwrite.js';
import { ID } from 'appwrite';



const Profile = () => {

    const dispatch = useDispatch();

    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [showListingError, setShowListingError] = useState(false);
    const {currentUser, loading, error} = useSelector(state => state.user)

    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [userListings, setUserListings] = useState([]);
    
    console.log(formData);

    useEffect(() => {
        if(file){
            const url = getProfilePicURL(file);
            console.log(url);
            
            setFormData({...formData, avatar: url.href})
            
        }
    }, [file])

    //appwrite function
    const getProfilePicURL = (fileId) => {
        return storage_appwrite.getFilePreview('672e7121002b7066c322', fileId); // getFileView() can also be used for the full image view
    };
    
    const uploadProfilePic = async (file) => {
        try {
            const response = await storage_appwrite.createFile(
                '672e7121002b7066c322',    
                ID.unique(),           // Generate a unique ID for the file
                file                   // The file to be uploaded (e.g., from an <input type="file">)
            );
            console.log('File uploaded successfully:', response);
            setFile(response.$id);  
            const url = getProfilePicURL(file);
            
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
    

    const handleFileUpload = async (file) => {


        //appwrite
        
        
        //firebase
        // const storage = getStorage(app);
        // const fileName = new Date().getTime()+file.name;
        // const storageRef = ref(storage, fileName);

        // const uploadTask = uploadBytesResumable(storageRef, file);

        // uploadTask.on(
        //     'state_changed', 
        //     (snapshot) => {
        //     const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        //     setFilePerc(Math.round(progress));
        // },
        // (error) => {
        //     setFileUploadError(true);
        // },
        // () => {
        //     getDownloadURL(uploadTask.snapshot.ref).then(
        //         (downloadURL) => {
        //             setFormData({...formData, avatar: downloadURL})
        //         }
            // );


        }
    


    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]:e.target.value})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();


        // //appwrite
        // try {
        //     // Update user details
        //     if (formData.name) await account.updateName(formData.name);
        //     if (formData.email) await account.updateEmail(formData.email);
        //     if (formData.password) await account.updatePassword(formData.password);
        //     console.log();
            
            
        // } catch (error) {
        //     console.error('Error updating profile:', error);
        // }

        //firebase

        try {
          dispatch(updateUserStart());
          const res = await fetch(`/server/user/update/${currentUser._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(formData),
          });
          console.log(formData);
          
          const data = await res.json();
          if (data.success === false) {
            dispatch(updateUserFailure(data.message));
            return;
          }
          
          dispatch(updateUserSuccess(data));
          console.log(data.username, "Profile");
          
          
          setUpdateSuccess(true);
        } catch (error) {
          dispatch(updateUserFailure(error.message));
        }
      };

      const handleDeleteUser = async() => {


        //appwrite

        try {

            
        } catch (error) {
            
        }


            try {
                dispatch(deleteUserStart());
                const res = await fetch(`server/user/delete/${currentUser._id}`, {
                    method: 'DELETE',
                });
                
                const data = await res.json();

                if(data.success === false){
                    dispatch(deleteUserFailure(data.message));
                    return;
                }

                dispatch(deleteUserSuccess(data));

            } catch (error) {
                dispatch(deleteUserFailure(error.message));
            }
      }

      const handleSignOut = async(e) => {

        //appwrite

        try {
            await account.deleteSession("current");
            console.log("logout success");
            
        } catch (error) {
            console.log(error);
            
        }

        try {
            dispatch(signOutUserStart())
            const res = await fetch('/server/auth/signout');
            const data = await res.json();
            if(data.success === false){
                dispatch(signOutUserFailure(data.message))
                return;
            }
            dispatch(signOutUserSuccess(data))
            
        } catch (error) {
            dispatch(signOutUserFailure(error))
        }
      }

      const handleShowListings = async () => {
        try {

            setShowListingError(false);
            const res = await fetch(`/server/user/listings/${currentUser._id}`);
            const data = await res.json();
            if(data.success ===false){
                setShowListingError(true);
                return;
            }
            console.log(data);
            
            setUserListings(data);
            
        } catch (error) {
            setShowListingError(true)
        }
      }

      const handleListingDelete = async (listingId) => {
        try {
          const res = await fetch(`/server/listing/delete/${listingId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
    
          setUserListings((prev) =>
            prev.filter((listing) => listing._id !== listingId)
          );
        } catch (error) {
          console.log(error.message);
        }
      };


    return (
<div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center text-sky-700'>Profile</h1>
    
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
            onChange={(e) => uploadProfilePic(e.target.files[0])}
            type="file" 
            ref={fileRef} hidden accept='image/*' id='profilepic' />
            
        <img 
            onClick={() => fileRef.current.click()} 
            src={formData.avatar || currentUser.avatar} 
            alt="profile" 
            className=' border-2 border-blue-300 self-center w-24 h-24 rounded-full object-cover cursor-pointer mt-2 transition-all duration-300 transform hover:scale-110 hover:border-blue-300'
        />

        <p className='text-sm self-center'>
            {fileUploadError ? (
                <span className='text-red-700'>Error Image upload (image must be less than 2MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
                ""
            )}
        </p>

        <input type="text" placeholder='username' 
            className='border p-3 rounded-lg transition-all duration-300 hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500'
            defaultValue={currentUser.username}
            onChange={handleChange}
            id='username'
        />
        <input type="email" placeholder='email' 
            className='border p-3 rounded-lg transition-all duration-300 hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500'
            defaultValue={currentUser.email}
            onChange={handleChange}
            id='email'
        />
        <input type="password" placeholder='password' 
            className='border p-3 rounded-lg transition-all duration-300 hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500'
            defaultValue={currentUser.password}
            onChange={handleChange}
            id='password'
        />
        <button disabled={loading} className='bg-sky-600 text-white p-3 rounded-lg uppercase hover:bg-sky-700 disabled:opacity-85 transition-all duration-300 transform hover:scale-105'>
            {loading ? 'Loading...' : 'Update'}
        </button>

        <Link className='bg-white text-sky-700 p-3 rounded-lg uppercase text-center hover:bg-sky-100 transition-all duration-300 transform hover:scale-105' to="/create-listing">Create Listing</Link>

    </form>
    
    <div className='flex justify-between mt-3'>
        <span onClick={handleDeleteUser} className='bg-white border py-2 px-3 rounded-lg text-red-700 font-semibold cursor-pointer hover:bg-red-100 hover:scale-105 transition-all duration-300'>
            Delete
        </span>
        <span onClick={handleSignOut} className='bg-white border py-2 px-3 rounded-lg text-sky-700 font-semibold cursor-pointer hover:bg-sky-100 hover:scale-105 transition-all duration-300'>
            Sign out
        </span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ""}</p>
    <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully' : ""}</p>

    <button onClick={handleShowListings}
        className='bg-sky-700 w-full text-white p-3 rounded-lg uppercase font-semibold hover:bg-sky-800 transition-all duration-300 transform hover:scale-105'>
        Show Listings
    </button>
    <p className='text-red-700 mt-5'>{showListingError ? "Error showing listings" : ""}</p>

    {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl font-semibold text-sky-700'>Your Listings</h1>

            {userListings.map((listing) => (
                <div key={listing._id} 
                    className='border rounded-lg p-3 flex justify-between items-center gap-4 shadow-md shadow-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-105'>
                    <Link to={`/listing/${listing._id}`}>
                        <img src={listing.imageUrls[0].url} alt="listing cover" 
                            className='h-16 w-16 object-contain' />
                    </Link>
                    <Link to={`/listing/${listing._id}`} 
                        className='text-slate-700 font-semibold hover:underline truncate flex-1'>
                        <p>{listing.name}</p>
                    </Link>

                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => handleListingDelete(listing._id)}
                            className='text-red-700 uppercase border border-red-500 p-2 rounded-lg transition-all duration-300 hover:bg-red-200'>
                            Delete
                        </button>
                        <Link to={`/update-listing/${listing._id}`}>
                            <button className='text-sky-700 uppercase border border-sky-500 p-2 rounded-lg transition-all duration-300 hover:bg-sky-100'>
                                Edit
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>



    )
}

export default Profile
