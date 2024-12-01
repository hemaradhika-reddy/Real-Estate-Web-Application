import React from 'react'
import {Link, useNavigate} from 'react-router-dom' 
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';
import { account } from '../appwrite.js';
import { ID } from 'appwrite';


const SignIn = () => {
    const [formData, setFormData] = useState({});
    const {currentUser, loading, error} = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        //appwrite


        try {
          var x = await account.createEmailPasswordSession(formData.email, formData.password);
          console.log(x);
          
          
      } catch (error) {
          console.log(error);
          
      }

        

        

        try {
            dispatch(signInStart());
            const res = await fetch("/server/auth/signin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
              dispatch(signInFailure(data.message));
              return;
            }
            dispatch(signInSuccess(data));
            navigate("/");
          } catch (error) {
            dispatch(signInFailure(error.message));
          }
        
    }

    console.log(formData);

    return (
      <div className='max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-lg p-8'>
      <h1 className='text-3xl font-semibold text-sky-700 p-4 text-center'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input 
              className="border border-gray-300 p-3 rounded-lg transition-all duration-300 hover:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none" 
              type='text' 
              placeholder='Email ID' 
              id="email" 
              onChange={handleChange}
          />
          <input 
              className="border border-gray-300 p-3 rounded-lg transition-all duration-300 hover:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none" 
              type='password' 
              placeholder='Password' 
              id='password' 
              onChange={handleChange}
          />
          <button 
              disabled={loading} 
              className={`p-3 rounded-lg uppercase text-white transition-all duration-300 ${loading ? 'bg-sky-300' : 'bg-sky-600 hover:bg-sky-700 hover:scale-105'} disabled:opacity-85`}>
              {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth/>
      </form>
  
      <div className='mt-3 gap-2 flex justify-center text-slate-700'>
          <p>Don't have an Account?</p> 
          <span>
              <Link to='/sign-up' className='text-sky-600 hover:text-sky-700 transition-colors duration-300'>Sign Up</Link>
          </span>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
  </div>
  
    )
}

export default SignIn
