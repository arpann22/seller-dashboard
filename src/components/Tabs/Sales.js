// Sales.js
import React, { useState, useRef } from "react";
import styles from "./Tabs.module.css"; // Import styles
import sales_details_icon from './images/sales_details_icon.png'
import domain_img from "./images/chatseek.com.png";
import cust_img from "./images/cust_image.png";
import { FaCircle } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import delete_reset_icon from "./images/delete-reset-icon.png";
import { FaTimes } from "react-icons/fa";
import sort_icon from './images/sort-icon.png'
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
const Sales = () => {
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
    return (

        <>
            <div className={`${styles.offers_tab_recent_offer_wrap} ${styles.dashboard_sales_details}`}>
                <div
                    className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
                >
                    <img src={sales_details_icon} alt="Media Setup Icon" />
                    <h4>Sales Details</h4>
                    <div className={styles.offerSorts}>
                        <img src={sort_icon}></img>
                        Sort
                    </div>
                </div>
                <div>
                    <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className={styles.recentOffers_wrapper}>
                                {/* Offer card */}
                                <div className={`${styles.ws_flex} ${styles.gap_10}`}>
                                    <div className={styles.recentOffers_card}>
                                        <div className={styles.recentOffers_card_image}>
                                            <img src={cust_img} alt="Domain" />
                                        </div>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Customer</p>
                                            <h5>Charles Bedford</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Order ID</p>
                                            <h6>VLX245789</h6>
                                        </div>
                                    </div>
                                    <div className={styles.recentOffers_card}>
                                        {/* <div className={styles.recentOffers_card_image}>
                                            <img src={domain_img} alt="Domain" />
                                        </div> */}
                                        <div
                                            className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                                        >
                                            <p className="online">
                                                Amount

                                            </p>
                                            <h5>4850.00</h5>
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
                                                Pending
                                            </h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            {expanded[index] ? (
                                                <FaTimes onClick={() => toggleExpanded(index)} />
                                            ) : (
                                                <FaPlus onClick={() => toggleExpanded(index)} />
                                            )}

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
                                        <div className={styles.recentOffers_card}>

                                            <div className={styles.recentOffers_card_titles}>
                                                <p>Registrar</p>
                                                <h5>GoDaddy</h5>
                                            </div>
                                            <div className={styles.recentOffers_card_details}>
                                                <p>Expiration Date</p>
                                                <h6>Dec 31, 2024</h6>
                                            </div>
                                        </div>
                                        <div className={styles.recentOffers_card}>
                                            <div className={styles.recentOffers_card_titles}>
                                                <p>Status</p>
                                                <h5
                                                    className={`${styles.offer_status} ${styles.pending}`}
                                                >
                                                    <FaCircle />
                                                    Pending
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    {/* second column */}
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
                                        <div className={styles.recentOffers_card}>

                                            <div className={styles.recentOffers_card_titles}>
                                                <p>Registrar</p>
                                                <h5>GoDaddy</h5>
                                            </div>
                                            <div className={styles.recentOffers_card_details}>
                                                <p>Expiration Date</p>
                                                <h6>Dec 31, 2024</h6>
                                            </div>
                                        </div>
                                        <div className={styles.recentOffers_card}>
                                            <div className={styles.recentOffers_card_titles}>
                                                <p>Status</p>
                                                <h5
                                                    className={`${styles.offer_status} ${styles.pending}`}
                                                >
                                                    <FaCircle />
                                                    Pending
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sales;