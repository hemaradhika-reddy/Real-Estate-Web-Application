import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase.js'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {

            const provider  = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/server/auth/google", {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
                
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/")

            
        } catch (error) {
            
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' 
    className='bg-blue-200 p-3 rounded-lg uppercase hover:opacity-80'>
        Continue with Google
    </button>
  )
}

export default OAuth
