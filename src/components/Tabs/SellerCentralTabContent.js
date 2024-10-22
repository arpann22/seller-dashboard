import React, { useState, useRef } from "react";
// import React from 'react';
import styles from "./Tabs.module.css"; // Import styles
import cardstyles from "../CardSelector/CardSelector.module.css";
import addDomaintitleImage from "./images/add-domain-pre-image.png";
import mediaSetupIcon from "./images/media_setup_icon.png";
import attachAudioimg from "./images/attach_audio_img.png";
import domain_img from "./images/chatseek.com.png";
import add_product_icon from "./images/add_product.png";
import save_draft_icon from "./images/save_draft.png";
import { FaPlay } from "react-icons/fa";
import { IoIosPause } from "react-icons/io";
import profileImage from "./images/profile.jpg";
import { RxCrossCircled } from "react-icons/rx";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdInformationCircle } from "react-icons/io";
import domainAppraisalHeadingImage from "./images/domain_appraisal_heading_image.png";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import CardSelector from "../CardSelector/CardSelector.js";
import { FaTimes } from "react-icons/fa"; // Import necessary icons
// import categories_icon from './images.categories-icon.png';
import categories_icon from "./images/categories-icon.png";
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

const cardItems = [
  { title: "Card 1", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 2", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
];
const industryItems = [
  { title: "Industry 1", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 2", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
  { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
];
const tagsItems = [
  { title: "Modern", subtitle: "AI-PICK" },
  { title: "Online Marketplace", subtitle: "AI-PICK" },
  { title: "Marketing", subtitle: "AI-PICK" },
  { title: "Community", subtitle: "AI-PICK" },
  { title: "Online Marketplace", subtitle: "AI-PICK" },
  { title: "Marketing", subtitle: "AI-PICK" },
  { title: "Community", subtitle: "AI-PICK" },
];
const SellerCentralTabContent = ({ activeInnerTab, userData }) => {
  const [isSalePriceEnabled, setIsSalePriceEnabled] = useState(false);
  const [isLeaseToOwnEnabled, setLeaseToOwnEnabled] = useState(false);
  const [isAcceptOffersEnabled, setAcceptOffersEnabled] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded
  const [selectedCard, setSelectedCard] = useState(null);
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
  const handleToggle = () => {
    setIsSalePriceEnabled(!isSalePriceEnabled);
  };
  const handleLeaseToOwnToggle = () => {
    setLeaseToOwnEnabled((prevState) => !prevState);
  };

  const handleAcceptOffersToggle = () => {
    setAcceptOffersEnabled((prevState) => !prevState);
  };
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  switch (activeInnerTab) {
    case "Add New Domain":
      return (
        <>
          <div
            className={`${styles.add_domain_wrapper} ${styles.dashboard_section_margin}`}
          >
            <img src={addDomaintitleImage} alt="stars" />
            <h2>
              {" "}
              Add New <span>Domain</span>
            </h2>
            <p>
              Get a detailed domain breakdown, ranking insights, estimate, and
              even audio pronunciations – all in one go!
            </p>
            <div
              className={`${styles.add_domain_generate_field} ${styles.p_relative}`}
            >
              <input type="text"></input>
              <input type="submit" value="Generate"></input>
            </div>
          </div>
          <div
            className={`${styles.add_domain_media_setup_wrapper} ${styles.dashboard_section_margin}`}
          >
            <div
              className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Media Setup</h4>
            </div>
            <div
              className={`${styles.mediaSetupCardsWrapper} ${styles.ws_flex}`}
            >
              {/* first card */}
              <div className={styles.media_content_wrapper}>
                <img
                  src={attachAudioimg}
                  alt="attach audio image"
                  className={styles.media_image}
                />
                <div className={styles.media_setup_contents_footer}>
                  <div className={styles.text_column}>
                    <h5>Your Heading Here</h5>
                    <p>Your paragraph content here.</p>
                  </div>

                  <div className={styles.audio_column}>
                    <input type="file" accept="audio/*" />
                  </div>
                </div>
              </div>
              {/* second card */}
              <div
                className={`${styles.media_content_wrapper} ${styles.media_setup_second_card}`}
              >
                <div className={`${styles.pronounc_add} ${styles.active}`}>
                  <FaPlay />
                  <div>
                    <h5>James</h5>
                    <p>0.01</p>
                  </div>
                  <span>AI-PICK</span>
                  <img src={profileImage}></img>
                  <RxCrossCircled />
                </div>
                <div className={styles.pronounc_add}>
                  <IoIosPause />
                  <div>
                    <h5>James</h5>
                    <p>0.01</p>
                  </div>
                  <span>AI-PICK</span>
                  <img src={profileImage}></img>
                  <FiPlusCircle />
                </div>
                <div className={styles.media_setup_contents_footer}>
                  <div className={styles.text_column}>
                    <h5>Your Heading Here</h5>
                    <p>Your paragraph content here.</p>
                  </div>

                  <div className={styles.audio_column}>
                    <input type="file" accept="audio/*" />
                  </div>
                </div>
              </div>
              {/* third card */}
              <div
                className={`${styles.media_content_wrapper} ${styles.media_card_no_padding}`}
              >
                <img
                  src={domain_img}
                  alt="attach audio image"
                  className={styles.media_image}
                />
                <div className={styles.media_setup_contents_footer}>
                  <div className={styles.text_column}>
                    <h5>Your Heading Here</h5>
                    <p>Your paragraph content here.</p>
                  </div>

                  <div className={styles.audio_column}>
                    <input type="file" accept="audio/*" />
                  </div>
                </div>
              </div>
              {/* fourth card */}
              <div
                className={`${styles.media_content_wrapper} ${styles.media_card_no_padding} ${styles.media_setup_last_card}`}
              >
                {/* <img src={media_setup_last_card} alt="attach audio image" className={styles.media_image} /> */}
                <div className={styles.media_setup_contents_footer}>
                  <h5>
                    Get Your <span>FREE </span> Custom Logo in Just 72 Hours!
                  </h5>

                  <a href="#">Get Started</a>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Appraisal */}
          <div
            className={`${styles.dashboard_domain_setup_wrapper} ${styles.ws_flex}`}
          >
            <div
              className={`${styles.domain_appraisal_wrapper} ${styles.dashboard_section_margin}`}
            >
              <div
                className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <img src={mediaSetupIcon} alt="Media Setup Icon" />
                <h4>Domain Appraisal</h4>
                <IoMdInformationCircle />
              </div>
              <div className={styles.domain_appraisal_inner_wrapper}>
                <div
                  className={`${styles.domain_appraisal_inner_wrapper_heading} ${styles.ws_flex}`}
                >
                  <div>
                    <h2>petrunner.com</h2>
                    <h5>Estimated Value</h5>
                    <h3>
                      $15,000 <span>USD</span>
                    </h3>
                    <p>
                      <span>Calculated By AI</span>Using hundreds of predictive
                      data points.
                    </p>
                  </div>
                  <div>
                    <img src={domainAppraisalHeadingImage}></img>
                  </div>
                </div>
                <div className={styles.domain_appraisal_body_wrapper}>
                  <div className={styles.domain_appraisal_body_cards}>
                    <div className={styles.domain_appraisal_body_card}>
                      <h5>Page Trust Score</h5>
                      <p>64</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* pricing setup */}
            {/* Pricing Setup Section */}
            <div
              className={`${styles.pricing_setup_wrapper} ${styles.dashboard_section_margin}`}
            >
              <div
                className={`${styles.price_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <img src={mediaSetupIcon} alt="Media Setup Icon" />
                <h4>Pricing Setup</h4>
                <IoMdInformationCircle />
              </div>

              {/* Regular Price Input */}
              <div
                className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column} ${styles.gap_10}`}
              >
                <label htmlFor="regularPrice">Regular Price*</label>
                <input
                  type="number"
                  id="regularPrice"
                  className={styles.input_field}
                  placeholder="Enter regular price"
                  min="0" // Prevent negative values
                />
              </div>

              {/* Sale Price Input with Toggle */}
              <div
                className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column} `}
              >
                <div
                  className={`${styles.ws_flex} ${styles.salePrice_heading_wrapper}`}
                >
                  <div>
                    <label htmlFor="salePrice">Sale Price</label>
                    <p className={styles.subtitle}>
                      Set your Sale Price for a Limited Time
                    </p>
                  </div>
                  <div className={styles.toggle_button} onClick={handleToggle}>
                    <div
                      className={`${styles.toggle_switch} ${
                        isSalePriceEnabled ? styles.on : styles.off
                      }`}
                    >
                      <div className={styles.toggle_indicator}>
                        <RxCross2 />
                        <IoCheckmarkOutline />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.sale_price_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
                >
                  <input
                    type="number"
                    id="salePrice"
                    className={styles.input_field}
                    placeholder="Enter sale price"
                    min="0" // Prevent negative values
                    disabled={!isSalePriceEnabled}
                  />
                </div>
                {/* Date Input Fields */}
                <div
                  className={`${styles.date_fields_wrapper} ${styles.ws_flex} ${styles.gap_10}`}
                >
                  <div className={`${styles.date_field} ${styles.flex_column}`}>
                    <label htmlFor="startSale">Start Sale</label>
                    <input
                      type="date"
                      id="startSale"
                      className={styles.input_field}
                    />
                  </div>
                  <div className={`${styles.date_field} ${styles.flex_column}`}>
                    <label htmlFor="endSale">End Sale</label>
                    <input
                      type="date"
                      id="endSale"
                      className={styles.input_field}
                    />
                  </div>
                </div>
              </div>
              {/* Lease-To-Own Section */}
              <div
                className={`${styles.toggle_section} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <div>
                  <h4>Lease-To-Own</h4>
                  <p className={styles.subtitle}>
                    Flexible Payment Option to Attract Buyers.
                  </p>
                </div>
                <div
                  className={styles.toggle_button}
                  onClick={handleLeaseToOwnToggle}
                >
                  <div
                    className={`${styles.toggle_switch} ${
                      isLeaseToOwnEnabled ? styles.on : styles.off
                    }`}
                  >
                    <div className={styles.toggle_indicator}>
                      <RxCross2 />
                      <IoCheckmarkOutline />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flexible Payment Section */}
              <div
                className={`${styles.toggle_section} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                <div>
                  <h4>Accept Offers</h4>
                  <p className={styles.subtitle}>Let Buyers Name Their</p>
                </div>
                <div
                  className={styles.toggle_button}
                  onClick={handleAcceptOffersToggle}
                >
                  <div
                    className={`${styles.toggle_switch} ${
                      isAcceptOffersEnabled ? styles.on : styles.off
                    }`}
                  >
                    <div className={styles.toggle_indicator}>
                      <RxCross2 />
                      <IoCheckmarkOutline />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* categories */}
          <div className={`${styles.cardSelectorWrapper}`}>
            <div
              className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Categories</h4>
            </div>

            <CardSelector items={cardItems} />
          </div>

          {/* domain description */}
          <div
            className={`${styles.cardSelectorWrapper} ${styles.dashboard_section_margin}`}
          >
            <h3>Domain Description</h3>
            <div
              className={`${cardstyles.tags_card_title_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Tags</h4>
            </div>
            <div className={cardstyles.description_tags_wrapper}>
              <CardSelector items={tagsItems} />
            </div>
          </div>

          {/* industries */}
          <div className={`${styles.cardSelectorWrapper}`}>
            <div
              className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <img src={mediaSetupIcon} alt="Media Setup Icon" />
              <h4>Industries</h4>
            </div>

            <CardSelector items={industryItems} />
          </div>

          <div className={styles.save_button_wrappers}>
            <button className={styles.add_product_button}>
              <span className={styles.icon}>
                <img src={add_product_icon} alt="Add Product Icon" />
              </span>
              <span>Add Product</span>
            </button>

            <button className={styles.save_draft_button}>
              <span className={styles.icon}>
                <img src={save_draft_icon} alt="Save Draft Icon" />
              </span>
              <span>Save Draft</span>
            </button>
          </div>
        </>
      );

    case "Dashboard":
      return <p>This is the content for Dashboard</p>;
    case "Sales":
      return <p>This is the content for Sales</p>;
    case "Domains":
      return (
        <>
          <Domains userData={userData} />
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
                  <h3>
                    205,700 <span>USD</span>
                  </h3>
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
                    onChange={() => handleCardSelect(1)} // Handle selection change
                    className={styles.radio_input} // Add a class for styling the radio button
                  />
                  <div className={styles.card_content}>
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
                    value="paypal2"
                    checked={selectedCard === 2}
                    onChange={() => handleCardSelect(2)} // Handle selection change
                    className={styles.radio_input}
                  />
                  <div className={styles.card_content}>
                    <img
                      src={bank_transfer_icon}
                      alt="Paypal Icon"
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
