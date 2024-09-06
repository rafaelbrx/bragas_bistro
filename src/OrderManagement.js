import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import MenuPopup from './MenuPopup';
import './App.css';

const OrderManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    tableNumber: '',
    notes: '',
    discount: 0,
    takeout: false,
    items: [],
    total: 0,  // Adicionado campo para armazenar o total
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuCollection = collection(db, 'menuItems');
      const menuSnapshot = await getDocs(menuCollection);
      const menuList = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(menuList);
    };

    fetchMenuItems();
  }, []);

  const handleSelectMenuItem = (item) => {
    if (!newOrder.items.includes(item)) {
      setSelectedItems([...selectedItems, item]);
      setNewOrder({
        ...newOrder,
        items: [...(newOrder.items || []), item],
      });
    }
    setIsPopupOpen(false);
  };

  const calculateTotal = () => {
    const itemsTotal = newOrder.items.reduce((total, item) => total + item.price, 0);
    const discountAmount = itemsTotal * (newOrder.discount / 100);
    const serviceFee = (itemsTotal - discountAmount) * 0.10;
    const packagingCharge = newOrder.takeout ? 2.00 : 0;
    return (itemsTotal - discountAmount) + serviceFee + packagingCharge;
  };

  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setNewOrder({ ...newOrder, discount: value });
  };

  const handleSubmit = () => {
    if (!newOrder.customerName || !newOrder.tableNumber || newOrder.items.length === 0) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    
    // Calcula o total no momento da submissão
    const orderTotal = calculateTotal();

    // Adiciona o total ao newOrder e reseta o formulário
    setOrders([...orders, { ...newOrder, total: orderTotal }]);
    setNewOrder({
      customerName: '',
      tableNumber: '',
      notes: '',
      discount: 0,
      takeout: false,
      items: [],
      total: 0,  // Resetando o total
    });
    setSelectedItems([]);
    setError('');
  };

  const handleEditOrder = (index) => {
    setNewOrder(orders[index]);
    setOrders(orders.filter((_, i) => i !== index));
  };

  const handleDeleteOrder = (index) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  const handleUpdateOrder = async (index) => {
    const orderToUpdate = orders[index]; // Pegue a comanda correspondente
  
    try {
      // Verifica se a comanda tem um id, se não tiver, crie um novo documento
      const orderRef = orderToUpdate.id 
        ? doc(db, 'orders', orderToUpdate.id) 
        : doc(collection(db, 'orders'));
  
      // Atualiza ou adiciona a comanda no Firestore
      await setDoc(orderRef, { ...orderToUpdate, id: orderRef.id });
  
      alert('Comanda enviada/atualizada com sucesso!');
    } catch (error) {
      alert(`Erro ao enviar/atualizar a comanda: ${error.message}`);
    }
  };  

  return (
    <div className="order-management-container">
      <h2>Gerenciamento de Pedidos</h2>
      <div className="new-order-form">
        <div>
          <label>Nome da Pessoa: <font color="red">*</font> </label>
          <input
            type="text"
            value={newOrder.customerName}
            onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Número da Mesa: <font color="red">*</font></label>
          <input
            type="text"
            value={newOrder.tableNumber}
            onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Pedidos: <font color="red">*</font></label>
          <button onClick={() => setIsPopupOpen(true)}>Adicionar Pedido</button>
          <ul>
            {newOrder.items.map((item, index) => (
              <li key={index}>{item.name} - R${item.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>
        <div>
          <label>Observações:</label>
          <input
            type="text"
            value={newOrder.notes}
            onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
          />
        </div>
        <div>
          <label>Desconto (%):</label>
          <input
            type="number"
            value={newOrder.discount}
            onChange={handleDiscountChange}
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={newOrder.takeout}
              onChange={(e) => setNewOrder({ ...newOrder, takeout: e.target.checked })}
            />
            Para viagem? (cobrar embalagem)
          </label>
        </div>
        <div>
          <strong>Total: R${calculateTotal().toFixed(2)}</strong>
        </div>
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Enviar Pedido</button>
      </div>

      <div className="orders-list">
        {orders.map((order, index) => (
          <div className="order-card" key={index}>
            <h3>Comanda #{index + 1}</h3>
            <p>Nome: {order.customerName}</p>
            <p>Mesa: {order.tableNumber}</p>
            <p>Pedidos:</p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>{item.name} - R${item.price.toFixed(2)}</li>
              ))}
            </ul>
            <p>Observações: {order.notes}</p>
            <p>Desconto: {order.discount}%</p>
            <p>Para viagem: {order.takeout ? 'Sim' : 'Não'}</p>
            <p><strong>Total: R${order.total.toFixed(2)}</strong></p> {/* Usa o total armazenado */}
            <button onClick={() => handleEditOrder(index)}>Editar</button>
            <button onClick={() => handleDeleteOrder(index)}>Excluir</button>
            <button onClick={() => handleUpdateOrder(index)}>Atualizar Comanda</button>
          </div>
        ))}
      </div>

      <MenuPopup
        isOpen={isPopupOpen}
        menuItems={menuItems}
        onClose={() => setIsPopupOpen(false)}
        onSelectItem={handleSelectMenuItem}
      />
    </div>
  );
};

export default OrderManagement;