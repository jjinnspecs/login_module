// SignupForm.tsx
import React, { useState} from 'react';
import axios from 'axios';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
}

const Signup: React.FC = () => {
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
  });

  //client side notification 
  const [isSubmitted, setIsSubmitted] = useState(false); // track form for submission state
  const [errorMessage, setErrorMessage] = useState(''); // error message state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.firstName || !user.lastName || !user.phoneNumber || !user.email || !user.username || !user.password) {
      setErrorMessage('Please fill in all fields.');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return; 
    }

    try {
      const response = await axios.post('http://localhost:3002/api/signup', user);
      console.log('User registered successfully:', response.data);

      setIsSubmitted(true);
      //reset isSubmitted after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false); 
      }, 3000); 
      // Handle successful registration (e.g., redirect to login page)
    }  catch (error) {
      const axiosError = error as {
          response?: {
              status?: number;
              data?: { message?: string };
          };
          
      };

      if (axiosError.response?.status === 400) {
        setErrorMessage('Bad Request. Please check your input.');
        setTimeout(() => {
          setErrorMessage(''); 
        }, 2000);
      } else if (axiosError.response?.status === 409) {
        if (axiosError.response?.data?.message?.includes('username')) {
          setErrorMessage('Username already exists.');
        } else if (axiosError.response?.data?.message?.includes('email')) {
          setErrorMessage('Email already exists.');
        } else if (axiosError.response?.data?.message?.includes('phone')) { 
          setErrorMessage('Phone number already exists.');
        } else {
          setErrorMessage('Username/Email/Phone already exists.'); 
        }
        setTimeout(() => { 
          setErrorMessage(''); 
        }, 2000); 
      } else if (axiosError.response?.status === 500) {
        setErrorMessage('Internal Server Error. Please Try again later.');
        setTimeout(() => {
          setErrorMessage(''); 
        }, 2000); 
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('An error occured. Please try again.');
        setTimeout(() => {
          setErrorMessage(''); 
        }, 2000);
      }
     } 
  };


  return (
    <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="firstName">First Name:</label>
        <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          value={user.firstName} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          value={user.lastName} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          name="phoneNumber" 
          value={user.phoneNumber} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={user.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Signup</button>
      {isSubmitted && <div className="success">Account created successfully!</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </form>
  );
};

export default Signup;