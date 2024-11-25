// Sales.js
import React, { useState, useRef, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import sales_status_icon from "./image/sales_satus_new.png";
import average_sales_icon from "./image/average_sales.svg";
import sales_distribution_icon from "./image/sales_distribution.svg";
import sales_details_icon from "./image/sales_details.svg";
import domain_img from "./images/chatseek.com.png";
import cust_img from "./images/cust_image.png";
import { FaCircle } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import delete_reset_icon from "./images/delete-reset-icon.png";
import { FaTimes } from "react-icons/fa";
import sort_icon from "./images/sort-icon.png";
import { HiDotsVertical } from "react-icons/hi";
import { ReactComponent as Sales_status_icon } from "./image/sales_status.svg";
import { ReactComponent as SortIcon } from "./image/sort.svg";
import unserialize from "locutus/php/var/unserialize";

const handleSubmit = (event) => {
  event.preventDefault();
  // Handle the input value submission here
};
const handleReset = () => {
  // Reset the input field
  const inputField = document.querySelector(`.${styles.offerInput}`);
  if (inputField) {
    inputField.value = "";
  }
};
// const currentUrl = window.location.origin;
const currentUrl = "https://new-webstarter.codepixelz.tech";
const Sales = ({ userData }) => {
  const [expanded, setExpanded] = useState({}); // Track which card is expanded
  const [selectedCard, setSelectedCard] = useState(null);

  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("active");
  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };
  // sunder js starts
  const [orderIds, setOrderIds] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [customerIds, setCustomerIds] = useState([]);

  // fetching order ids by seller id
  useEffect(() => {
    async function fetchOrderBysellerId() {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/sales-order/${userData.id}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        console.log(data);
        setOrderIds(data);
      } catch (err) {
        setError(err);
        // console.log(err);
      } finally {
      }
    }
    if (userData.id) {
      fetchOrderBysellerId();
    }
  }, [userData.id]);

  const [domainIds, setDomainIds] = useState([]);
  // Fetch all order details based on the order IDs
  useEffect(() => {
    if (orderIds.length > 0) {
      async function fetchAllOrderDetails() {
        try {
          const orderDetailsPromises = orderIds.map(async (orderId) => {
            const res = await fetch(
              `${currentUrl}/wp-json/wp/v2/domain_order/${orderId}`
            );
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message);
            }
            return res.json(); // Return the order data
          });

          const allOrderDetails = await Promise.all(orderDetailsPromises);
          setOrderDetails(allOrderDetails);

          // storing customer ids
          const customerIds = allOrderDetails.map((order) => {
            return order?.meta?._customer?.[0];
          });
          setCustomerIds(customerIds);

          const domainIds = allOrderDetails
            .map((order) => unserialize(order?.meta?._domain_ids?.[0])) // Get domain ids, which could be an array
            .flat(); // Flatten the resulting array of arrays

          setDomainIds(domainIds);
          console.log(domainIds);
        } catch (err) {
          setError(err.message);
        }
      }

      fetchAllOrderDetails();
    }
  }, [orderIds]);

  const [customerDetails, setCustomerDetails] = useState([]);
  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const customerDetailsPormises = customerIds.map(async (customerId) => {
          const res = await fetch(
            `${currentUrl}/wp-json/wstr/v1/user-profile/${customerId}`
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
          }
          return res.json(); // Return the order data
        });
        const allCustomerDetails = await Promise.all(customerDetailsPormises);
        setCustomerDetails(allCustomerDetails);
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
    if (customerIds.length >= 1) {
      fetchCustomerDetails();
    }
  }, [customerIds]);

  const [domainDetails, setDomainDetails] = useState([]);

  useEffect(() => {
    async function fetchDomainDetails() {
      try {
        const domainDetailsPromises = domainIds.map(async (domainId) => {
          const res = await fetch(
            `${currentUrl}/wp-json/wp/v2/domain/${domainId}`
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
          }
          return res.json(); // Return the order data
        });

        const allDomainDetails = await Promise.all(domainDetailsPromises);
        setDomainDetails(allDomainDetails);
        console.log(allDomainDetails);
      } catch (err) {
        setError(err.message);
      } finally {
      }
    }
    if (domainIds.length > 0) {
      fetchDomainDetails();
    }
  }, [domainIds]);

  if (error) {
    return <div>{error}</div>;
  }
  // sunder js ends
  return (
    <>
      {/* sales first col */}
      {/* {console.log(domainIds)} */}
      <div
        className={`${styles.sales_first_column_wrapper} ${styles.ws_flex} ${styles.gap_20} ${styles.fd_column}`}
      >
        <div>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={sales_status_icon}></img>

            <h4>Sales Status</h4>
            <HiDotsVertical />
          </div>
        </div>
        <div>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={sales_distribution_icon} alt="Media Setup Icon" />
            <h4>Sales Distribution</h4>
            <HiDotsVertical />
          </div>
        </div>
        <div>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={average_sales_icon} alt="Media Setup Icon" />
            <h4>Average Sales Analysis</h4>
            <HiDotsVertical />
          </div>
        </div>
      </div>
      {/* sales details section */}
      <div
        className={`${styles.offers_tab_recent_offer_wrap} ${styles.dashboard_sales_details} ${styles.dashboard_small_margin} `}
      >
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={sales_details_icon} alt="Media Setup Icon" />
          <h4>Sales Details</h4>
          <div className={styles.offerSorts}>
            {/* <img src={sort_icon}></img> */}
            <SortIcon />
            <label>Sort</label>
          </div>
        </div>
        <div className={styles.dashboard_small_margin}>
          <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
            {orderDetails.map((order, index) => (
              <div key={index} className={styles.recentOffers_wrapper}>
                {/* Offer card */}
                <div
                  className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                >
                  <div className={styles.recentOffers_card}>
                    <div className={styles.recentOffers_card_image}>
                      {customerDetails.find(
                        (customerDetail) =>
                          customerDetail?.id == order?.meta?._customer[0]
                      )?.user_image ? (
                        <img
                          src={
                            customerDetails.find(
                              (customerDetail) =>
                                customerDetail?.id == order?.meta?._customer[0]
                            )?.user_image
                          }
                          alt={
                            customerDetails.find(
                              (customerDetail) =>
                                customerDetail?.id == order?.meta?._customer[0]
                            )?.display_name
                          }
                        />
                      ) : (
                        <img src={cust_img} alt="Default Image" />
                      )}
                    </div>
                    <div className={styles.recentOffers_card_titles}>
                      <p>Customer</p>
                      <h5>
                        {" "}
                        {customerDetails.find(
                          (customerDetail) =>
                            customerDetail?.id == order?.meta?._customer[0]
                        )?.first_name +
                          " " +
                          customerDetails.find(
                            (customerDetail) =>
                              customerDetail?.id == order?.meta?._customer[0]
                          )?.last_name}
                      </h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      <p>Order ID</p>
                      <h6>{order?.id || ""}</h6>
                    </div>
                  </div>

                  <div className={styles.recentOffers_card}>
                    <div
                      className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                    >
                      <p className="online">Amount</p>
                      <h5>
                        {order?.meta?._currency_symbol?.[0] || ""}
                        {order?.meta?._order_total?.[0] || ""}
                      </h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      <p>Option</p>
                      <h6>One-time</h6>
                    </div>
                  </div>

                  <div
                    className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}
                  >
                    <div className={styles.recentOffers_card_titles}>
                      <p>Status</p>
                      <h5
                        className={`${styles.offer_status} ${styles.pending}`}
                      >
                        <FaCircle />
                        {order?.meta?._order_status?.[0] || ""}
                      </h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      <div className={styles.svg_wrapper_bg_grey}>
                        {expanded[index] ? (
                          <FaTimes onClick={() => toggleExpanded(index)} />
                        ) : (
                          <FaPlus onClick={() => toggleExpanded(index)} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content as a new column below */}
                <div
                  className={`${styles.extra_column_wrapper} ${expanded[index] ? styles.expanded : ""
                    }`}
                >
                  {/* test js starts  */}
                  {(() => {
                    // Unserialize the data from the order object (do this once)
                    const order_products_serialized = unserialize(
                      order?.meta?._domain_ids?.[0]
                    );

                    // Render the mapped elements
                    return (
                      <div>
                        {domainDetails.map((domainDetail) => {
                          const domainIdString = domainDetail?.id.toString();

                          if (
                            order_products_serialized.includes(domainIdString)
                          ) {
                            return (

                              <div className={styles.extra_column}>
                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_image}
                                  >
                                    <img src={domain_img} alt="Domain" />
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Product</p>
                                    <h5>{domainDetail?.title?.rendered}</h5>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Offer Amount</p>
                                    <h6>$5000</h6>
                                  </div>
                                </div>

                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Registrar</p>
                                    <h5>GoDaddy</h5>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Expiration Date</p>
                                    <h6>Dec 31, 2024</h6>
                                  </div>
                                </div>

                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Status</p>
                                    <h5
                                      className={`${styles.offer_status} ${styles.pending}`}
                                    >
                                      <FaCircle />
                                      {order?.meta?._order_status?.[0] || ""}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    );
                  })()}
                  {/* test js ends  */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sales;
