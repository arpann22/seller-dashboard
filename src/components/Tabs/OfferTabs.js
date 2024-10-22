import save_draft_icon from './images/edit-profile.png'
import { useState } from 'react';
import { FaCircle, FaPlus, FaTimes } from 'react-icons/fa'; // Import necessary icons
import { FiMail } from 'react-icons/fi';
import styles from './Tabs.module.css'; // Import styles
import delete_reset_icon from './images/delete-reset-icon.png'
import sort_icon from './images/sort-icon.png'

import domain_img from './images/chatseek.com.png'
const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the input value submission here
};
const handleReset = () => {
    // Reset the input field
    const inputField = document.querySelector(`.${styles.offerInput}`);
    if (inputField) {
        inputField.value = '';
    }
    // You can add more logic if needed, such as resetting state or other form elements
};
const OfferTabs = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [expanded, setExpanded] = useState({}); // Track which card is expanded

    // Function to toggle the expanded state for each card
    const toggleExpanded = (index) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [index]: !prevExpanded[index], // Toggle visibility
        }));
    };

    return (
        <div className={styles.offer_tabs_wrapper}>
            {/* Nav tabs */}
            <div className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.ph_30}`}>
                <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs}`}>
                    <li
                        className={`${activeTab === 'active' ? styles.active : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} />
                        Active
                    </li>
                    <li
                        className={`${activeTab === 'declined' ? styles.active : ''}`}
                        onClick={() => setActiveTab('declined')}
                    >
                        <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} />
                        Declined
                    </li>
                </ul>
                <div className={styles.offerSorts}>
                    <img src={sort_icon}></img>
                    Sort
                </div>
            </div>
            {/* Tab content */}
            <div className={styles.tab_content}>
                {activeTab === 'active' && (
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
                                        <div className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}>
                                            <p className='online'>Customer Online
                                                <FaCircle />
                                            </p>
                                            <h5>Charles Bedford</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Offer Expiry</p>
                                            <h6>Oct 20, 2024</h6>
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
                                            <FiMail />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded content as a new column below */}
                                <div className={`${styles.extra_column_wrapper} ${expanded[index] ? styles.expanded : ''}`}>
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
                                        <form className={styles.offerForm} onSubmit={handleSubmit}>
                                            <div className={styles.p_relative}>
                                                <input
                                                    type="number"
                                                    className={styles.offerInput}
                                                    placeholder="Enter your counter offer"
                                                    min="0"
                                                />
                                                <button type="submit" className={styles.submitButton}>
                                                    <span className={styles.arrow}>&#8594;</span> {/* Arrow symbol */}
                                                </button>
                                            </div>
                                            <div className={`${styles.ws_flex} ${styles.gap_10}`}>
                                                <button type="button" className={styles.acceptButton}>Accept</button>
                                                <button type="button" className={styles.declineButton}>Decline</button>

                                                {/* Reset button with delete icon */}
                                                <button type="button" className={styles.resetButton} onClick={handleReset}>
                                                    <img src={delete_reset_icon} />
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        ))
                        }
                    </div >
                )
                }

                {activeTab === 'declined' && <div>Declined offers content goes here</div>}
            </div >
        </div >
    );
};

export default OfferTabs;