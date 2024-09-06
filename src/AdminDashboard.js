import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (error) {
        setError("Erro ao buscar as comandas.");
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      setSuccess("Comanda excluída com sucesso.");
    } catch (error) {
      setError("Erro ao excluir a comanda.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="card-container">
        <div className="card" onClick={() => navigate("/admin/registerUser")}>
          <h3>Registrar Novo Usuário</h3>
          <p>Clique para adicionar um novo usuário ao sistema.</p>
        </div>
        <div
          className="card-menu-item"
          onClick={() => navigate("/admin/add-menu-item")}
        >
          <h3>Registrar Novos Itens</h3>
          <p>Clique para adicionar novos itens ao cardápio.</p>
        </div>
      </div>

      <h3>Lista de Comandas</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <ul>
        {orders.length === 0 ? (
          <p>Nenhuma comanda enviada ainda.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <h4>Mesa {order.tableNumber}</h4>
              <p>Nome: {order.customerName}</p>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - R${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Pedidos: Nenhum pedido</p>
              )}

              <p>Observações: {order.notes}</p>
              <p>Desconto: {order.discount}%</p>
              <p>Para viagem: {order.takeout ? "Sim" : "Não"}</p>
              <p>
                <strong>Total: R${order.total.toFixed(2)}</strong>
              </p>
              <button onClick={() => handleDeleteOrder(order.id)}>Excluir Comanda</button>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
