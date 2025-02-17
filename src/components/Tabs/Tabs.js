import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.css";
import UserDetails from "./UserDetails";
import TabContent from "./TabContent";
import SellerCentralTabContent from "./SellerCentralTabContent";
import AccountSettingIcon from "./image/settings.svg";
import logoutIcon from "./image/logout.svg";
import { TiArrowSortedDown } from "react-icons/ti";
import { ReactComponent as MyOrderIcon } from "./image/orders.svg";
import { ReactComponent as MyOfferIcon } from "./image/offers.svg";
import { ReactComponent as EditProfileIcon } from "./image/edit_profil.svg";
import { ReactComponent as AddDomainsIcon } from "./image/plus.svg";
import { ReactComponent as DashboardIcon } from "./image/dashboard.svg";
import { ReactComponent as SalesIcon } from "./image/sales-menu.svg";
import { ReactComponent as DomainsIcon } from "./image/domains.svg";
import { ReactComponent as ManageOffersIcon } from "./image/manage_offers.svg";
import { ReactComponent as WalletIcon } from "./image/wallet.svg";
import { ReactComponent as StarsIcon } from "./image/ai-stars.svg";
import { ReactComponent as BecomeSellerIcon } from "./image/seller.svg";
import unserialize from "locutus/php/var/unserialize";
const logoutUrl = "/wp-login.php?action=logout&redirect_to=/login";

const currentUrl = window.location.origin;
//const currentUrl = window.location.origin;

