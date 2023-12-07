import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // You can create a corresponding CSS file for styling
import { useAuth } from './AuthContext';


const Login = () => {

    const { setIsAuthenticated, setUserId } = useAuth();
    const numberOfSmc = 10;
    const rowHeight = 100 / numberOfSmc; // Divide the height of the container by the number of elements

  const smcStyles = [...Array(numberOfSmc)].map((_, index) => ({
    top: `${index * rowHeight}vh`,
    left: `${Math.random() * 80}vw`, // Start within the viewport width
    animationDelay: `${Math.random() * 2}s` // Shorter random delay
  }));

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const history = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/auth/login', formData);
            if (response.data.token) {

                 // Store the received JWT token in local storage for further authenticated requests
                 localStorage.setItem('token', response.data.token);
                  localStorage.setItem('role', response.data.user.role);  // Store user role
                  localStorage.setItem('user_id', response.data.user.user_id);
                  setIsAuthenticated(true);
                  setUserId(response.data.user.user_id); 
                  setMessage('Login successful! Redirecting...');
                console.log('user id is ', response.data.user.user_id);
                //landing page and pass user_id as a state

                if (response.data.user.role === 'Admin') {
                  setTimeout(() => { history('/AdminMovie') }, 3000);
              } else {
                setTimeout(() => { history('/landing', { state: { user_id: response.data.user.user_id } }) }, 3000);
              }
                 
                
            } else {
              setMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setMessage(`Login error: ${error}`);
        }
    };

    return (
      <div className="container h-100 d-flex align-items-center justify-content-center">
     {smcStyles.map((style, index) => (
        <div key={index} className="smc-text" style={style}>SMC</div>
      ))}
      <div className="login-container shadow-lg p-5 bg-white rounded animated fadeIn">    
            <h2 className="mb-4">Login to SMC Movies</h2>
            <form onSubmit={handleSubmit} className="w-100">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            {message && <p className={`message ${message.data && message.data.token ? 'success' : 'error'}`}>{message}</p>}
        </div>
      </div>
      );
};

export default Login;
