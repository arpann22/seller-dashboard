import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import styles from "./Tabs.module.css"; // Import styles
import cust_img from "./images/cust_image.png";
import { FaCircle } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { ReactComponent as MyOrderIcon } from "./image/orders.svg";
import { ReactComponent as OrderAccepted } from "./image/order_accepted.svg";
import { ReactComponent as OrderCancelled } from "./image/order_cancelled.svg";
import { ReactComponent as OrderPending } from "./image/order_pending.svg";
// import { IoCloseOutline } from "react-icons/io5";

export default function Orders({ userData }) {
  // const currentUrl = "https://new-webstarter.codepixelz.tech";
  const currentUrl = window.location.origin;
  // return <div>Current URL is {location.pathname}</div>;
  const url = `${currentUrl}/wp-json/wstr/v1/orders/`;
  const order_url = `${currentUrl}/wp-json/wp/v2/domain_order/`;

  const [orderIds, setOrderIds] = useState([]);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState([]); // Store all order details
  const [modalOpen, setModalOpen] = useState(false); // Modal is initially closed
  const [selectedOrder, setSelectedOrder] = useState(null); // To track which order is selected
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch order IDs through API based on the user's ID
  async function fetchOrderIds() {
    try {
      setIsLoading(true);
      const res = await fetch(`${url}${userData.id}`);
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
      } else {
        const data = await res.json();
        setOrderIds(data);
        // setIsLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

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
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (userData.id) {
      fetchOrderIds();
    }
  }, [userData.id]);

  // Fetch all order details based on the order IDs
  useEffect(() => {
    if (orderIds.length > 0) {
      fetchAllOrderDetails();
    } else {
      setIsLoading(false);
    }
  }, [orderIds]);

  const [subscriptionSuccess, setSubscriptionSuccess] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const [subscriptionId, setSubscriptionId] = useState(0);
  const [subsPopup, setSubsPopup] = useState(false);

  const handleCancelSubscription = async () => {
    setSubsPopup(false);
    setSubscriptionSuccess("");
    setSubscriptionError("");
    // console.log(subscription_id);
    const cancel_subscription_url = `${currentUrl}/wp-json/wstr/v1/cancel-subscription/`;
    const cancel_data = {
      subscription_id: subscriptionId,
    };
    try {
      setSubscriptionLoading(true);
      const res = await fetch(cancel_subscription_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancel_data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setSubscriptionError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setSubscriptionSuccess(data.message || "Order cancelled.");
        // Refresh order data
        await refreshOrderData();
      }
    } catch (error) {
      setSubscriptionError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setSubscriptionLoading(false);
    }
  };
  const refreshOrderData = async () => {
    try {
      setIsLoading(true);
      await fetchOrderIds();
      await fetchAllOrderDetails();
    } catch (err) {
      setError(err.message);
    }
  };

  function handleSubsPopup(subscription_id) {
    setSubscriptionId(subscription_id);
    setSubsPopup(true);
  }

  if (error) {
    return (
      <div
        className={`${styles.sellers_error_wrapper} ${styles.order_error_msg_wrapper}`}
      >
        <div className={`${styles.sellers_error} ${styles.order_error_msg}`}>
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading_overlay">
        <FaSpinner className="loading" />
      </div>
    );
  }

  const OrderSubscriptionCancelPopup = () => {
    return (
      <div className={styles.success_popup_overlay}>
        <div className={styles.success_popup}>
          <div>
            <p>Are you sure want to cancel order?</p>
          </div>
          <div>
            <input
              type="submit"
              value="Ok"
              onClick={handleCancelSubscription}
              className={`${styles.okButton} ${styles.hover_blue_white}`}
            />
          </div>
        </div>
      </div>
    );
  };

  // Filter orders based on status
  const pendingOrders = orderDetails.filter(
    (order) =>
      order.meta._order_status[0] === "pending" ||
      order.meta._order_status[0] === "processing" ||
      order.meta._order_status[0] === "onhold"
  );

  const completedOrders = orderDetails.filter(
    (order) => order.meta._order_status[0] === "completed"
  );

  const cancelledOrders = orderDetails.filter(
    (order) =>
      order.meta._order_status[0] === "cancelled" ||
      order.meta._order_status[0] === "refunded"
  );

  const renderOrders = (orders) => {
    return orders.map((order) => {
      let orderStatus = order?.meta?._order_status[0]
        ? order.meta._order_status[0]
        : "";
      let orderStatusClass = "";
      if (
        orderStatus === "pending" ||
        orderStatus === "processing" ||
        orderStatus === "onhold"
      ) {
        orderStatusClass = "pending";
      } else if (orderStatus === "cancelled" || orderStatus === "refunded") {
        orderStatusClass = "cancelled";
      } else if (orderStatus === "completed") {
        orderStatusClass = "completed";
      }

      return (
        <div
          key={order.id}
          className={styles.recentOffers_wrapper}
          id={order?.meta && !order.meta._parent_order_id ? order.id : ""}
        >
          <div className={styles.recentOffers_card}>
            {/* Group Order and Date */}
            <div className={styles.recentOffers_card_titles}>
              <p>Order</p>
              <h5>{order.id}</h5>
              {order?.meta?._parent_order_id ? (
                <>
                  <small className={styles.parentID_orders}>
                    <a href={`#${order.meta._parent_order_id}`}>
                      {"("}
                      {order.meta._parent_order_id}
                      {")"}
                    </a>
                  </small>
                </>
              ) : (
                ""
              )}
            </div>

            <div className={styles.recentOffers_card_titles}>
              <p>Date</p>
              <h5>
                {new Date(order.meta._date_created[0]).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </h5>
            </div>

            {/* Group Status, Type, Total, and View */}
            <div className={styles.recentOffers_card_titles}>
              <p>Type</p>
              <h5
                className={`${styles.offer_status} ${order?.meta?._order_type?.[0]}`}
              >
                {(() => {
                  if (order?.meta?._order_type?.[0]) {
                    if (order.meta._order_type[0] === "offer") {
                      return "Offer";
                    } else if (order.meta._order_type[0] === "lease_to_own") {
                      return "Lease To Own";
                    } else if (order.meta._order_type[0] === "one_time") {
                      return "One Time";
                    }
                  }
                })()}
              </h5>
            </div>
            <div className={styles.recentOffers_card_titles}>
              <p>Status</p>
              <h5 className={`${styles.offer_status} ${orderStatusClass}`}>
                {order.meta._order_status[0]}
              </h5>
            </div>
            <div className={styles.recentOffers_card_titles}>
              <p>Total</p>
              <h5>
                {order.meta._currency_symbol?.[0]}
                {order.meta._order_total[0]}
              </h5>
            </div>
            <div
              className={`${styles.ws_flex} ${styles.gap_5} ${styles.orderTable_btn_wrapper}`}
            >
              <div className={styles.recentOffers_card_titles}>
                <button
                  className={styles.hover_white}
                  onClick={() => {
                    setSelectedOrder(order);
                    setModalOpen(true);
                  }}
                >
                  View
                </button>
              </div>

              {(() => {
                const order_type = order?.meta?._order_type?.[0];
                const subscription_id = order?.meta?._subscription_id?.[0];
                const parent_order_id = order?.meta?._parent_order_id?.[0];
                const cancelled = order?.meta?._cancelled?.[0];
                if (
                  order_type == "lease_to_own" &&
                  !parent_order_id &&
                  cancelled == 0 &&
                  order?.meta?._order_status !== "cancelled" &&
                  order?.meta?._order_status !== "refunded"
                ) {
                  return (
                    <div className={styles.recentOffers_card_titles}>
                      <button
                        className={styles.myOrder_cancel_btn}
                        onClick={() => {
                          handleSubsPopup(subscription_id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.myOrders_container}>
      <div
        className={`${styles.salesOverViewTitle} ${styles.myOrders_title} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                          } myOffersTitle`}
      >
        <div className={styles.ws_flex}>
          <MyOrderIcon />
        </div>
        <h4>My Orders</h4>
      </div>
      {subsPopup && <OrderSubscriptionCancelPopup />}
      {!isLoading && (
        <div className={styles.order_tabs_wrapper}>
          {/* Nav tabs */}
          <div
            className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.gap_10} ${styles.dashboard_small_margin}`}
          >
            <ul
              className={`${styles.nav_tabs} ${styles.offer_tabs_navs} ${styles.order_tabs_navs}`}
            >
              <li
                className={`${activeTab === "pending" ? styles.active : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                <div className={styles.svg_wrapper_bg_white}>
                  <OrderPending />
                </div>
                <label> Pending</label>
                <span className={`${styles.card_count} card_count`}>
                  {pendingOrders.length}
                </span>
              </li>
              <li
                className={`${activeTab === "completed" ? styles.active : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                <div className={styles.svg_wrapper_bg_white}>
                  <OrderAccepted />
                </div>
                <label>Completed</label>
                <span className={`${styles.card_count} card_count`}>
                  {completedOrders.length}
                </span>
              </li>
              <li
                className={`${
                  activeTab === "cancelled" ? styles.active : ""
                } my_offer_accepted_tab`}
                onClick={() => setActiveTab("cancelled")}
              >
                <div className={styles.svg_wrapper_bg_white}>
                  <OrderCancelled />
                </div>
                <label>Cancelled</label>
                <span className={`${styles.card_count} card_count`}>
                  {cancelledOrders.length}
                </span>
              </li>
            </ul>
          </div>

          {/* Render orders based on active tab */}
          {activeTab === "pending" && (
            <div
              className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.my_orders_details_table} my_orders_details_table`}
            >
              {subscriptionLoading && (
                <div>
                  <div className="loading_overlay">
                    <FaSpinner className="loading" />
                  </div>
                </div>
              )}
              {subscriptionSuccess && (
                <div className="success_msg">{subscriptionSuccess}</div>
              )}
              {subscriptionError && (
                <div className="refunded">{subscriptionError}</div>
              )}
              {pendingOrders.length === 0 ? (
                <div className={styles.dash_error_wrap}>
                  <div className={styles.order_error_msg}>
                    <p>No pending orders yet!</p>
                  </div>
                </div>
              ) : (
                renderOrders(pendingOrders)
              )}
            </div>
          )}

          {activeTab === "completed" && (
            <div
              className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.my_orders_details_table} my_orders_details_table`}
            >
              {subscriptionLoading && (
                <div>
                  <div className="loading_overlay">
                    <FaSpinner className="loading" />
                  </div>
                </div>
              )}
              {subscriptionSuccess && (
                <div className="success_msg">{subscriptionSuccess}</div>
              )}
              {subscriptionError && (
                <div className="refunded">{subscriptionError}</div>
              )}
              {completedOrders.length === 0 ? (
                <div className={styles.dash_error_wrap}>
                  <div className={styles.order_error_msg}>
                    <p>No completed orders yet!</p>
                  </div>
                </div>
              ) : (
                renderOrders(completedOrders)
              )}
            </div>
          )}

          {activeTab === "cancelled" && (
            <div
              className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.my_orders_details_table} my_orders_details_table`}
            >
              {subscriptionLoading && (
                <div>
                  <div className="loading_overlay">
                    <FaSpinner className="loading" />
                  </div>
                </div>
              )}
              {subscriptionSuccess && (
                <div className="success_msg">{subscriptionSuccess}</div>
              )}
              {subscriptionError && (
                <div className="refunded">{subscriptionError}</div>
              )}
              {cancelledOrders.length === 0 ? (
                <div className={styles.dash_error_wrap}>
                  <div className={styles.order_error_msg}>
                    <p>No cancelled orders yet!</p>
                  </div>
                </div>
              ) : (
                renderOrders(cancelledOrders)
              )}
            </div>
          )}
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
