import React, { useEffect, useState } from 'react'
import {storage_appwrite} from "../appwrite.js"
import {app} from "../firebase.js"
import {getStorage, getDownloadURL, ref, uploadBytesResumable, list} from 'firebase/storage'
import { ID } from 'appwrite'
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

const UpdateListing = () => {

    const navigate = useNavigate();
    const params = useParams();

    //appwrite
    const {currentUser} = useSelector(state => state.user)
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({ imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false, 

    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/server/listing/get/${listingId}`);

            const data = await res.json();

            if(data.success === false){
                console.log(data.massage);
                return;               
            }

            setFormData(data);
        }

        fetchListing();
    }, []);

    const handleImageSubmit = async () => {
        if (!files.length) return;
        setUploading(true)
        setImageUploadError(null);
        
        const uploadedImages = [];
        
        try {
            const uploadPromises = Array.from(files).map((file) => {
                return storage_appwrite.createFile(
                    '672e7121002b7066c322',    // Replace with your bucket ID
                    ID.unique(),   // Generate unique ID for each file
                    file           // File to upload
                ).then((response) => {
                    const imageUrl = storage_appwrite.getFileView('672e7121002b7066c322', response.$id);
                    uploadedImages.push({ url: imageUrl.href, id: response.$id });
                    return response;
                }).catch((error) => {
                    console.error('Error uploading image:', error.message);
                    setImageUploadError('Error uploading some images');
                });
            });

            await Promise.all(uploadPromises);
            setFormData((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...uploadedImages]
            }));
            setImageUploadError(false);
            setUploading(false)
        } catch (error) {
            console.error('Error uploading images:', error.message);
            setImageUploadError('Error uploading images');
            setUploading(false);
        }
    };

    const handleRemoveImage = async (index) => {

        const imageToDelete = formData.imageUrls[index];
        console.log(imageToDelete);
        
        try {
            await storage_appwrite.deleteFile('672e7121002b7066c322', imageToDelete.id); // Delete image from Appwrite storage
            setFormData((prev) => {
                const newImageUrls = [...prev.imageUrls];
                newImageUrls.splice(index, 1); // Remove from state
                return { ...prev, imageUrls: newImageUrls };
            });
        } catch (error) {
            console.error('Error deleting image:', error.message);
            setImageUploadError('Error deleting image');
        }
    };

    // const [files, setFiles] = useState([]);
    // const [formData, setFormData] = useState({
    //     imageUrls:[]
    // })

    // const [imageUploadError, setImageUploadError] = useState(false);
    // const [uploading, setUploading] = useState(false);

    // // console.log(files);
    // console.log(formData);
    // const handleImageSubmit = (e) => {
    //     if(files.length > 0 && formData.imageUrls.length + files.length < 7){
    //         const promises = []

    //         for(let i=0; i<files.length; i++){
    //             promises.push(storeImage(files[i]))
    //         }

    //         Promise.all(promises).then((urls) => {
    //             setFormData({...formData,
    //                 imageUrls: formData.imageUrls.concat(urls),
    //             })
    //         }).catch((err) => {
    //             setImageUploadError('Image upload failed (2mb max per image)');
    //         })
    //     }
    //     else{
    //         setImageUploadError('You can only upload 6 images per listing');
    //     }
    // }

    // const storeImage = async (file) => {
    //     return newPromise((resolve, reject) => {
    //         const storage = getStorage(app)
    //         const fileName = new Date().getTime() + file.name;
    //         const storageRef = ref(storage, fileName);
    //         const uploadTask = uploadBytesResumable(storageRef, file);
    //         uploadTask.on(
    //             'state_changed',
    //             (snapshot) => {
    //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log(`Upload is ${progress}% done`);
                    
    //             },
    //             (error) => {
    //                 reject(error);
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     resolve(downloadURL);
    //                 })
    //             }
    //         )
    //     })
    // }
    
    // const handleRemoveImage = (index) => {
    //     setFormData({...formData,
    //         imageUrls: formData.imageUrls.filter((_, i) => i!==index)
    //     })
    // }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if(e.target.id === 'parking' || 
            e.target.id === 'furnished' || 
            e.target.id === 'offer'){
                setFormData({
                    ...formData,
                    [e.target.id] : e.target.checked
                })
        }

        if(e.target.type === 'number' ||
             e.target.type === 'text' ||
             e.target.type === 'textarea'){
                setFormData({
                    ...formData,
                    [e.target.id]: e.target.value
                })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) 
                return setError('You must upload at least one image');
            if(+formData.regularPrice < +formData.discountedPrice) 
                return setError('Discount price must be lower than regular price');


            setLoading(true);
            setError(false);
            const res = await fetch(`/server/listing/update/${params.listingId}`, {
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });

            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message)
            }
            console.log(data);
            
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
            
        }

    }


  return (
<main className='p-3 max-w-4xl mx-auto bg-white shadow-lg rounded-lg'>
    <h1 className='text-3xl font-semibold text-center text-sky-700 my-7'>Update a Listing</h1>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-5'>
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' onChange={handleChange} value={formData.name}
                className='border p-3 rounded-lg border-sky-300  focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' id='name' maxLength='62' minLength='10' required />
            <textarea placeholder='Description' onChange={handleChange} value={formData.description}
                className='border p-3 rounded-lg border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500-200 transition-all duration-300 transform hover:scale-105 focus:scale-105' id="description" required>
            </textarea>
            <input type="text" placeholder='Address' onChange={handleChange} value={formData.address}
                className='border p-3 rounded-lg border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' id='address' required />

            <div className='flex gap-6 flex-wrap'>
                
                <div className="flex gap-2">
                    <input 
                        type="checkbox" 
                        id="sale" 
                        className='w-5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500' 
                        onChange={handleChange} 
                        checked={formData.type === 'sale'}
                    />
                    <span className="text-sky-600">Sell</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="checkbox" 
                        id="rent" 
                        className='w-5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500' 
                        onChange={handleChange} 
                        checked={formData.type === 'rent'}
                    />
                    <span className="text-sky-600">Rent</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="checkbox" 
                        id="parking" 
                        className='w-5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500'
                        onChange={handleChange} 
                        checked={formData.parking}
                    />
                    <span className="text-sky-600">Parking Spot</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="checkbox" 
                        id="furnished" 
                        className='w-5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500'
                        onChange={handleChange} 
                        checked={formData.furnished}
                    />
                    <span className="text-sky-600">Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="checkbox" 
                        id="offer" 
                        className='w-5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500'
                        onChange={handleChange} 
                        checked={formData.offer}
                    />
                    <span className="text-sky-600">Offer</span>
                </div>
            </div>

            <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            id='bedrooms' 
                            min="1" 
                            max="10"  
                            onChange={handleChange} 
                            value={formData.bedrooms}
                            className='border border-sky-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' 
                            required
                        />
                        <p className="text-sky-600">Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        id='bathrooms' 
                        min="1" 
                        max="10" 
                        onChange={handleChange} 
                        value={formData.bathrooms}
                        className='border border-sky-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' 
                        required
                    />
                    <p className="text-sky-600">Bathrooms</p>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        id='regularPrice' 
                        min="100" 
                        max="10000000"  
                        onChange={handleChange} 
                        value={formData.regularPrice}
                        className='border border-sky-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' 
                        required
                    />
                    <div className='flex flex-col items-center'>
                        <p className="text-sky-600">Regular Price</p>
                        <span className="text-xs">($ / month)</span>
                    </div>
                </div>
                {formData.offer && (
                    <div className="flex items-center gap-2">
                        <input type="number" id='discountedPrice' min="0" max="10000000" onChange={handleChange} 
                            value={formData.discountedPrice}
                            className='border border-sky-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 focus:scale-105' required />
                        <div className='flex flex-col items-center'>
                            <p className="text-sky-600">Discounted Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col flex-1 gap-3">
            <p className="font-semibold text-sky-600">Images:
                <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
            </p>
            <div className="flex gap-4">
                <input onChange={(e) => setFiles(e.target.files)} type="file" 
                className='p-2 border border-sky-300 rounded w-full ffocus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105'
                    id='images' accept='image/*' multiple />
                <button type='button' onClick={handleImageSubmit}
                    className='py-2 px-4 text-sky-700 border border-sky-700 rounded uppercase hover:bg-sky-700 hover:text-white transform hover:scale-105 transition-all duration-300 disabled:opacity-80'>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {formData.imageUrls.length > 0 && formData.imageUrls.map((image, index) => (
                <div key={index} className="flex justify-center p-3 border items-center">
                    <img src={image.url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                    <button type='button' onClick={() => handleRemoveImage(index)}
                        className='ml-4 p-3 text-red-500 border border-red-500 rounded-lg uppercase hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105'>
                        Delete
                    </button>
                </div>
            ))}

            <button disabled={loading || uploading} className='p-3 bg-sky-600 text-white rounded-lg uppercase hover:bg-sky-700 transition-all duration-300 disabled:opacity-80'>
                {loading ? 'Updating...' : "Update Listing"}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
    </form>
</main>



  )
}

export default UpdateListing
