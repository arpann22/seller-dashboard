import React, { useState, useRef } from "react";
// import React from 'react';
import styles from "./Tabs.module.css"; // Import styles
import Sales from "./Sales";
import Dashboard from "./Dashboard.jsx";
import mediaSetupIcon from "./images/media_setup_icon.png";
import domain_img from "./images/chatseek.com.png";
import { FaTimes } from "react-icons/fa"; // Import necessary icons
// import categories_icon from './images.categories-icon.png';

import { FaCircle } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import OfferTabs from "./OfferTabs";

// import paypal_icon from "./images/paypal_icon.png";
// import bank_transfer_icon from "./images/bank_transfer_icon.png";
import Domains from "./Domains.jsx";
import AddDomain from "./AddDomain.jsx";

import { ReactComponent as DeleteIcon } from "./image/delete.svg";
import { ReactComponent as RecentOffersIcon } from "./image/recents_offers.svg";
// import { ReactComponent as PaymentMethodIcon } from "./image/method.svg";

import Wallet from "./Wallet.jsx";

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
  const [expanded, setExpanded] = useState({}); // Track which card is expanded
  const [selectedCard, setSelectedCard] = useState(null);
  const [isPaypalPopupOpen, setPaypalPopupOpen] = useState(false);
  const [isBankPopupOpen, setBankPopupOpen] = useState(false);
  const [isCryptoPopupOpen, setCryptoPopupOpen] = useState(false)

  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("active");
  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };

  switch (activeInnerTab) {
    case "Add New Domain":
      return (
        <>
          <AddDomain styles={styles} userData={userData} />
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
          />
        </>
      );

    case "Manage Offers":
      return (
        <>
          <div className={styles.offers_tab_recent_offer_wrap}>
            <div
              className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
              <RecentOffersIcon />
              <h4>Recent Offers</h4>
            </div>
            <div>
              <div
                className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.dashboard_small_margin}`}
              >
                {[1, 2, 3].map((item, index) => (
                  <div key={index} className={styles.recentOffers_wrapper}>
                    {/* Offer card */}
                    <div
                      className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                    >
                      <div className={styles.recentOffers_card}>
                        <div className={styles.recentOffers_card_image}>
                          <img src={domain_img} alt="Domain" />
                        </div>
                        <div className={styles.recentOffers_card_titles}>
                          <p>Product</p>
                          <h5>debugbot.com</h5>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>Offer Amount</p>
                          <h6>$5000</h6>
                        </div>
                      </div>
                      <div className={styles.recentOffers_card}>
                        <div className={styles.recentOffers_card_image}>
                          <img src={domain_img} alt="Domain" />
                        </div>
                        <div
                          className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                        >
                          <p className="online">
                            Customer Online
                            <FaCircle />
                          </p>
                          <h5>Charles Bedford</h5>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>Offer Expiry</p>
                          <h6>Oct 20, 2024</h6>
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
                            Pending
                          </h5>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          {/* <div
                            className={`${styles.svg_wrapper_bg_grey} ${expanded[index]
                              ? styles.icon_close_wrapper
                              : styles.icon_add_wrapper
                              }`}
                          >
                            {expanded[index] ? (
                              <FaTimes onClick={() => toggleExpanded(index)} />
                            ) : (
                              <FaPlus onClick={() => toggleExpanded(index)} />
                            )}
                          </div> */}
                          <div
                            className={`${styles.svg_wrapper_bg_grey} ${expanded[index]
                              ? styles.icon_close_wrapper
                              : styles.icon_add_wrapper
                              }`}
                            onClick={() => toggleExpanded(index)}
                          >
                            {expanded[index] ? <FaTimes /> : <FaPlus />}
                          </div>
                          <div className={styles.svg_wrapper_bg_grey}>
                            <FiMail />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content as a new column below */}
                    <div
                      className={`${styles.extra_column_wrapper} ${expanded[index] ? styles.expanded : ""
                        }`}
                    >
                      <div className={styles.extra_column}>
                        <div className={styles.recentOffers_card}>
                          <div className={styles.recentOffers_card_image}>
                            <img src={domain_img}></img>
                          </div>
                          <div className={styles.recentOffers_card_titles}>
                            <p>Product</p>
                            <h5>debugbot.com</h5>
                          </div>
                          <div className={styles.recentOffers_card_details}>
                            <p>Offer Amount</p>
                            <h6>$5000</h6>
                          </div>
                        </div>
                        <form
                          className={styles.offerForm}
                          onSubmit={handleSubmit}
                        >
                          <div className={styles.p_relative}>
                            <input
                              type="number"
                              className={styles.offerInput}
                              placeholder="Enter your counter offer"
                              min="0"
                            />
                            <button
                              type="submit"
                              className={styles.submitButton}
                            >
                              <span className={styles.arrow}>&#8594;</span>{" "}
                              {/* Arrow symbol */}
                            </button>
                          </div>
                          <div className={`${styles.ws_flex} ${styles.gap_10}`}>
                            <button
                              type="button"
                              className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className={`${styles.declineButton} ${styles.hover_white}`}
                            >
                              Decline
                            </button>

                            {/* Reset button with delete icon */}
                            <button
                              type="button"
                              className={styles.resetButton}
                              onClick={handleReset}
                            >
                              {/* <img src={delete_reset_icon} /> */}
                              <DeleteIcon />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.offers_tab_offer_wrap}>
            <div
              className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Past Offers</h4>
            </div>
            <OfferTabs />
          </div>
        </>
      );
    case "Wallet/Banking":
      return (
        <>
          <Wallet
            selectedCard={selectedCard}
            isPaypalPopupOpen={isPaypalPopupOpen}
            isCryptoPopupOpen={isCryptoPopupOpen}
            isBankPopupOpen={isBankPopupOpen}
            setSelectedCard={setSelectedCard}
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
