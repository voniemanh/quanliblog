import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { USER_URL } from '../../config';
import './Authen.css';
import '../../App.css';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ nickname: '', password: '' });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const { nickname, password } = newUser;
    if (!nickname || !password) {
    alert("Vui lòng nhập đầy đủ các trường");
    return;
  }
    axios.post(USER_URL, newUser)
      .then(response => {
        alert("User registered successfully");
        navigate('/login');
      })
      .catch(error => {
        alert("There was an error registering the user!");
      });
  };

  return (
    <div className='content-center'>
      <h1>Register</h1>
      <div>
        <input type="text" name="nickname" placeholder="Nickname" value={newUser.nickname} onChange={handleChange} />
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleChange} />
      </div>
      <button onClick={handleRegister}>Register</button>
      <button><Link to="/login">Login</Link></button>
    </div>
  );
}

export default Register;
