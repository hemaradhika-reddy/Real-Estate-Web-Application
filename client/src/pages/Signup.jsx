import React from 'react'
import {Link, useNavigate} from 'react-router-dom' 
import { useState } from 'react';
import OAuth from '../components/OAuth.jsx';
import { account } from '../appwrite.js';
import { ID } from 'appwrite';


const SignUp = () => {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(formData, "hari");
    

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
            await account.create(ID.unique(), formData.email, formData.password)
          } catch (error) {
            console.log(error);
            
          }

        //firebase
        setLoading(true);
        try {
            const res = await fetch('/server/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
    
            });
    
            const data = await res.json();

            if(data.success === false){
                
                setError(data.message);
                setLoading(false);
                return;
                
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');
               
            
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.log(error);
            
        }
        
        
    }

    console.log(formData);

    return (
        <div className='max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-lg p-8'>
        <h1 className='text-3xl font-semibold text-sky-700 p-4 text-center'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input 
                className="border border-gray-300 p-3 rounded-lg transition-all duration-300 hover:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none" 
                type='text' 
                placeholder='User Name' 
                id='username' 
                onChange={handleChange} 
            />
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
                {loading ? "Loading..." : "Sign Up"}
            </button>
            <OAuth/>
        </form>
    
        <div className='mt-3 flex justify-center gap-2 text-slate-700'>
            <p>Have an Account?</p>
            <span>
                <Link to='/sign-in' className='text-sky-600 hover:text-sky-700 transition-colors duration-300'>Sign In</Link>
            </span>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    
    )
}

export default SignUp
