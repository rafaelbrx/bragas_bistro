import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Braga's Bistro & Burguer</h1>
      <Link to="/login">
        <button className="login-button">Ir para Login</button>
      </Link>
    </div>
  );
};

export default Home;