import React, { useState, useRef, useEffect } from "react";
// import React from 'react';
import styles from "./Tabs.module.css"; // Import styles
import Sales from "./Sales";
import Dashboard from "./Dashboard.jsx";
import mediaSetupIcon from "./images/media_setup_icon.png";
import domain_img from "./images/chatseek.com.png";

// import paypal_icon from "./images/paypal_icon.png";
// import bank_transfer_icon from "./images/bank_transfer_icon.png";
import Domains from "./Domains.jsx";
import AddDomain from "./AddDomain.jsx";

// import { ReactComponent as PaymentMethodIcon } from "./image/method.svg";

import Wallet from "./Wallet.jsx";
import ManageOffers from "./ManageOffers.jsx";

const SellerCentralTabContent = ({
  activeInnerTab,
  userData,
  setSellerCentralTab,
  soldDomains,
  salesAllTime,
  salesCurrentYear,
  currentMonthSales,
  currentYearSales,
  AllTimeSales,
}) => {
  const [isPaypalPopupOpen, setPaypalPopupOpen] = useState(false);
  const [isBankPopupOpen, setBankPopupOpen] = useState(false);
  const [isCryptoPopupOpen, setCryptoPopupOpen] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);

    // Redirect to the correct tab if "order" is in the URL
    if (url.href.indexOf("order") > -1) {
      setSellerCentralTab("Sales");
    } else if (url.href.indexOf("offer") > -1) {
      setSellerCentralTab("Manage Offers");
    }

    // // Scroll to the specific order ID if hash is present
    // if (url.hash) {
    //   const elementId = url.hash.substring(1); // Remove the "#" to get the ID
    //   const element = document.getElementById("sales-details");
    //   console.log(element);
    //   if (element) {
    //     element.scrollIntoView({ behavior: "smooth" });
    //   }
    // }
  }, []);

  switch (activeInnerTab) {
    case "Add New Domain":
      return (
        <>
          <AddDomain
            styles={styles}
            userData={userData}
            activeInnerTab={activeInnerTab}
            setSellerCentralTab={setSellerCentralTab}
          />
        </>
      );

    case "Dashboard":
      return (
        <>
          <Dashboard
            userData={userData}
            soldDomains={soldDomains}
            salesAllTime={salesAllTime}
            salesCurrentYear={salesCurrentYear}
            setSellerCentralTab={setSellerCentralTab}
          />
        </>
      );
    case "Sales":
      return (
        <>
          <Sales
            userData={userData}
            currentMonthCompletedSales={currentMonthSales}
            currentYearCompletedSales={currentYearSales}
            AllTimeCompletedSales={AllTimeSales}
          />
        </>
      );
    case "Domains":
      return (
        <>
          <Domains
            userData={userData}
            mediaSetupIcon={mediaSetupIcon}
            domain_img={domain_img}
            setSellerCentralTab={setSellerCentralTab}
            activeInnerTab={activeInnerTab}
          />
        </>
      );

    case "Manage Offers":
      return (
        <>
          <ManageOffers
            styles={styles}
            userData={userData}
            domain_img={domain_img}
            mediaSetupIcon={mediaSetupIcon}
          />
        </>
      );
    case "Wallet/Banking":
      return (
        <>
          <Wallet
            isPaypalPopupOpen={isPaypalPopupOpen}
            isCryptoPopupOpen={isCryptoPopupOpen}
            isBankPopupOpen={isBankPopupOpen}
            setPaypalPopupOpen={setPaypalPopupOpen}
            setBankPopupOpen={setBankPopupOpen}
            setCryptoPopupOpen={setCryptoPopupOpen}
            mediaSetupIcon={mediaSetupIcon}
            userData={userData}
          />
        </>
      );
    default:
      return null; // Return null if no case matches
  }
};

export default SellerCentralTabContent;
