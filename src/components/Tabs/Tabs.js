import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.css";
import UserDetails from "./UserDetails";
import TabContent from "./TabContent";
import SellerCentralTabContent from "./SellerCentralTabContent";
import accountSettingIcon from "./image/settings.svg";
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
const logoutUrl = '/wp-login.php?action=logout&redirect_to=/login';

const Tabs = ({ userData, setUserData }) => {
  // Main tabs and seller central tabs
  const tabs = [
    { label: "My Orders", icon: <MyOrderIcon />, urlParam: "my-orders" },
    { label: "My Offers", icon: <MyOfferIcon />, urlParam: "my-offers" },
    { label: "Sellers Central", icon: <EditProfileIcon />, urlParam: "sellers-central" },
  ];

  const sellerCentralTabs = [
    { label: "Add New Domain", icon: <AddDomainsIcon />, image: <StarsIcon />, content: "Add New Domain content." },
    { label: "Dashboard", icon: <DashboardIcon />, content: "Dashboard content." },
    { label: "Sales", icon: <SalesIcon />, content: "Sales content." },
    { label: "Domains", icon: <DomainsIcon />, content: "Domains content." },
    { label: "Manage Offers", icon: <ManageOffersIcon />, content: "Manage Offers content." },
    { label: "Wallet/Banking", icon: <WalletIcon />, content: "Wallet/Banking content." },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [sellerCentralTab, setSellerCentralTab] = useState(sellerCentralTabs[0].label);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown open state


  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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

  return (
    <div className={`${styles.tabs} ${styles.ws_container}`}>
      <div className={styles.tabs_lists}>
        <UserDetails userData={userData} setUserData={setUserData} />

        {/* Tabs for Desktop */}
        {!isMobile && (
          <div className={styles.tabLabels}>
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab)}
                className={`${styles.tabButton} ${styles.button_icon_wrapper} ${tab.label === activeTab ? styles.active : ""}`}
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
              className={`${styles.dropdownButton} ${styles.button} ${styles.tabButton} ${styles.button_icon_wrapper}`}
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
                    className={`${styles.dropdownOption} ${tab.label === activeTab ? styles.active : ""}`}
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
          <li>
            <button className={`${styles.tabButton} ${styles.button_icon_wrapper}`}>
              <div className={styles.svg_bg_white}>
                <img src={accountSettingIcon} alt="Account settings icon" /></div>
              Account Settings
            </button>
          </li>
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
        <TabContent activeTab={activeTab} userData={userData} setUserData={setUserData} />
      </div>

      {
        activeTab === "Sellers Central" && (
          <>

            <div className={styles.sellerCentralInnerTabs}>
              <h4 className={styles.hide_desktop}>

                {sellerCentralTabs.find((tab) => tab.label === sellerCentralTab)?.label || "Add New Domain"}
              </h4>
              <div className={styles.sellerCentralInnerTabsButtons}>
                {sellerCentralTabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    onClick={() => handleSellerCentralTab(tab.label)}
                    className={`${styles.tabButton} ${styles.button_icon_wrapper} ${sellerCentralTab === tab.label ? styles.active : ""
                      }`}
                  >
                    <div className={styles.svg_bg_white}>{tab.icon}</div>
                    <label>{tab.label}</label>
                    {/* Render stars_icon only for the first button */}
                    {index === 0 && <div className={styles.stars_icon}>{tab.image}</div>}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.innerTabContent}>
              <SellerCentralTabContent
                activeInnerTab={sellerCentralTab}
                setSellerCentralTab={setSellerCentralTab}
                userData={userData}
              />
            </div>
          </>
        )
      }
    </div >
  );
};

export default Tabs;
