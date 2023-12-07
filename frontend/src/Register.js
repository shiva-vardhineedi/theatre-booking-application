import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const history = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'Member', // default value set to 'Member'
        membership_type: 'Regular' // default value set to 'Regular'
    });
    const [message, setMessage] = useState('');
    const numberOfSmc = 10;
    const rowHeight = 100 / numberOfSmc; // Divide the height of the container by the number of elements

  const smcStyles = [...Array(numberOfSmc)].map((_, index) => ({
    top: `${index * rowHeight}vh`,
    left: `${Math.random() * 80}vw`, // Start within the viewport width
    animationDelay: `${Math.random() * 2}s` // Shorter random delay
  }));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.membership_type === 'Premium') {
                console.log('entering premium features');
                history('/premium-features', { state: { formData } });
            }
            else
            {
            const response = await axios.post('http://localhost:5001/auth/register', formData);
            setMessage(`User registered with ID: ${response.data.user_id}`);
            }
        } catch (error) {
            setMessage(`Registration failed.: ${error}`);
        }
    };

    return (
        <div className="container">
            {smcStyles.map((style, index) => (
        <div key={index} className="smc-text" style={style}>SMC</div>
      ))}
      <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-field">
                    <label>First Name:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Membership Type:</label>
                    <select name="membership_type" value={formData.membership_type} onChange={handleChange}>
                        <option value="Regular">Regular</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>
                <div className="form-field">
                    <button type="submit" className={`submit-button ${formData.membership_type === 'Premium' ? 'premium' : ''}`}>
                        {formData.membership_type === 'Premium' ? 'Register for $15' : 'Register'}
                    </button>
                </div>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
        </div>
    );
};

export default Register;
