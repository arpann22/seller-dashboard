import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.css";
import TabContent from "./TabContent";
import SellerCentralTabContent from "./SellerCentralTabContent";
import editProfileIcon from "./images/edit-profile.png";
import myOrderIcon from "./images/my-orders.png";
import accountSettingIcon from "./image/settings.svg";
import logoutIcon from "./image/logout.svg";
// import addDomainsIcon from "./images/add-domain-icon.png";
import UserDetails from "./UserDetails";
import { ReactComponent as MyOrderIcon } from './image/orders.svg';
import { ReactComponent as MyOfferIcon } from './image/offers.svg';
import { ReactComponent as EditProfileIcon } from './image/edit_profil.svg';
import { ReactComponent as AddDomainsIcon } from './image/plus.svg';
import { ReactComponent as DashboardIcon } from './image/dashboard.svg';
import { ReactComponent as SalesIcon } from './image/sales-menu.svg';
import { ReactComponent as DomainsIcon } from './image/domains.svg';
import { ReactComponent as ManageOffersIcon } from './image/manage_offers.svg';
import { ReactComponent as WalletIcon } from './image/wallet.svg';


const Tabs = ({ userData, setUserData }) => {
  // Main tabs with corresponding URL parameters
  const tabs = [
    { label: "My Orders", icon: <MyOrderIcon />, urlParam: "my-orders" },
    { label: "My Offers", icon: <MyOfferIcon />, urlParam: "my-offers" },
    // { label: "My Auctions", icon: <EditProfileIcon />, urlParam: "my-auctions" },
    // { label: "My Support", icon: <EditProfileIcon />, urlParam: "my-support" },
    { label: "Sellers Central", icon: <EditProfileIcon />, urlParam: "sellers-central" },
  ];

  const sellerCentralTabs = [
    {
      label: "Add New Domain",
      icon: <AddDomainsIcon />,
      content: "This is the content for Add New Domain.",
    },
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      content: "This is the content for Dashboard.",
    },
    {
      label: "Sales",
      icon: <SalesIcon />,
      content: "This is the content for Sales.",
    },
    {
      label: "Domains",
      icon: <DomainsIcon />,
      content: "This is the content for Domains.",
    },
    {
      label: "Manage Offers",
      icon: <ManageOffersIcon />,
      content: "This is the content for Manage Offers.",
    },
    {
      label: "Wallet/Banking",
      icon: <WalletIcon />,
      content: "This is the content for Wallet/Banking.",
    },
  ];

  // State for active main tab and seller central inner tab
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [sellerCentralTab, setSellerCentralTab] = useState(
    sellerCentralTabs[0].label
  );

  // Set initial active tab based on URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const matchedTab = tabs.find((tab) => tab.urlParam === tabParam);
    if (matchedTab) {
      setActiveTab(matchedTab.label);
    }
  }, [tabs]);

  // Update URL when tab changes
  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab.urlParam);
    window.history.pushState({}, "", `?${params.toString()}`);
    localStorage.removeItem("editable_domain_id");
  };

  function hadelSellerCentralTab(tab_label) {
    setSellerCentralTab(tab_label);
    localStorage.removeItem("editable_domain_id");
  }
  return (
    <div className={`${styles.tabs} ${styles.ws_container}`}>
      <div className={styles.tabs_lists}>
        <UserDetails userData={userData} setUserData={setUserData} />
        <div className={styles.tabLabels}>
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab)}
              className={`${styles.tabButton} ${styles.button_icon_wrapper} ${tab.label === activeTab ? styles.active : ""
                }`}
              role="tab"
              aria-selected={tab.label === activeTab}
            >
              <div className={styles.svg_bg_white}>
                {tab.icon}
                {/* <img
                src={tab.icon}
                alt={`${tab.label} icon`}
                className={styles.tabIcon}
              /> */}
              </div>
              {tab.label}
            </button>
          ))}
        </div>
        <ul className={styles.tabs_list_footer}>
          <li className={styles.button_icon_wrapper}>
            <img src={accountSettingIcon} alt="Account settings icon" />
            Account Settings
          </li>
          <li className={styles.button_icon_wrapper}>
            <img src={logoutIcon} alt="Logout icon" />
            Log Out
          </li>
        </ul>
      </div>

      <div className={styles.tabContent}>
        <TabContent
          activeTab={activeTab}
          userData={userData}
          setUserData={setUserData}
        />
      </div>

      {activeTab === "Sellers Central" && (
        <>
          <div className={styles.sellerCentralInnerTabs}>
            {sellerCentralTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => hadelSellerCentralTab(tab.label)}
                className={`${styles.tabButton} ${styles.button_icon_wrapper} ${sellerCentralTab === tab.label ? styles.active : ""
                  } ${tab.label === "Add New Domain" ? styles.specialButton : ""
                  }`}
              >
                {/* <img
                  src={tab.icon}
                  alt={`${tab.label} icon`}
                  className={styles.tabIcon}
                /> */}
                <div className={styles.svg_bg_white}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.innerTabContent}>
            <SellerCentralTabContent
              activeInnerTab={sellerCentralTab}
              setSellerCentralTab={setSellerCentralTab}
              userData={userData}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Tabs;
