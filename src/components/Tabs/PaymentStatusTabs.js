import save_draft_icon from './images/edit-profile.png'
import { useState } from 'react';
import { FaCircle, FaPlus, FaTimes } from 'react-icons/fa'; // Import necessary icons
import { FiMail } from 'react-icons/fi';
import styles from './Tabs.module.css'; // Import styles
import payment_status_icon from './images/payment_status_icon.png'
// import sort_icon from './images/sort-icon.png'
// import export_icon from './images/export_icon.png'
import { ReactComponent as PayoutIcon } from './image/payout.svg';
import { ReactComponent as CommissionIcon } from './image/commissions.svg';
import { ReactComponent as SortIcon } from './image/sort.svg';
import { ReactComponent as ExportIcon } from './image/export.svg';
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

    return (
        <div className={styles.offer_tabs_wrapper}>
            {/* Nav tabs */}
            <div className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.ph_30}`}>
                <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs} `}>
                    <li
                        className={`${activeTab === 'active' ? styles.active : ''} `}
                        onClick={() => setActiveTab('active')}
                    >
                        <div className={styles.svg_wrapper_bg_white}>
                            <PayoutIcon />
                        </div>
                        Payouts
                    </li>
                    <li
                        className={`${activeTab === 'declined' ? styles.active : ''} `}
                        onClick={() => setActiveTab('declined')}
                    >
                        <div className={styles.svg_wrapper_bg_white}>
                            <CommissionIcon />
                        </div>
                        Commissions
                    </li>
                </ul>
                <div className={`${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}>
                    <div className={styles.offerSorts}>
                        <SortIcon />
                        Sort
                    </div>
                    <div className={styles.offerSorts}>
                        <ExportIcon />
                        Export
                    </div>
                </div>

            </div>
            {/* Tab content */}
            <div className={styles.tab_content}>
                {activeTab === 'active' && (
                    <div className={`${styles.ws_flex} ${styles.recent_offers_cols} `}>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className={styles.recentOffers_wrapper}>
                                {/* Offer card */}
                                <div className={`${styles.ws_flex} ${styles.gap_10} `}>
                                    <div className={styles.recentOffers_card}>
                                        <div className={styles.recentOffers_card_image}>
                                            <img src={domain_img} alt="Domain" />
                                        </div>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Product</p>
                                            <h5>debugbot.com</h5>
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
                                        <div className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers} `}>
                                            <p className='online'> Total Commission
                                                <FaCircle />
                                            </p>
                                            <h5>$4850.00</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Date</p>
                                            <h6>Oct 20, 2024</h6>
                                        </div>
                                    </div>
                                    <div className={`${styles.recentOffers_card} ${styles.offer_status_cards} `}>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Status</p>
                                            <h5 className={`${styles.offer_status} ${styles.pending} `}>
                                                <FaCircle />
                                                Pending
                                            </h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <img src={payment_status_icon}></img>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                        }
                    </div >
                )
                }

                {activeTab === 'declined' && <div>Commission offers content goes here</div>}
            </div >
        </div >
    );
};

export default OfferTabs;