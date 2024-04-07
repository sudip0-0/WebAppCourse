import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem("user")) {
      navigate("/dashboard");
    }

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`https://localhost:7296/api/User/login`, {
        email: email,
        password: password,
      });

      const data = await response.data;

      if (data.token) {
        setFailedAttempts(0);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', email);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        setFailedAttempts(prevAttempts => prevAttempts + 1);
        toast.error(`Failed authentication attempts: ${failedAttempts}`);
      }
    } catch (error) {
      setFailedAttempts(prevAttempts => prevAttempts + 1);
      toast.error(`An error occurred. Please try again. Failed attempts: ${failedAttempts}`);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">Login</button>
          <button type="button" className="btn btn-secondary" onClick={handleSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
