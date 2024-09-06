import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import './App.css';

const AddMenuItem = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Função para buscar itens do menu
  const fetchMenuItems = async () => {
    const menuCollection = collection(db, 'menuItems');
    const menuSnapshot = await getDocs(menuCollection);
    const menuList = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMenuItems(menuList);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name && price) {
      try {
        if (editingItem) {
          // Atualiza o item existente
          const itemRef = doc(db, 'menuItems', editingItem.id);
          await updateDoc(itemRef, {
            name,
            price: parseFloat(price),
          });
          alert('Item atualizado com sucesso!');
        } else {
          // Adiciona um novo item
          await addDoc(collection(db, 'menuItems'), {
            name,
            price: parseFloat(price),
          });
          alert('Item adicionado com sucesso!');
        }

        setName('');
        setPrice('');
        setEditingItem(null);
        fetchMenuItems(); // Atualiza a lista de itens
      } catch (error) {
        console.error('Erro ao adicionar/atualizar item:', error);
        alert('Erro ao adicionar/atualizar item.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este item?');
    if (confirmDelete) {
      try {
        const itemRef = doc(db, 'menuItems', id);
        await deleteDoc(itemRef);
        alert('Item excluído com sucesso!');
        fetchMenuItems(); // Atualiza a lista de itens
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item.');
      }
    }
  };

  return (
    <div className="add-menu-item">
      <h2>{editingItem ? 'Editar Item do Menu' : 'Adicionar Item ao Menu'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Item:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preço:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingItem ? 'Atualizar Item' : 'Adicionar Item'}</button>
      </form>

      <h3>Itens Cadastrados</h3>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.name} - R${item.price.toFixed(2)}
            <button onClick={() => handleEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddMenuItem;