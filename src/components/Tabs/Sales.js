// Sales.js
import React, { useState, useRef, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import sales_status_icon from "./image/sales_satus_new.png";
import average_sales_icon from "./image/average_sales.svg";
import sales_distribution_icon from "./image/sales_distribution.svg";
import sales_details_icon from "./image/sales_details.svg";
import domain_img from "./images/chatseek.com.png";
import cust_img from "./images/cust_image.png";
import { FaCircle, FaSpinner } from "react-icons/fa6";
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
const currentUrl = window.location.origin;
// const currentUrl = "https://new-webstarter.codepixelz.tech";
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
        setLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/sales-order/${userData.id}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        setOrderIds(data);
      } catch (err) {
        setError(err);
        // console.log(err);
      } finally {
        setLoading(false);
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

          // getting order products id with seller id
          const orderProducts = allOrderDetails.map((order) =>
            unserialize(order?.meta?._ordered_products?.[0])
          );

          // matching products id by seller id and current user id

          // Flatten the orderProducts array and filter the matching products
          const matchingProductIds = orderProducts
            .flat() // Flatten the nested arrays into a single array
            .filter((product) => product.seller_id === userData.id) // Filter products with matching seller_id
            .map((product) => product.product_id); // Extract the product_id of matching products

          setDomainIds(matchingProductIds);
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
  const [domainNames, setDomainNames] = useState([]);
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

        const domain_names = allDomainDetails.map((domainDetails) => {
          return domainDetails?.title?.rendered;
        });
        setDomainNames(domain_names);
      } catch (err) {
        setError(err.message);
      } finally {
      }
    }
    if (domainIds.length > 0) {
      fetchDomainDetails();
    }
  }, [domainIds]);

  // fetching domain registar details
  const [registarDetails, setRegistartDetails] = useState([]);
  const [registarLoading, setRegistarLoading] = useState(false);
  // useEffect(() => {
  //   async function fetchRegistar() {
  //     try {
  //       const domainRegistarPromises = domainNames.map(async (domainName) => {
  //         const res = await fetch(
  //           `${currentUrl}/wp-json/wstr/v1/domain-registar/${domainName}`
  //         );
  //         if (!res.ok) {
  //           const errorData = await res.json();
  //           throw new Error(errorData.message);
  //         }
  //         return res.json(); // Return the order data
  //       });

  //       const allDomainsRegistar = await Promise.all(domainRegistarPromises);
  //       setRegistartDetails(allDomainsRegistar);
  //       console.log(allDomainsRegistar);
  //       // setDomainDetails(allDomainDetails);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setRegistarLoading(false);
  //     }
  //   }
  //   if (domainNames.length > 0) {
  //     fetchRegistar();
  //   }
  // }, [domainNames]);

  if (loading) {
    return (
      <div>
        <div className="loading_overlay">
          <FaSpinner className="loading" />
        </div>
      </div>
    );
  }
  if (orderIds.length == 0) {
    return <div>Sales order is empty.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  // sunder js ends
  return (
    <>
      {/* sales first col */}
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
            {orderDetails.map((order, index) => {
              // Extract the customer ID from the order
              const customerId = order?.meta?._customer[0];

              // Find the customer details once
              const customer = customerDetails.find(
                (customerDetail) => customerDetail?.id == customerId
              );

              // Extract customer properties safely
              const userImage = customer?.user_image || cust_img;
              const displayName = customer?.display_name || "Default Name";
              const firstName = customer?.first_name || "Unknown";
              const lastName = customer?.last_name || "";

              // calculating total starts
              const ordered_products = unserialize(
                order?.meta?._ordered_products?.[0]
              );

              const NotSellerProducts = ordered_products.filter(
                (product) => product.seller_id != userData.id
              );

              const allOrderdProductPrice = unserialize(
                order?.meta?._products_price?.[0]
              );

              const sellerProductsOrderdPrice = allOrderdProductPrice.filter(
                (product) =>
                  NotSellerProducts.some(
                    (sellerProduct) =>
                      sellerProduct.product_id == product.product_id
                  )
              );

              // Calculate the total price
              const totalSellerProductPrice = sellerProductsOrderdPrice.reduce(
                (sum, product) => sum + parseFloat(product.price || 0), // Safely parse price as float and add
                0 // Initial sum value
              );

              const overall_total = order?.meta?._order_total?.[0] || "";
              const total = totalSellerProductPrice
                ? overall_total - totalSellerProductPrice
                : overall_total;

              // calculating total ends

              return (
                <div key={index} className={styles.recentOffers_wrapper}>
                  {/* Offer card */}
                  <div
                    className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                  >
                    <div className={styles.recentOffers_card}>
                      <div className={styles.recentOffers_card_image}>
                        <img src={userImage} alt={displayName} />
                      </div>
                      <div className={styles.recentOffers_card_titles}>
                        <p>Customer</p>
                        <h5>{`${firstName} ${lastName}`}</h5>
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
                          {order?.meta?._currency_symbol?.[0] || "$"}
                          {/* {order?.meta?._order_total?.[0] || ""}
                           */}
                          {total}
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
                    className={`${styles.extra_column_wrapper} ${
                      expanded[index] ? styles.expanded : ""
                    }`}
                  >
                    {/* test js starts  */}
                    {(() => {
                      // Unserialize the data from the order object (do this once)
                      const order_products_serialized = unserialize(
                        order?.meta?._domain_ids?.[0]
                      );

                      const order_products_price = unserialize(
                        order?.meta?._products_price[0]
                      );

                      // Render the mapped elements
                      return (
                        <div>
                          {domainDetails.map((domainDetail) => {
                            const domainIdString = domainDetail?.id.toString();

                            const order_product_price =
                              order_products_price.filter(
                                (order) => order.product_id === domainIdString
                              );

                            const order_product_registar =
                              registarDetails.filter(
                                (register) =>
                                  register.domain_name ==
                                  domainDetail?.title?.rendered
                              );
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
                                      className={
                                        styles.recentOffers_card_titles
                                      }
                                    >
                                      <p>Product</p>
                                      <h5>{domainDetail?.title?.rendered}</h5>
                                    </div>
                                    <div
                                      className={
                                        styles.recentOffers_card_details
                                      }
                                    >
                                      <p>Offer Amount</p>
                                      <h6>
                                        {order?.meta?._currency_symbol?.[0]}
                                        {order_product_price?.[0]?.price}
                                      </h6>
                                    </div>
                                  </div>

                                  <div className={styles.recentOffers_card}>
                                    <div
                                      className={
                                        styles.recentOffers_card_titles
                                      }
                                    >
                                      <p>Registrar</p>
                                      <h5>
                                        {registarLoading && (
                                          <div>
                                            <div className="loading_overlay">
                                              <FaSpinner className="loading" />
                                            </div>
                                          </div>
                                        )}
                                        {order_product_registar[0]?.whois_name}
                                      </h5>
                                    </div>
                                    <div
                                      className={
                                        styles.recentOffers_card_details
                                      }
                                    >
                                      <p>Expiration Date</p>
                                      <h6>
                                        {registarLoading && (
                                          <div>
                                            <div className="loading_overlay">
                                              <FaSpinner className="loading" />
                                            </div>
                                          </div>
                                        )}
                                        {
                                          order_product_registar[0]
                                            ?.date_expires
                                        }
                                      </h6>
                                    </div>
                                  </div>

                                  <div className={styles.recentOffers_card}>
                                    <div
                                      className={
                                        styles.recentOffers_card_titles
                                      }
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sales;
