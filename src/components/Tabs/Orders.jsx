import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";

export default function Orders({ userData }) {
  const url = "http://webstarter.local/wp-json/wstr/v1/orders/";
  const order_url = "http://webstarter.local/wp-json/wp/v2/domain_order/";

  const [orderIds, setOrderIds] = useState([]);
  const [error, setError] = useState("");

  const [orderDetails, setOrderDetails] = useState([]); // for order details

  const [modalOpen, setModalOpen] = useState(true); // for modal open

  const [getOrder, setOrder] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  //    for fetching order ids through api
  useEffect(() => {
    if (userData.id) {
      async function fetchOrderIds() {
        try {
          const res = await fetch(`${url}` + userData.id);
          if (!res.ok) {
            const errorData = await res.json();
            // console.log(errorData.message);
            setError(errorData.message);
          } else {
            const data = await res.json();
            setOrderIds(data);
            setIsLoading(false);
          }
        } catch (err) {
          //   console.log(err.message);
          //   console.log("err" + err);
          setError(err.message);
        }
        //   console.log(data);
      }

      fetchOrderIds();
    }
  }, [userData.id]);

  useEffect(() => {
    if (orderIds.length > 0) {
      async function fetchAllOrderDetails() {
        try {
          // Map all order ID fetches into promises
          const orderDetailsPromises = orderIds.map(async (orderId) => {
            const res = await fetch(`${order_url}` + orderId);
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message);
            }
            return res.json(); // return the order data
          });

          // Wait for all promises to resolve
          const allOrderDetails = await Promise.all(orderDetailsPromises);

          // Set all order details at once
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
          <table>
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
                <tr>
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
                  <td>{order.meta._order_total[0]}</td>
                  <td>
                    <button
                      onClick={() => {
                        setOrder(order);
                        setModalOpen(false);
                      }}
                    >
                      view{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!modalOpen && <OrderDetails order={getOrder} />}
    </div>
  );
}
