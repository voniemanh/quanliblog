import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/HomePage/Homepage';
import AddPost from './components/Posts/AddPost';
import UserList from './components/Users/UserList';
import Login from './components/Authen/Login';
import Register from './components/Authen/Register';
import Navbar from './components/NavBar/Navbar';
import EditProfile from './components/Users/EditProfile';    
import { useState, useEffect } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  return(
    <div className="App">
    <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    <main>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
         <Route path="/add-post" element={<AddPost currentUser={currentUser} />} />
        <Route path='/user-list' element={<UserList/>} />
        <Route path='/edit-profile/:id' element={<EditProfile setCurrentUser={setCurrentUser}/>} />
      </Routes>
    </main>
    <footer></footer>
    </div>
  )
}

export default App;
