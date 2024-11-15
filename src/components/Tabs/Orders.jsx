import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import styles from "./Tabs.module.css"; // Import styles

export default function Orders({ userData }) {
  const currentUrl = "https://new-webstarter.codepixelz.tech/";
  // const currentUrl = window.location.origin;
  // return <div>Current URL is {location.pathname}</div>;
  const url = `${currentUrl}/wp-json/wstr/v1/orders/`;
  const order_url = `${currentUrl}/wp-json/wp/v2/domain_order/`;

  const [orderIds, setOrderIds] = useState([]);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState([]); // Store all order details
  const [modalOpen, setModalOpen] = useState(false); // Modal is initially closed
  const [selectedOrder, setSelectedOrder] = useState(null); // To track which order is selected
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order IDs through API based on the user's ID
  useEffect(() => {
    if (userData.id) {
      async function fetchOrderIds() {
        try {
          const res = await fetch(`${url}${userData.id}`);
          if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.message);
          } else {
            const data = await res.json();
            setOrderIds(data);
            setIsLoading(false);
          }
        } catch (err) {
          setError(err.message);
        }
      }

      fetchOrderIds();
    }
  }, [userData.id]);

  // Fetch all order details based on the order IDs
  useEffect(() => {
    if (orderIds.length > 0) {
      async function fetchAllOrderDetails() {
        try {
          const orderDetailsPromises = orderIds.map(async (orderId) => {
            const res = await fetch(`${order_url}${orderId}`);
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message);
            }
            return res.json(); // Return the order data
          });

          const allOrderDetails = await Promise.all(orderDetailsPromises);
          setOrderDetails(allOrderDetails);
        } catch (err) {
          setError(err.message);
        }
      }

      fetchAllOrderDetails();
    }
  }, [orderIds]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {!isLoading && (
        <div>
          <table className={styles.my_orders_table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {new Date(order.meta._date_created[0]).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td>{order.meta._order_status[0]}</td>
                  <td>
                    {order.meta._currency_symbol?.[0]}
                    {order.meta._order_total[0]}
                  </td>
                  <td>
                    <button
                      className={styles.hover_white}
                      onClick={() => {
                        setSelectedOrder(order); // Set the selected order
                        setModalOpen(true); // Open the modal
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Only show the OrderDetails component when modalOpen is true */}
      {modalOpen && (
        <OrderDetails
          order={selectedOrder}
          isModalOpen={modalOpen}
          setIsModalOpen={setModalOpen}
        />
      )}
    </div>
  );
}
