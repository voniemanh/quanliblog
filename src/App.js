import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/HomePage/Homepage';
import AddPost from './components/Posts/AddPost';
import UserList from './components/Users/UserList';
import Login from './components/Authen/Login';
import Register from './components/Authen/Register';
import Navbar from './components/NavBar/Navbar';    
import { useState, useEffect } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
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
      </Routes>
    </main>
    <footer></footer>
    </div>
  )
}

export default App;
