import { Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/HomePage/Homepage';
import ViewPost from './components/Posts/ViewPost';
import AddPost from './components/Posts/AddPost';
import UserList from './components/Users/UserList';
import EditUser from './components/Users/EditUser';
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
        <Route path="/post-detail/:id" element={<ViewPost/>} />
        <Route path='/add-post' element={<AddPost/>} />
        <Route path='/user-list/:id' element={<UserList/>} />
        <Route path='/edit-user/:id' element={<EditUser/>} />
      </Routes>
    </main>
    <footer></footer>
    </div>
  )
}

export default App;
