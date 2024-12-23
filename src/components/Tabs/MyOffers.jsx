import React from "react";
import { useState } from "react";
import "./MyOffers.css"; // Import styles specific to this component
import styles from "./Tabs.module.css";
import { ReactComponent as MyOfferIcon } from "./image/offer.svg";
import { ReactComponent as SortIcon } from "./image/sort.svg";
import { ReactComponent as OfferActive } from "./image/offers_active.svg";
import { ReactComponent as OfferDecline } from "./image/offers_declined.svg";
import { ReactComponent as CartIcon } from "./image/sales_overview.svg";
import { ReactComponent as RemakeOfferIcon } from "./image/pricing_setup.svg";
import { ReactComponent as DeleteIcon } from "./image/delete.svg";
import { FaCircle, FaTimes } from "react-icons/fa"; // Import necessary icons
import { FaPlus } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import domain_img from "./images/chatseek.com.png";
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
  // You can add more logic if needed, such as resetting state or other form elements
};
const MyOffers = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded

  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };
  return (
    <div className="myOffersContainer">
      <div
        className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                    } myOffersTitle`}
      >
        <div>
          <MyOfferIcon />
        </div>
        <h4>My Offers</h4>
      </div>
      {/* my offers main content */}
      <div className={styles.offer_tabs_wrapper}>
        {/* Nav tabs */}
        <div
          className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.dashboard_small_margin}`}
        >
          <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs}`}>
            <li
              className={`${activeTab === "active" ? styles.active : ""}`}
              onClick={() => setActiveTab("active")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <OfferActive />
              </div>
              <label> Active</label>
            </li>
            <li
              className={`${activeTab === "declined" ? styles.active : ""}`}
              onClick={() => setActiveTab("declined")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <OfferDecline />
              </div>
              <label>Declined</label>
            </li>
            <li
              className={`${
                activeTab === "accepted" ? styles.active : ""
              } my_offer_accepted_tab`}
              onClick={() => setActiveTab("accepted")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <MyOfferIcon />
              </div>
              <label>Accepted</label>
            </li>
          </ul>
          <div className={styles.offerSorts}>
            {/* <img src={sort_icon}></img> */}
            <SortIcon />
            <label>Sort </label>
          </div>
        </div>
        {/* Tab content */}
        <div>
          {activeTab === "active" && (
            <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
              {[1, 2, 3].map((item, index) => (
                <div
                  key={index}
                  className={`${styles.recentOffers_wrapper} myOffers_wrapper `}
                >
                  {/* Offer card */}
                  <div
                    className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                  >
                    <div
                      className={`${styles.recentOffers_card} myOffers_flex3`}
                    >
                      <div className={styles.recentOffers_card_image}>
                        <img src={domain_img} alt="Domain" />
                      </div>
                      <div className={styles.recentOffers_card_titles}>
                        <p>Product</p>
                        <h5>debugbot.com</h5>
                      </div>
                      <div className={styles.recentOffers_card_details}>
                        <p>My Offer</p>
                        <h6>$5000</h6>
                      </div>
                    </div>
                    <div
                      className={`${styles.recentOffers_card} myOffers_flex3`}
                    >
                      <div class="width_100">
                        <div
                          className={`${styles.recentOffers_card_image} myOffers_offer_image`}
                        >
                          <MyOfferIcon />
                        </div>
                      </div>
                      <div
                        className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                      >
                        <p className="expiry_soon">
                          Offer Expiry
                          <span> Soon </span>
                        </p>
                        <h5>Dec 8, 2025</h5>
                      </div>
                      <div
                        className={`${styles.recentOffers_card_details} ${styles.offer_status_cards} ${styles.recentOffers_card_titles}`}
                      >
                        <p>Status</p>
                        <h5
                          className={`${styles.offer_status} ${styles.pending}`}
                        >
                          <FaCircle />
                          Pending
                        </h5>
                      </div>
                    </div>
                    <div
                      className={`${styles.recentOffers_card} ${styles.offer_status_cards} myOffers_flex1`}
                    >
                      {/* <div className={styles.recentOffers_card_titles}>
                        <p>Status</p>
                        <h5
                          className={`${styles.offer_status} ${styles.pending}`}
                        >
                          <FaCircle />
                          Pending
                        </h5>
                      </div> */}
                      <div
                        className={`${styles.recentOffers_card_details} myOffers_icons`}
                      >
                        <div className={styles.svg_wrapper_bg_grey}>
                          <FiMail />
                        </div>
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
                    <div className={styles.extra_column}>
                      <div className={styles.recentOffers_card}>
                        <div className={styles.recentOffers_card_image}>
                          <img src={domain_img}></img>
                        </div>
                        <div className={styles.recentOffers_card_titles}>
                          <p>Select Counter Offer</p>
                          <h5>debugbot.com</h5>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>Save</p>
                          <h6>$5000</h6>
                        </div>
                      </div>
                      <form
                        className={`${styles.offerForm} myOffers_extra_offer_form`}
                        onSubmit={handleSubmit}
                      >
                        <div className={styles.p_relative}>
                          <input
                            type="number"
                            className={styles.offerInput}
                            placeholder="Remake an Offer"
                            min="0"
                          />
                          <span className="remake_offer_icon">
                            <RemakeOfferIcon />
                          </span>
                          <button type="submit" className={styles.submitButton}>
                            <span className={styles.arrow}>&#8594;</span>{" "}
                            {/* Arrow symbol */}
                          </button>
                        </div>
                        <div
                          className={`${styles.ws_flex} ${styles.gap_10} myOffers_extra_column_buttons `}
                        >
                          <button
                            type="button"
                            className={styles.declineButton}
                          >
                            <div className={`svg_white`}>
                              <OfferDecline />
                            </div>
                          </button>
                          <button type="button" className={styles.acceptButton}>
                            <div className={`${styles.small_svg} svg_white `}>
                              <CartIcon />
                            </div>
                          </button>

                          {/* Reset button with delete icon */}
                          {/* <button
                            type="button"
                            className={styles.resetButton}
                            onClick={handleReset}
                          >
                            <DeleteIcon />
                          </button> */}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "declined" && (
            <div>Declined offers content goes here</div>
          )}
          {activeTab === "accepted" && (
            <div>Accepted offers content goes here</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyOffers;
