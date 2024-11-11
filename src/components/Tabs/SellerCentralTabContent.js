import React, { useState, useRef } from "react";
// import React from 'react';
import styles from "./Tabs.module.css"; // Import styles
import Sales from "./Sales";
import mediaSetupIcon from "./images/media_setup_icon.png";

import domain_img from "./images/chatseek.com.png";

import { FaTimes } from "react-icons/fa"; // Import necessary icons
// import categories_icon from './images.categories-icon.png';

import { FaCircle } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import OfferTabs from "./OfferTabs";
import PaymentStatusTabs from "./PaymentStatusTabs";
import delete_reset_icon from "./images/delete-reset-icon.png";
import available_balance_circle from "./images/SHAPES_available_balance.png";
import available_balance_right_icon from "./images/available_balance_right_icon.png";
import paypal_icon from "./images/paypal_icon.png";
import bank_transfer_icon from "./images/bank_transfer_icon.png";
import Domains from "./Domains.jsx";
import { FaCheckCircle } from "react-icons/fa";
import AddDomain from "./AddDomain.jsx";
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
}) => {
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
  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId); // Set the selected card
  };
  switch (activeInnerTab) {
    case "Add New Domain":
      return (
        <>
          <AddDomain styles={styles} userData={userData} />
        </>
      );

    case "Dashboard":
      return <p>This is the content for Dashboard</p>;
    case "Sales":
      return (
        <>
          <Sales />;
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
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Recent Offers</h4>
            </div>
            <div>
              <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
                {[1, 2, 3].map((item, index) => (
                  <div key={index} className={styles.recentOffers_wrapper}>
                    {/* Offer card */}
                    <div className={`${styles.ws_flex} ${styles.gap_10}`}>
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
                          {expanded[index] ? (
                            <FaTimes onClick={() => toggleExpanded(index)} />
                          ) : (
                            <FaPlus onClick={() => toggleExpanded(index)} />
                          )}
                          <FiMail />
                        </div>
                      </div>
                    </div>

                    {/* Expanded content as a new column below */}
                    <div
                      className={`${styles.extra_column_wrapper} ${
                        expanded[index] ? styles.expanded : ""
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
                              className={styles.acceptButton}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className={styles.declineButton}
                            >
                              Decline
                            </button>

                            {/* Reset button with delete icon */}
                            <button
                              type="button"
                              className={styles.resetButton}
                              onClick={handleReset}
                            >
                              <img src={delete_reset_icon} />
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
              <h4>Offers</h4>
            </div>
            <OfferTabs />
          </div>
        </>
      );
    case "Wallet/Banking":
      return (
        <>
          <div className={`${styles.wallet_top_wrapper} ${styles.ws_flex}`}>
            <div className={styles.wallet_available_balance}>
              <div
                className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <img src={mediaSetupIcon} alt="Media Setup Icon" />
                <h4>Available Balance</h4>
              </div>
              <div className={styles.available_balance_card}>
                <div
                  className={`${styles.available_balance_card_shapes} ${styles.justify_space_between} ${styles.ws_flex}`}
                >
                  <img src={available_balance_circle}></img>
                  <img src={available_balance_right_icon}></img>
                </div>
                <div>
                  <h5>Account Balance</h5>
                  <h2>
                    205,700 <span>USD</span>
                  </h2>
                </div>
                <div
                  className={`${styles.available_balance_card_footer} ${styles.ws_flex}`}
                >
                  <div>
                    <h6>Holder</h6>
                    <h5>Jenny Remigton</h5>
                  </div>
                  <div>
                    <h6>Payment Method</h6>
                    <h5>PAYPAL</h5>
                  </div>
                  <div>
                    <button>Request Payout</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment Method */}
            <div className={styles.wallet_available_balance}>
              <div
                className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <img src={mediaSetupIcon} alt="Media Setup Icon" />
                <h4>Payment Method</h4>
              </div>
              <div className={styles.paymentMethodcard_section}>
                {/* Card 1 */}
                <label
                  className={`${styles.card} ${
                    selectedCard === 1 ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedCard === 1}
                    onChange={() => handleCardSelect(1)}
                    className={styles.radio_input}
                  />
                  <div className={styles.card_content}>
                    {selectedCard === 1 && (
                      <span className={styles.check_icon}>
                        <FaCheckCircle />
                      </span>
                    )}
                    <img
                      src={paypal_icon}
                      alt="Paypal Icon"
                      className={styles.card_image}
                    />
                    <div>
                      <h4>Paypal</h4>
                      <p>Connect your Paypal Account</p>
                    </div>
                    <button className={styles.edit_profile_button}>
                      Edit Email
                    </button>
                  </div>
                </label>

                {/* Card 2 */}
                <label
                  className={`${styles.card} ${
                    selectedCard === 2 ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    checked={selectedCard === 2}
                    onChange={() => handleCardSelect(2)}
                    className={styles.radio_input}
                  />
                  <div className={styles.card_content}>
                    {selectedCard === 2 && (
                      <span className={styles.check_icon}>
                        <FaCheckCircle />
                      </span>
                    )}
                    <img
                      src={bank_transfer_icon}
                      alt="Bank Transfer Icon"
                      className={styles.card_image}
                    />
                    <div>
                      <h4>Bank Transfer</h4>
                      <p>Connect your Bank Account</p>
                    </div>
                    <button className={styles.edit_profile_button}>
                      Bank Settings
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.payment_status_wrapper}>
            <div
              className={`${styles.paymentStatus_title_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Payment Status</h4>
            </div>
            <PaymentStatusTabs />
          </div>
        </>
      );
    default:
      return null; // Return null if no case matches
  }
};

export default SellerCentralTabContent;
