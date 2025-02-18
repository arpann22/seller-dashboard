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

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { BarChart } from "@mui/x-charts/BarChart";

import { colors } from "@mui/material";
import date from "locutus/php/datetime/date";

const currentUrl = window.location.origin;
// const currentUrl = "https://webstarter.com/";

// progress bar sales stattus
const ProgressBar = ({
  value,
  max,
  color,
  backgroundColor,
  label,
  imgSrc,
  altText,
  plus,
}) => {
  const progressPercentage = (value / max) * 100;

  return (
    <>
      {/* <div className={styles.progressBarWrapper}>
        <img src={imgSrc} alt={altText} className={styles.progressImage} />
        <input
          type="range"
          max={max}
          value={value}
          disabled
          className={styles.progressBar}
          style={{
            background: `linear-gradient(
            to right,
            ${color} ${progressPercentage}%,
            ${backgroundColor} ${progressPercentage}%
          )`,
          }}
        />
        <p>{label}</p>
      </div> */}
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFilled}
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: color,
            }}
          >
            {imgSrc && (
              <div className={styles.remaining_customers_progressBar}>
                <img
                  src={imgSrc}
                  alt={altText}
                  className={styles.progressImage}
                />
                {plus && <span>+{plus}</span>}
              </div>
            )}
          </div>
        </div>
        <p>{label}</p>
      </div>
    </>
  );
};