const Tabs = ({ userData, setUserData }) => {
  // Main tabs and seller central tabs
  const user_roles = userData.roles;
  // const [userTab, setUserTab] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  useEffect(() => {
    const updateUserTabs = () => {};

    if (userData) {
      updateUserTabs();
    }
  }, [userData]);
  const [tabs, setTabs] = useState([]);
  const defaultTabs = () => {
    let userTab = null;
    if (userData && userData.roles) {
      const roles = Array.isArray(userData.roles)
        ? userData.roles
        : Object.values(userData.roles);
      if (
        roles.includes("seller") ||
        roles.includes("administrator") ||
        roles == "seller" ||
        roles == "administrator"
      ) {
        userTab = {
          label: "Sellers Central",
          icon: <EditProfileIcon />,
          urlParam: "sellers-central",
        };
      } else {
        userTab = {
          label: "Become a Seller",
          icon: <BecomeSellerIcon />,
          urlParam: "become-seller",
        };
      }
    }
    return [
      { label: "My Orders", icon: <MyOrderIcon />, urlParam: "my-orders" },
      { label: "My Offers", icon: <MyOfferIcon />, urlParam: "my-offers" },
      userTab ? userTab : "",
      {
        label: "Account Settings",
        icon: (
          <img
            src={AccountSettingIcon}
            alt="Account Settings Icon"
            style={{ width: "20px" }}
          />
        ),
        urlParam: "account-settings",
      },
    ];
  };
  // Initialize tabs on load
  useEffect(() => {
    setTabs(defaultTabs());
  }, [userData]);

  // Refresh tabs function
  const refreshTabs = () => {
    setTabs(defaultTabs());
  };

  // Update activeTab when tabs are set
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0].label); // Safely set activeTab
    }
  }, [tabs]);

  const sellerCentralTabs = [
    {
      label: "Add New Domain",
      icon: <AddDomainsIcon />,
      image: <StarsIcon />,
      content: "Add New Domain content.",
    },
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      content: "Dashboard content.",
    },
    { label: "Sales", icon: <SalesIcon />, content: "Sales content." },
    { label: "Domains", icon: <DomainsIcon />, content: "Domains content." },
    {
      label: "Manage Offers",
      icon: <ManageOffersIcon />,
      content: "Manage Offers content.",
    },
    {
      label: "Wallet/Banking",
      icon: <WalletIcon />,
      content: "Wallet/Banking content.",
    },
  ];

  const [sellerCentralTab, setSellerCentralTab] = useState(
    sellerCentralTabs[0].label
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown open state

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle tab change
  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab.urlParam);
    window.history.pushState({}, "", `?${params.toString()}`);
    localStorage.removeItem("editable_domain_id");
  };

  // Handle seller central tab change
  const handleSellerCentralTab = (tabLabel) => {
    setSellerCentralTab(tabLabel);
    localStorage.removeItem("editable_domain_id");
  };

  // Sync URL parameter with active tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const matchedTab = tabs.find((tab) => tab.urlParam === tabParam);
    if (matchedTab) setActiveTab(matchedTab.label);
  }, [tabs]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  //----------------------------------------------------------- sales details starts

  const [soldDomains, setSoldDomains] = useState([]);

  // fetching order ids by seller id
  useEffect(() => {
    async function fetchOrderBysellerId() {
      try {
        // setLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/sales-order/${userData.id}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();

        setSoldDomains(data);
      } catch (err) {
        // setError(err);
        console.log(err);
      } finally {
        // setLoading(false);
      }
    }
    if (userData.id) {
      fetchOrderBysellerId();
    }
  }, [userData.id]);

  // Fetch all order details based on the order IDs
  const [orderDetails, setOrderDetails] = useState([]);
  const [salesCurrentYear, setSalesCurrentYear] = useState(0);
  const [salesAllTime, setSalesAllTime] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
  const [lastThreeMonthsOrders, setLastThreeMonthsOrders] = useState([]);
  const [currentYearOrders, setCurrentYearOrders] = useState([]);
  const [fiveYearOrders, setFiveYearOrders] = useState([]);

  useEffect(() => {
    if (soldDomains.length > 0) {
      async function fetchAllOrderDetails() {
        try {
          const orderDetailsPromises = soldDomains.map(async (orderId) => {
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

          const allCompletedOrders = allOrderDetails.filter(
            (order) => order?.meta?._order_status?.[0] == "completed"
          );
          setOrderDetails(allCompletedOrders);

          // const currentYear = new Date().getFullYear();

          const current_month = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          const currentDate = new Date();

          // -------------orders for sales chart in sale overview starts

          const currentMonthOrders = allCompletedOrders.filter((order) => {
            const dateCreated = order?.meta?._date_created?.[0];
            if (!dateCreated) return false; // Skip if dateCreated is not available

            const orderDate = new Date(dateCreated);
            const orderMonth = orderDate.getMonth() + 1; // Months are 0-based
            const orderYear = orderDate.getFullYear(); // Get the year

            // Check if order is from the current month and year
            return orderMonth === current_month && orderYear === currentYear;
          });

          setCurrentMonthOrders(currentMonthOrders);

          // Last 3 Months
          const lastThreeMonthsDate = new Date(
            currentYear,
            currentDate.getMonth() - 2,
            1
          ); // Start of 3 months ago

          const lastThreeMonthsOrders = allCompletedOrders.filter((order) => {
            const dateCreated = order?.meta?._date_created?.[0];
            if (!dateCreated) return false;
            const orderDate = new Date(dateCreated);
            return orderDate >= lastThreeMonthsDate; // Check if order date is within last 3 months
          });
          setLastThreeMonthsOrders(lastThreeMonthsOrders);

          const currentYearOrders = allCompletedOrders.filter((order) => {
            // date created format -> "2023-12-25T13:54"
            const dateCreated = order?.meta?._date_created?.[0];
            if (!dateCreated) return false;

            const orderDate = new Date(dateCreated);

            // Get current date and set day to 1
            const currentDate = new Date();
            // currentDate.setMonth(1, 1);

            // Calculate the start date 12 months ago
            let startDate = new Date(currentDate);
            startDate.setMonth(startDate.getMonth() - 11);
            startDate.setDate(1);

            // Check if order date is between 12 months ago and current date
            return orderDate >= startDate && orderDate <= currentDate;
          });

          setCurrentYearOrders(currentYearOrders);

          const last_five_year = currentYear - 5;
          const fiveYearOrders = allCompletedOrders.filter((order) => {
            const dateCreated = order?.meta?._date_created?.[0];
            if (!dateCreated) return false; // Skip if dateCreated is not available
            const orderYear = new Date(dateCreated).getFullYear();
            return orderYear >= last_five_year;
          });
          setFiveYearOrders(fiveYearOrders);
          // -------------orders for sales chart in sale overview ends

          const allOtherCurrenciesOrders = allCompletedOrders.filter(
            (order) => order?.meta?._currency?.[0] != "USD"
          );
          const allUsdOrders = allCompletedOrders.filter(
            (order) => order?.meta?._currency?.[0] == "USD"
          );

          let sale_total = 0;
          let sale_current_year = 0;

          const calculateSales = (orders, priceMetaKey) => {
            let total = 0;
            let currentYearTotal = 0;

            orders.forEach((order) => {
              // Get products with seller ID
              const productsWithSellerId = unserialize(
                order?.meta?._ordered_products?.[0]
              );

              // Get current seller's products
              const seller_products = productsWithSellerId.filter(
                (seller_product) => seller_product.seller_id == userData.id
              );

              // Get order creation date
              const date_created = order?.meta?._date_created?.[0];

              // Unserialize product prices based on the provided meta key
              const products_price = unserialize(
                order?.meta?.[priceMetaKey]?.[0]
              );

              // Get current seller's product IDs
              const sellerProductIds = seller_products.map(
                (product) => product.product_id
              );

              // Get prices for current seller's products
              const get_current_seller_products_price = products_price.filter(
                (product) => sellerProductIds.includes(product.product_id)
              );

              // Calculate sales from products
              const sales_from_products =
                get_current_seller_products_price.reduce(
                  (sum, product) => sum + parseFloat(product.price || 0), // Safely parse price as float and add
                  0 // Initial sum value
                );

              // Check if the order creation date is valid
              if (date_created) {
                // Parse the year from the date_created string
                const orderYear = new Date(date_created).getFullYear();

                // Add to current year sales if the year matches
                if (orderYear === currentYear) {
                  currentYearTotal += sales_from_products;
                }
              }

              // Add to total sales
              total += sales_from_products;
            });

            return { total, currentYearTotal };
          };

          // Calculate sales for orders in other currencies
          const otherCurrenciesSales = calculateSales(
            allOtherCurrenciesOrders,
            "_products_price"
          );
          sale_total += otherCurrenciesSales.total;
          sale_current_year += otherCurrenciesSales.currentYearTotal;

          // Calculate sales for USD orders (using a different meta key)
          const usdSales = calculateSales(allUsdOrders, "_usd_products_price");
          sale_total += usdSales.total;
          sale_current_year += usdSales.currentYearTotal;

          setSalesCurrentYear(sale_current_year);
          setSalesAllTime(sale_total);
        } catch (err) {
          // setError(err.message);
        }
      }

      fetchAllOrderDetails();

      async function fetchOrderTotal() {
        try {
          const orderDetailsPromises = soldDomains.map(async (orderId) => {
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

          // const allCompletedOrders = allOrderDetails.filter(
          //   (order) => order?.meta?._order_status?.[0] == "completed"
          // );
          // setOrderDetails(allCompletedOrders);

          const allOtherCurrenciesOrders = allOrderDetails.filter(
            (order) => order?.meta?._currency?.[0] != "USD"
          );
          const allUsdOrders = allOrderDetails.filter(
            (order) => order?.meta?._currency?.[0] == "USD"
          );

          let order_total = 0;

          const currentYear = new Date().getFullYear();

          const calculateOrderTotal = (orders, priceMetaKey) => {
            let orderTotal = 0;

            orders.forEach((order, index) => {
              // Get products with seller ID
              const productsWithSellerId = unserialize(
                order?.meta?._ordered_products?.[0]
              );
              if (!productsWithSellerId) {
                // console.error(
                //   `Failed to unserialize _ordered_products for order at index ${index}`
                // );
                return; // Skip to next order
              }

              // Get current seller's products
              const seller_products = productsWithSellerId.filter(
                (seller_product) => seller_product.seller_id == userData.id
              );

              // Unserialize product prices based on the provided meta key
              const products_price = unserialize(
                order?.meta?.[priceMetaKey]?.[0]
              );
              if (!products_price) {
                // console.error(
                //   `Failed to unserialize prices for order at index ${index}`
                // );
                return; // Skip to next order
              }

              // Get current seller's product IDs
              const sellerProductIds = seller_products.map(
                (product) => product.product_id
              );

              // Get prices for current seller's products
              const get_current_seller_products_price = products_price.filter(
                (product) => sellerProductIds.includes(product.product_id)
              );

              // Calculate sales from products
              const sales_from_products =
                get_current_seller_products_price.reduce(
                  (sum, product) => sum + parseFloat(product.price || 0), // Safely parse price as float and add
                  0 // Initial sum value
                );

              // Add to total sales
              orderTotal += sales_from_products;
            });

            return { orderTotal };
          };

          // Calculate sales for orders in other currencies
          const otherCurrenciesSales = allOtherCurrenciesOrders
            ? calculateOrderTotal(allOtherCurrenciesOrders, "_products_price")
            : 0;
          order_total += otherCurrenciesSales.orderTotal;

          // Calculate sales for USD orders (using a different meta key)
          const usdSales = allUsdOrders
            ? calculateOrderTotal(allUsdOrders, "_usd_products_price")
            : 0;
          order_total += usdSales.orderTotal;

          setOrderTotal(order_total);
        } catch (err) {
          console.log(err);
        }
      }
      fetchOrderTotal();
    }
  }, [soldDomains]);

  //----------------------------------------------------------- sales details ends

  return (
    <div
      className={`${styles.tabs} ${styles.ws_container} ${styles.dashboard_main_tabs}`}
    >
      <div className={styles.tabs_lists}>
        <UserDetails userData={userData} setUserData={setUserData} />

        {/* Tabs for Desktop */}
        {!isMobile && (
          <div className={styles.tabLabels}>
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab)}
                className={`${styles.tabButton} ${styles.button_icon_wrapper} ${
                  styles.dashboard_main_tabs_button
                } ${tab.label === activeTab ? styles.active : ""}`}
                role="tab"
                aria-selected={tab.label === activeTab}
              >
                <div className={styles.svg_bg_white}>{tab.icon}</div>
                {tab.label}
                <div>{tab.image}</div>
              </button>
            ))}
          </div>
        )}

        {/* Dropdown for Mobile */}
        {isMobile && (
          <div className={`${styles.customDropdown} ${styles.tabLabels}`}>
            <button
              className={`${styles.dropdownButton} ${styles.button} ${styles.tabButton} ${styles.button_icon_wrapper} ${styles.dashboard_main_tabs_button}`}
              onClick={toggleDropdown}
            >
              <div className={`${styles.selectedTab}`}>
                <div className={styles.svg_bg_white}>
                  {tabs.find((tab) => tab.label === activeTab)?.icon}
                </div>
                {activeTab}
              </div>
              <TiArrowSortedDown />
            </button>

            {/* Dropdown Options */}
            {dropdownOpen && (
              <div className={styles.dropdownOptions}>
                {tabs.map((tab) => (
                  <div
                    key={tab.label}
                    className={`${styles.dropdownOption} ${
                      styles.dashboard_main_tabs_button
                    } ${tab.label === activeTab ? styles.active : ""}`}
                    onClick={() => {
                      handleTabClick(tab); // Set the active tab
                      setDropdownOpen(false); // Close the dropdown after selection
                    }}
                  >
                    {/* <div className={styles.icon}> */}
                    {tab.icon}
                    {/* </div> */}
                    {tab.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ul className={styles.tabs_list_footer}>
          {/* <li>
            <button
              className={`${styles.tabButton} ${styles.button_icon_wrapper}`}
            >
              <div className={styles.svg_bg_white}>
                <img src={AccountSettingIcon} alt="Account settings icon" />
              </div>
              Account Settings
            </button>
          </li> */}
          {/* <li className={styles.button_icon_wrapper}>
            <button className={`${styles.tabButton} ${styles.button_icon_wrapper}`}>
              <div className={styles.svg_bg_white}>
                <img src={logoutIcon} alt="Logout icon" /></div>
              Log Out
            </button>
          </li> */}
          <li>
            <a
              href={logoutUrl}
              className={`${styles.tabButton} ${styles.button_icon_wrapper} ${styles.tabsLogout}`}
            >
              <div className={styles.svg_bg_white}>
                <img src={logoutIcon} alt="Logout icon" />
              </div>
              Log Out
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.tabContent}>
        <TabContent
          activeTab={activeTab}
          userData={userData}
          // soldDomains={soldDomains}
          salesAllTime={salesAllTime}
          salesCurrentYear={salesCurrentYear}
          orderTotal={orderTotal}
          currentMonthOrders={currentMonthOrders}
          lastThreeMonthsOrders={lastThreeMonthsOrders}
          currentYearOrders={currentYearOrders}
          fiveYearOrders={fiveYearOrders}
          maxOrder={orderDetails}
          refreshTabs={refreshTabs}
        />
      </div>

      {activeTab === "Sellers Central" && (
        <>
          <div className={styles.sellerCentralInnerTabs}>
            <h4 className={styles.hide_desktop}>
              {sellerCentralTabs.find((tab) => tab.label === sellerCentralTab)
                ?.label || "Add New Domain"}
            </h4>
            <div className={styles.sellerCentralInnerTabsButtons}>
              {sellerCentralTabs.map((tab, index) => (
                <button
                  key={tab.label}
                  onClick={() => handleSellerCentralTab(tab.label)}
                  className={`${styles.tabButton} ${
                    styles.button_icon_wrapper
                  } ${sellerCentralTab === tab.label ? styles.active : ""}`}
                >
                  <div className={styles.svg_bg_white}>{tab.icon}</div>
                  <label>{tab.label}</label>
                  {/* Render stars_icon only for the first button */}
                  {index === 0 && (
                    <div className={styles.stars_icon}>{tab.image}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.innerTabContent}>
            <SellerCentralTabContent
              activeInnerTab={sellerCentralTab}
              setSellerCentralTab={setSellerCentralTab}
              userData={userData}
              soldDomains={soldDomains}
              salesAllTime={salesAllTime}
              salesCurrentYear={salesCurrentYear}
              currentMonthSales={currentMonthOrders}
              currentYearSales={currentYearOrders}
              AllTimeSales={orderDetails}
            />
            {/* const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
  const [lastThreeMonthsOrders, setLastThreeMonthsOrders] = useState([]);
  const [currentYearOrders, setCurrentYearOrders] = useState([]);
  const [fiveYearOrders, setFiveYearOrders] = useState([]); */}
          </div>
        </>
      )}
    </div>
  );
};

export default Tabs;

// Tabs.js:282 Total sales all time: 25912.68
// Tabs.js:283 Total sales current year: 25912.68
// Tabs.js:284 USD sales all time: 14999
// Tabs.js:285 USD sales current year: 14999
// Tabs.js:286 Other currencies sales all time: 10913.68
// Tabs.js:287 Other currencies sales current year: 10913.68
