// Sales.js
import React, { useState, useRef } from "react";
import styles from "./Tabs.module.css"; // Import styles
import average_sales_icon from './image/average_sales.svg'
import sales_distribution_icon from './image/sales_distribution.svg'
import sales_details_icon from './image/sales_details.svg'
import domain_img from "./images/chatseek.com.png";
import cust_img from "./images/cust_image.png";
import { FaCircle } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import delete_reset_icon from "./images/delete-reset-icon.png";
import { FaTimes } from "react-icons/fa";
import sort_icon from './images/sort-icon.png'
import { HiDotsVertical } from "react-icons/hi";
import { ReactComponent as Sales_status_icon } from './image/sales_status.svg'
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
            {/* sales first col */}
            <div className={`${styles.sales_first_column_wrapper} ${styles.ws_flex} ${styles.gap_20}`}>
                <div>
                    <div
                        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="30 22 30 30"
                            width="28"
                            height="28"
                        >
                            <defs>
                                <linearGradient id="linear-gradient" x1="41.35" y1="31.35" x2="54.65" y2="44.65" gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="#00daf6" />
                                    <stop offset="1" stopColor="#2164ff" />
                                </linearGradient>
                                <filter id="drop-shadow-1" x="0" y="0" width="96" height="96" filterUnits="userSpaceOnUse">
                                    <feOffset dx="0" dy="10" />
                                    <feGaussianBlur result="blur" stdDeviation="13" />
                                    <feFlood floodColor="#0045a2" floodOpacity=".11" />
                                    <feComposite in2="blur" operator="in" />
                                    <feComposite in="SourceGraphic" />
                                </filter>
                            </defs>
                            <path
                                d="M44.95,29.35c-2.78.65-4.95,2.82-5.6,5.6-.47,2.01-.47,4.09,0,6.1.65,2.78,2.82,4.95,5.6,5.6,2.01.47,4.09.47,6.1,0,2.78-.65,4.95-2.82,5.6-5.6.47-2.01.47-4.09,0-6.1-.65-2.78-2.82-4.95-5.6-5.6-2.01-.47-4.09-.47-6.1,0ZM46.48,37.71c.17-.15.28-.25.36-.31l1.03,1.54c.14.21.28.41.41.57.15.17.38.36.71.4s.6-.09.79-.22c.17-.11.36-.28.54-.45l1.73-1.56c.26-.23.28-.63.05-.88-.23-.26-.63-.28-.88-.05l-1.71,1.54c-.17.15-.28.25-.36.31-.06-.08-.14-.2-.27-.39l-.77-1.15c-.14-.21-.28-.41-.41-.57-.16-.17-.38-.36-.71-.4s-.6.09-.79.22c-.17.11-.36.28-.54.45l-1.73,1.56c-.26.23-.28.63-.05.88.23.26.63.28.88.05l1.71-1.54ZM46.84,37.4l1.01,1.51-.75-1.12c-.12-.19-.21-.31-.27-.39Z"
                                style={{ fill: "url(#linear-gradient)", fillRule: "evenodd", filter: "url(#drop-shadow-1)" }}
                            />
                        </svg>

                        <h4>Sales Status</h4>
                        <HiDotsVertical />
                    </div>


                </div>
                <div>
                    <div
                        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
                    >
                        <img src={sales_distribution_icon} alt="Media Setup Icon" />
                        <h4>Sales Distribution</h4>
                        <HiDotsVertical />
                    </div>
                </div>
                <div>
                    <div
                        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
                    >
                        <img src={average_sales_icon} alt="Media Setup Icon" />
                        <h4>Average Sales Analysis</h4>
                        <HiDotsVertical />
                    </div>
                </div>
            </div >
            {/* sales details section */}
            < div className={`${styles.offers_tab_recent_offer_wrap} ${styles.dashboard_sales_details}`
            }>

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
                                        <div className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}>
                                            <p className="online">Amount</p>
                                            <h5>4850.00</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Option</p>
                                            <h6>One-time</h6>
                                        </div>
                                    </div>

                                    <div className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Status</p>
                                            <h5 className={`${styles.offer_status} ${styles.pending}`}>
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
                                    className={`${styles.extra_column_wrapper} ${expanded[index] ? styles.expanded : ''}`}
                                >
                                    <div className={styles.extra_column}>
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
                                                <h5 className={`${styles.offer_status} ${styles.pending}`}>
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
                                                <h5 className={`${styles.offer_status} ${styles.pending}`}>
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
            </div >
        </>
    );
};

export default Sales;