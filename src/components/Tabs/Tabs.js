import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.css";
import TabContent from "./TabContent";
import SellerCentralTabContent from "./SellerCentralTabContent";
import editProfileIcon from "./images/edit-profile.png";
import myOrderIcon from "./images/my-orders.png";
import accountSettingIcon from "./images/account-settings.png";
import logoutIcon from "./images/logout.png";
import addDomainsIcon from "./images/add-domain-icon.png";
import UserDetails from "./UserDetails";

const Tabs = ({ userData, setUserData }) => {
  // Main tabs with corresponding URL parameters
  const tabs = [
    { label: "My Orders", icon: myOrderIcon, urlParam: "my-orders" },
    { label: "My Offers", icon: myOrderIcon, urlParam: "my-offers" },
    // { label: "My Auctions", icon: editProfileIcon, urlParam: "my-auctions" },
    // { label: "My Support", icon: editProfileIcon, urlParam: "my-support" },
    {
      label: "Sellers Central",
      icon: editProfileIcon,
      urlParam: "sellers-central",
    },
  ];

  const sellerCentralTabs = [
    {
      label: "Add New Domain",
      icon: addDomainsIcon,
      content: "This is the content for Add New Domain.",
    },
    {
      label: "Dashboard",
      icon: addDomainsIcon,
      content: "This is the content for Dashboard.",
    },
    {
      label: "Sales",
      icon: addDomainsIcon,
      content: "This is the content for Sales.",
    },
    {
      label: "Domains",
      icon: addDomainsIcon,
      content: "This is the content for Domains.",
    },
    {
      label: "Manage Offers",
      icon: addDomainsIcon,
      content: "This is the content for Manage Offers.",
    },
    {
      label: "Wallet/Banking",
      icon: addDomainsIcon,
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
              className={`${styles.tabButton} ${styles.button_icon_wrapper} ${
                tab.label === activeTab ? styles.active : ""
              }`}
              role="tab"
              aria-selected={tab.label === activeTab}
            >
              <img
                src={tab.icon}
                alt={`${tab.label} icon`}
                className={styles.tabIcon}
              />
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
                className={`${styles.tabButton} ${styles.button_icon_wrapper} ${
                  sellerCentralTab === tab.label ? styles.active : ""
                } ${
                  tab.label === "Add New Domain" ? styles.specialButton : ""
                }`}
              >
                <img
                  src={tab.icon}
                  alt={`${tab.label} icon`}
                  className={styles.tabIcon}
                />
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
