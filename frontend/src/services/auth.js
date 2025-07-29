import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data) => {
  setLoading(true);
  setError(null);
  console.log('Login data:', data);
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, data, {
      withCredentials: true
    });

    const userdata = res?.data?.data?.user;
    const statusCode = res?.data?.statusCode;
    const token = res?.data?.token;

    if (statusCode === 200) {
      console.log('✅Login successful:');
      console.log('token data:', token);
      setUser(userdata);
      toast.success('Login successful! 🎉');
      navigate("/");
      localStorage.setItem('user', JSON.stringify(userdata));
      localStorage.setItem('token', token);

    } else {
      console.error('Login failed:', res?.data);
      toast.error(res?.data?.message || 'Login failed');
      return;
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    console.error('Login error:', err);
    toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const signup = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/signup`, data, {
        withCredentials: true,
      });

      if (response.status === 201) {
        console.log('User data:', response.data.user);
        setUser(response.data.user);
        toast.success('✅Signup successful! 🎉');
      } else {
        console.error('❌Signup failed:', response.data.message);
        setError(response.data.message || 'Signup failed');
        toast.error(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getAllUsers = async() =>{
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/userdetails`);
      console.log("data", res.data.data)
      setUsersData(res?.data?.data?.users);
    } catch (error) {
      console.log("Error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, getAllUsers, usersData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};