// sales distribution tabs

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
const Sales = ({
  userData,
  currentMonthCompletedSales,
  currentYearCompletedSales,
  AllTimeCompletedSales,
}) => {
  // sales distribution tabs starts

  const [selectedTab, setSelectedTab] = useState("This Month");
  const [AverageSelectedTab, setAverageSelectedTab] = useState("This Year");
  const [oneTime, setOneTime] = useState(0);
  const [leaseToOwn, setLeaseToOwn] = useState(0);
  const [offer, setOffer] = useState(0);
  const [distributionTotal, setDistributionTotal] = useState(0);

  const [salesDistributionEmptyMsg, setSalesDistributionEmptyMsg] = useState();
  const timePeriodTabs = [
    {
      label: "This Month",
      title: "Pie Chart for This Month",
      data: [
        { value: oneTime, label: "One Time", color: "#197EFC" },
        { value: leaseToOwn, label: "Lease-to-Own", color: "#00d9f5" },
        { value: offer, label: "Offers", color: "#084FAE" },
      ],
    },
    {
      label: "This Year",
      title: "Pie Chart for This Year",
      data: [
        { value: oneTime, label: "One Time", color: "#197EFC" },
        { value: leaseToOwn, label: "Lease-to-Own", color: "#00d9f5" },
        { value: offer, label: "Offers", color: "#084FAE" },
      ],
    },
    {
      label: "All Time",
      title: "Pie Chart for All the Time",
      data: [
        { value: oneTime, label: "One Time", color: "#197EFC" },
        { value: leaseToOwn, label: "Lease-to-Own", color: "#00d9f5" },
        { value: offer, label: "Offers", color: "#084FAE" },
      ],
    },
  ];

  const AverageTimePeriodTabs = [
    {
      label: "This Year",
      title: "Bar Graph for This Month",
    },
    // {
    //   label: "All the time",
    //   title: "Bar Graph for All Time",
    // },
  ];

  useEffect(() => {
    function fetchSalesDistribution() {
      if (selectedTab == "This Month") {
        if (currentMonthCompletedSales.length > 0) {
          const oneTime = currentMonthCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "one_time"
          );
          const leaseToOwn = currentMonthCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "lease_to_own"
          );
          const offer = currentMonthCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "offer"
          );

          setOneTime(oneTime ? oneTime.length : 0);
          setLeaseToOwn(leaseToOwn ? leaseToOwn.length : 0);
          setOffer(offer ? offer.length : 0);
          setDistributionTotal(currentMonthCompletedSales.length);
          setSalesDistributionEmptyMsg();
        } else {
          setOneTime(0);
          setLeaseToOwn(0);
          setOffer(0);
          setDistributionTotal(0);
          setSalesDistributionEmptyMsg("No sales found.");
        }
      }
      if (selectedTab == "This Year") {
        if (currentYearCompletedSales.length > 0) {
          const oneTime = currentYearCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "one_time"
          );
          const leaseToOwn = currentYearCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "lease_to_own"
          );
          const offer = currentYearCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "offer"
          );
          setOneTime(oneTime ? oneTime.length : 0);
          setLeaseToOwn(leaseToOwn ? leaseToOwn.length : 0);
          setOffer(offer ? offer.length : 0);
          setDistributionTotal(currentYearCompletedSales.length);
          setSalesDistributionEmptyMsg();
        } else {
          setOneTime(0);
          setLeaseToOwn(0);
          setOffer(0);
          setDistributionTotal(0);
          setSalesDistributionEmptyMsg("No sales found.");
        }
      }
      if (selectedTab == "All the Time") {
        if (AllTimeCompletedSales.length > 0) {
          const oneTime = AllTimeCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "one_time"
          );
          const leaseToOwn = AllTimeCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "lease_to_own"
          );
          const offer = AllTimeCompletedSales.filter(
            (order) => order?.meta?._order_type?.[0] == "offer"
          );
          setOneTime(oneTime ? oneTime.length : 0);
          setLeaseToOwn(leaseToOwn ? leaseToOwn.length : 0);
          setOffer(offer ? offer.length : 0);
          setDistributionTotal(AllTimeCompletedSales.length);
          setSalesDistributionEmptyMsg();
        } else {
          setOneTime(0);
          setLeaseToOwn(0);
          setOffer(0);
          setDistributionTotal(0);
          setSalesDistributionEmptyMsg("No sales found.");
        }
      }
      // currentMonthSales, currentYearSales, AllTimeSales
    }
    fetchSalesDistribution();
  }, [selectedTab]);

  const handleTabClick = (tabLabel) => {
    setSelectedTab(tabLabel);
  };
  const AveragehandleTabClick = (tabLabel) => {
    setAverageSelectedTab(tabLabel);
  };

  const selectedTabData = timePeriodTabs.find(
    (tab) => tab.label === selectedTab
  );
  const AverageSelectedTabData = timePeriodTabs.find(
    (tab) => tab.label === selectedTab
  );

  //   const data = [
  //     { id: 0, value: oneTime
  // leaseToOwn
  // offersoneTime, label: "one-time" },
  //     { id: 1, value: oneTime
  // leaseToOwn
  // offersleaseToOwn, label: "lease-to-own" },
  //     { id: 2, value: oneTime
  // leaseToOwn
  // offersoffers, label: "offers" },
  //   ];
  // const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
  const TOTAL = distributionTotal;

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return percent > 0 ? `${(percent * 100).toFixed(1)}%` : "";
    // return `${(percent * 100).toFixed(0)}%`;
  };

  //  sales distribution tabs ends

  // const getArcLabel = (data) => `${data.label}: ${data.value}%`; // Static arc label function

  // Average sales analysis starts

  const xLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // const uData = ;
  const [uData, setUdata] = useState([]);
  useEffect(() => {
    function getCurrentYearSales() {
      //

      // const currentYear = AllTimeCompletedSales.filter();
      const currentYear = new Date().getFullYear();
      // Filter orders created in the current year
      const currentYearOrders = AllTimeCompletedSales.filter((order) => {
        const dateCreated = order?.meta?._date_created?.[0]; // Access the date_created field
        if (!dateCreated) return false;

        const orderYear = new Date(dateCreated).getFullYear();
        return orderYear === currentYear; // Check if the order's year matches the current year
      });

      // ------------------------------------------------------------------ test starts

      // const sold_products = currentYearOrders.map((order) => {
      //   return unserialize(order?.meta?._ordered_products?.[0]);
      // });

      // const NotSellerProducts = ordered_products.filter(
      //   (product) => product.seller_id != userData.id
      // );

      // const allOrderdProductPrice = unserialize(
      //   order?.meta?._products_price?.[0]
      // );

      // const sellerProductsOrderdPrice = allOrderdProductPrice.filter(
      //   (product) =>
      //     NotSellerProducts.some(
      //       (sellerProduct) => sellerProduct.product_id == product.product_id
      //     )
      // );

      // // Calculate the total price
      // const totalSellerProductPrice = sellerProductsOrderdPrice.reduce(
      //   (sum, product) => sum + parseFloat(product.price || 0), // Safely parse price as float and add
      //   0 // Initial sum value
      // );

      // const overall_total = order?.meta?._order_total?.[0] || "";
      // const total = totalSellerProductPrice
      //   ? overall_total - totalSellerProductPrice
      //   : overall_total;

      // ------------------------------------------------------------------ test ends

      const monthlySales = Array(12).fill(0); // Initialize 12 months with 0
      if (currentYearOrders.length > 0) {
        currentYearOrders.forEach((order) => {
          //----------------------------------------- test starts

          const currency = order?.meta?._currency?.[0];

          const sold_products = unserialize(
            order?.meta?._ordered_products?.[0]
          );
          let sold_products_price = [];
          if (currency != "USD") {
            sold_products_price = unserialize(
              order?.meta?._products_price?.[0]
            );
          } else {
            sold_products_price = unserialize(
              order?.meta?._usd_products_price?.[0]
            );
          }

          // const otherSellerProducts = sold_products.filter(
          //   (product) => product.seller_id != userData.id
          // );

          // // get product of the other seller from order data
          // const otherSellerProductsOrderdPrice = sold_products_price.filter(
          //   (product) =>
          //     otherSellerProducts.some(
          //       (sellerProduct) =>
          //         sellerProduct.product_id == product.product_id
          //     )
          // );

          // Ensure sold_products is an array, otherwise set it to an empty array
          const sold_products_array = Array.isArray(sold_products)
            ? sold_products
            : [];

          const otherSellerProducts = sold_products_array.filter(
            (product) => product.seller_id != userData.id
          );

          // Ensure sold_products_price is an array, otherwise set it to an empty array
          const sold_products_price_array = Array.isArray(sold_products_price)
            ? sold_products_price
            : [];

          // get product of the other seller from order data
          const otherSellerProductsOrderdPrice =
            sold_products_price_array.filter((product) =>
              otherSellerProducts.some(
                (sellerProduct) =>
                  sellerProduct.product_id == product.product_id
              )
            );

          //----------------------------------------- test ends

          const dateCreated = order?.meta?._date_created?.[0];
          const orderMonth = new Date(dateCreated).getMonth(); // Get month (0-indexed)

          // Determine the order total based on currency
          const isUSD = order?.meta?._currency?.[0] === "USD";
          const orderTotal = isUSD
            ? order?.meta?._order_total?.[0] || 0
            : order?.meta?._usd_order_total?.[0] || 0;

          let excludeOtherSellerProductPrice = orderTotal;
          if (otherSellerProductsOrderdPrice.length > 0) {
            otherSellerProductsOrderdPrice.forEach((product) => {
              excludeOtherSellerProductPrice -= product.price; // Subtracting each product price from the total
            });
          }
          // Add to the respective month's total
          monthlySales[orderMonth] += excludeOtherSellerProductPrice;
        });
      }

      if (monthlySales.length > 0) {
        setUdata(monthlySales);
      }
    }
    if (AllTimeCompletedSales.length > 0) {
      getCurrentYearSales();
    }
    // AllTimeCompletedSales
  }, [AllTimeCompletedSales]);
  // Average sales analysis ends

  // Common pie chart configuration
  // const sizing = { height: 300, width: 300 };

  // sales tab end

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
      } finally {
        setLoading(false);
      }
    }
    if (userData.id) {
      fetchOrderBysellerId();
    }
  }, []);

  const [domainIds, setDomainIds] = useState([]);

  const [sortValue, setSortValue] = useState("");
  const [isReversed, setIsReversed] = useState(true); // Track the reversal state

  function handleSort() {
    setIsReversed(!isReversed);
    const sortedOffers = [...orderDetails].sort((a, b) => {
      if (a.id > b.id) return isReversed ? 1 : -1;
      if (a.id < b.id) return isReversed ? -1 : 1;
      return 0;
    });
    setOrderDetails(sortedOffers);
  }

  const [pendingOrders, setPendingOrders] = useState(0);
  const [progressOrders, setProgressOrders] = useState(0);
  const [paidOrders, setPaidOrders] = useState();
  // Fetch all order details based on the order IDs

  const [pendingOrdersCustomersId, setPendingOrdersCustomersId] = useState([]);
  const [progressOrdersCustomersId, setProgressOrdersCustomersId] = useState(
    []
  );
  const [paidOrdersCustomersId, setPaidOrdersCustomersId] = useState([]);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);

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

          // if (sortValue) {
          //   allOrderDetails.reverse();
          // }
          setOrderDetails(allOrderDetails);

          const pendingOrders = allOrderDetails.filter(
            (order) => order?.meta?._order_status?.[0] == "pending"
          );
          // const pendingImage = pendingOrders.map((order)=> )
          // const pendingOrderCustomerIds = pendingOrders.map();

          const progressOrder = allOrderDetails.filter(
            (order) => order?.meta?._order_status?.[0] == "progress"
          );

          const paidOrders = allOrderDetails.filter(
            (order) => order?.meta?._order_status?.[0] == "completed"
          );

          setPendingOrders(pendingOrders);
          setProgressOrders(progressOrder);
          setPaidOrders(paidOrders);

          // storing customer ids
          const customerIds = allOrderDetails.map((order) => {
            return order?.meta?._customer?.[0];
          });
          setCustomerIds(customerIds);

          if (customerIds) {
            const pendingOrdersCustomersId = customerIds.filter((customer) =>
              pendingOrders.some(
                (order) => order?.meta?._customer?.[0] === customer
              )
            );

            const progressOrdersCustomersId = customerIds.filter((customer) =>
              progressOrder.some(
                (order) => order?.meta?._customer?.[0] === customer
              )
            );

            const paidOrdersCustomersId = customerIds.filter((customer) =>
              paidOrders.some(
                (order) => order?.meta?._customer?.[0] === customer
              )
            );
            setPendingOrdersCustomersId(pendingOrdersCustomersId);
            setProgressOrdersCustomersId(progressOrdersCustomersId);
            setPaidOrdersCustomersId(paidOrdersCustomersId);
          }
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
    // }, [orderIds, sortValue]);
  }, [orderIds]);

  const [customerDetails, setCustomerDetails] = useState([]);
  const [progressImage, setProgressImage] = useState("");
  const [pendingImage, setPendingImage] = useState("");
  const [paidImage, setPaidImage] = useState("");
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

        if (pendingOrdersCustomersId.length > 0) {
          // Find the first matching customer from allCustomerDetails
          const matchedCustomer = allCustomerDetails.find((customer) =>
            pendingOrdersCustomersId.includes(customer.id)
          );

          // Extract the image URL (assuming there’s an image property)
          const customerImage = matchedCustomer?.user_image || null;
          setPendingImage(customerImage);
        }
        if (progressOrdersCustomersId.length > 0) {
          // Find the first matching customer from allCustomerDetails
          const matchedCustomer = allCustomerDetails.find((customer) =>
            progressOrdersCustomersId.includes(customer.id)
          );

          // Extract the image URL (assuming there’s an image property)
          const customerImage = matchedCustomer?.user_image || null;
          setProgressImage(customerImage);
        }
        if (paidOrdersCustomersId.length > 0) {
          // Find the first matching customer from allCustomerDetails
          const matchedCustomer = allCustomerDetails.find((customer) =>
            paidOrdersCustomersId.includes(customer.id)
          );

          // Extract the image URL (assuming there’s an image property)
          const customerImage = matchedCustomer?.user_image || null;
          setPaidImage(customerImage);
        }
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
  useEffect(() => {
    async function fetchRegistar() {
      try {
        const domainRegistarPromises = domainNames.map(async (domainName) => {
          const res = await fetch(
            `${currentUrl}/wp-json/wstr/v1/domain-registar/${domainName}`
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
          }
          return res.json(); // Return the order data
        });

        const allDomainsRegistar = await Promise.all(domainRegistarPromises);
        setRegistartDetails(allDomainsRegistar);

        // setDomainDetails(allDomainDetails);
      } catch (err) {
        console.log(err);
      } finally {
        setRegistarLoading(false);
      }
    }
    if (domainNames.length > 0) {
      fetchRegistar();
    }
  }, [domainNames]);

  // notifications redirect starts
  useEffect(() => {
    // Execute only after the page fully loads
    const url = new URL(window.location.href);
    const handleScrollToHash = () => {
      // Scroll to the specific order ID if hash is present
      if (url.hash) {
        const elementId = url.hash.substring(1); // Remove the "#" to get the ID
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Highlight the element
          element.classList.add("notification-highlight");

          // Remove the highlight after a delay
          setTimeout(() => {
            element.classList.remove("notification-highlight");
          }, 5000); // Highlight duration in milliseconds
        }
      }
    };

    if (orderDetails.length > 0 && url.href.indexOf("order") > -1) {
      handleScrollToHash();
    }
  }, [orderDetails]);
  // notifications redirect ends

  const sizing = {
    // margin: { right: 5 },
    // width: 400,
    height: 280,
    // legend: { hidden: false },
    legend: {
      direction: "row",
      position: { vertical: "bottom", horizontal: "middle" },
      labelStyle: {
        fontSize: 12,
        fill: "#67748e",
      },
      itemMarkWidth: 7,
      itemMarkHeight: 7,
      markGap: 8,
      itemGap: 20,
    },
  };

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
    return (
      <div
        className={`${styles.sellers_error_wrapper} ${styles.order_error_msg_wrapper}`}
      >
        <div className={`${styles.sellers_error} ${styles.order_error_msg}`}>
          Sales order is empty.
        </div>
      </div>
    );
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
  // sunder js ends
  return (
    <>
      {/* sales first col */}
      <div
        className={`${styles.sales_first_column_wrapper} ${styles.ws_flex} ${styles.gap_30} ${styles.fd_column}`}
      >
        <div className={styles.sales_first_column_card}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={sales_status_icon}></img>

            <h4>Sales Status</h4>
            {/* <HiDotsVertical /> */}
          </div>
          {/* <div className={styles.progressBars}>
            <ProgressBar
              value={1}
              max={10}
              color="#7ba2fc"
              backgroundColor="#f5f7fd"
              label="1 in progress"
              imgSrc={cust_img}
              altText="In progress"
            />
            <ProgressBar
              value={5}
              max={10}
              color="#99eef9"
              backgroundColor="#f2fdff"
              label="5 pending"
              imgSrc={cust_img}
              altText="Pending"
            />
            <ProgressBar
              value={10}
              max={10}
              color="#91edbb"
              backgroundColor="#e5faf4"
              label="10 paid"
              imgSrc={cust_img}
              altText="Paid"
            />
          </div> */}

          <div className={styles.progressBars}>
            <ProgressBar
              value={progressOrders ? progressOrders.length : 0}
              max={orderDetails ? orderDetails.length : 0}
              color="#7ba2fc"
              label={
                progressOrders
                  ? `${progressOrders.length} in progress`
                  : "0 in progress"
              }
              imgSrc={
                progressOrders && progressOrders.length > 0 ? progressImage : ""
              }
              altText="In progress"
              plus={
                progressOrders && progressOrders.length > 1
                  ? progressOrders.length - 1
                  : ""
              }
            />
            <ProgressBar
              value={pendingOrders ? pendingOrders.length : 0}
              max={orderDetails ? orderDetails.length : 0}
              color="#99eef9"
              label={
                pendingOrders ? `${pendingOrders.length} pending` : "0 pending"
              }
              imgSrc={
                pendingOrders && pendingOrders.length > 0 ? pendingImage : ""
              }
              altText="Pending"
              plus={
                pendingOrders && pendingOrders.length > 1
                  ? pendingOrders.length - 1
                  : ""
              }
            />
            <ProgressBar
              value={paidOrders ? paidOrders.length : 0}
              max={orderDetails ? orderDetails.length : 0}
              color="#91edbb"
              label={paidOrders ? `${paidOrders.length} paid` : "0 paid"}
              imgSrc={paidOrders && paidOrders.length > 0 ? paidImage : ""}
              altText="Paid"
              plus={
                paidOrders && paidOrders.length > 1 ? paidOrders.length - 1 : ""
              }
            />
          </div>
        </div>
        <div className={styles.sales_first_column_card}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={sales_distribution_icon} alt="Media Setup Icon" />
            <h4>Sales Distribution</h4>
            {/* <HiDotsVertical /> */}
          </div>
          <div className={styles.sales_distribution_chart_wrapper}>
            {/* Tab Buttons */}
            <div className={styles.sales_distribution_tab_labels}>
              {timePeriodTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => handleTabClick(tab.label)}
                  className={`${styles.tabButton} ${
                    selectedTab === tab.label ? styles.active : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Static PieChart for the Selected Tab */}
            <div className={styles.sales_graph_svg}>
              {salesDistributionEmptyMsg ? (
                <p>{salesDistributionEmptyMsg}</p>
              ) : (
                <PieChart
                  margin={{ top: 100, bottom: 120 }}
                  series={[
                    {
                      outerRadius: 80,
                      data: selectedTabData?.data,
                      arcLabel: getArcLabel,
                      cx: 120,
                      cy: 0,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontSize: 12,
                    },
                  }}
                  {...sizing}
                />
              )}
            </div>
          </div>
          <div className={styles.sales_graph_svg}>
            {/* <PieChart
              series={[
                {
                  outerRadius: 80,
                  data,
                  arcLabel: getArcLabel,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontSize: 14,
                },
              }}
              {...sizing}
            /> */}
          </div>
        </div>
        <div className={styles.sales_first_column_card}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={average_sales_icon} alt="Media Setup Icon" />
            <h4>Average Sales Analysis</h4>
            {/* <HiDotsVertical /> */}
          </div>
          <div className={styles.AverageSalestabsWrapper}>
            {/* Tab Buttons */}
            <div className={styles.sales_distribution_tab_labels}>
              {AverageTimePeriodTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => AveragehandleTabClick(tab.label)}
                  className={`${styles.tabButton} ${
                    AverageSelectedTab === tab.label ? styles.active : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.AverageSalesTabsContent}>
              {/* {AverageSelectedTab === "This Year" && ( */}
              <div>
                {/* <h2>{AverageTimePeriodTabs[0].title}</h2> */}
                {/* <p>Content for "This Year" goes here.</p> */}
                {/* <ChartContainer
                    width={500}
                    height={300}
                    series={[{ data: uData, label: "uv", type: "bar" }]}
                    // xAxis={[{ scaleType: "band", data: xLabels }]}
                    xAxis={[{ scaleType: "band", data: xLabels }]}
                  >
                    <BarPlot />
                  </ChartContainer> */}
                {/* for desktop */}
                <div className={styles.hide_mobile}>
                  <div style={{ position: "relative" }}>
                    {/* SVG Definitions for Custom Gradients */}
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id="customGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="rgb(33,100,255)" />
                          <stop offset="41%" stopColor="rgb(17,159,251)" />
                          <stop offset="100%" stopColor="rgb(17,159,251)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: xLabels,
                          grid: false, // Disable grid lines for x-axis
                        },
                      ]}
                      series={[
                        {
                          data: uData
                            ? uData
                            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Data points
                          color: "url(#customGradient)", // Use the custom gradient
                        },
                      ]}
                      width={600}
                      height={300}
                    />
                  </div>
                </div>
                <div className={styles.hide_desktop}>
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient
                        id="customGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="rgb(33,100,255)" />
                        <stop offset="41%" stopColor="rgb(17,159,251)" />
                        <stop offset="100%" stopColor="rgb(17,159,251)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* for mobile */}
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: xLabels,
                      },
                    ]}
                    series={[
                      {
                        data: uData
                          ? uData
                          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Data points
                        color: "url(#customGradient)", // Use the custom gradient
                      },
                    ]}
                    width={320}
                    height={300}
                  />
                </div>
              </div>
              {/* // )} */}
              {/* // {AverageSelectedTab === "All the time" && ( */}
              {/* //   <div>
              //     <h2>{AverageTimePeriodTabs[1].title}</h2>
              //     <p>Content for "All the time" goes here.</p>
              //   </div> */}
              {/* // )} */}
            </div>
          </div>
        </div>
      </div>
      {/* sales details section */}
      <div
        className={`${styles.offers_tab_recent_offer_wrap} ${styles.dashboard_sales_details} ${styles.dashboard_small_margin} `}
        id="sales-details"
      >
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={sales_details_icon} alt="Media Setup Icon" />
          <h4>Sales Details</h4>
          <div className={styles.offerSorts} onClick={handleSort}>
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

              // const NotSellerProducts = ordered_products.filter(
              //   (product) => product.seller_id != userData.id
              // );

              // const allOrderdProductPrice = unserialize(
              //   order?.meta?._products_price?.[0]
              // );

              // const sellerProductsOrderdPrice = allOrderdProductPrice.filter(
              //   (product) =>
              //     NotSellerProducts.some(
              //       (sellerProduct) =>
              //         sellerProduct.product_id == product.product_id
              //     )
              // );

              // Ensure ordered_products is an array before calling .filter
              const NotSellerProducts = Array.isArray(ordered_products)
                ? ordered_products.filter(
                    (product) => product.seller_id != userData.id
                  )
                : [];

              // Ensure allOrderdProductPrice is an array before calling .filter
              const allOrderdProductPrice = Array.isArray(
                unserialize(order?.meta?._products_price?.[0])
              )
                ? unserialize(order?.meta?._products_price?.[0])
                : [];

              // Ensure NotSellerProducts is an array before using it in .some
              const sellerProductsOrderdPrice = allOrderdProductPrice.filter(
                (product) =>
                  Array.isArray(NotSellerProducts) &&
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
                <div
                  key={index}
                  className={styles.recentOffers_wrapper}
                  id={`order-${order?.id}`}
                >
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
                        <div
                          className={`${styles.svg_wrapper_bg_grey} ${
                            expanded[index]
                              ? styles.icon_close_wrapper
                              : styles.icon_add_wrapper
                          }`}
                          onClick={() => toggleExpanded(index)}
                        >
                          {expanded[index] ? <FaTimes /> : <FaPlus />}
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

                      const ordered_currency =
                        order?.meta?._currency_symbol?.[0];
                      let order_products_price;
                      if (ordered_currency == "USD") {
                        order_products_price = unserialize(
                          order?.meta?._usd_products_price?.[0]
                        );
                      } else {
                        order_products_price = unserialize(
                          order?.meta?._products_price?.[0]
                        );
                      }

                      // Render the mapped elements
                      return (
                        <div>
                          {domainDetails.map((domainDetail) => {
                            const domainIdString = domainDetail?.id.toString();

                            // const order_product_price =
                            //   order_products_price.filter(
                            //     (order) => order.product_id === domainIdString
                            //   );

                            const order_product_price = Array.isArray(
                              order_products_price
                            )
                              ? order_products_price.filter(
                                  (order) => order.product_id === domainIdString
                                )
                              : [];

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
