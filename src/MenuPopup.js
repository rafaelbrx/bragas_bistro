import React from 'react';
import './App.css';

const MenuPopup = ({ isOpen, menuItems, onClose, onSelectItem }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onClose}>
          Fechar
        </button>
        <h2>Selecione um item do menu</h2>
        <div className="menu-items">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-item"
              onClick={() => onSelectItem(item)}
            >
              <h4>{item.name}</h4>
              <p>R${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPopup;
