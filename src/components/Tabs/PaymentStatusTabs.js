import save_draft_icon from './images/edit-profile.png'
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FaCircle, FaPlus, FaTimes } from 'react-icons/fa'; // Import necessary icons
import { FiMail } from 'react-icons/fi';
import styles from './Tabs.module.css'; // Import styles
import mobilestyles from './Tabs.module.mobile.css'
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
// export as pdf start
const handleExportPDF = (paymentStatusData, isSingle = true) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(isSingle ? 'Order Details' : 'All Order Details', 10, 10);

    // Details
    doc.setFontSize(12);

    if (isSingle) {
        // Single Order
        const selectedData = paymentStatusData;
        doc.text(`Product: ${selectedData.product}`, 10, 20);
        doc.text(`Order ID: ${selectedData.orderId}`, 10, 30);
        doc.text(`Total Commission: ${selectedData.commission}`, 10, 40);
        doc.text(`Date: ${selectedData.date}`, 10, 50);
        doc.text(`Status: ${selectedData.status}`, 10, 60);
    } else {
        // All Orders
        paymentStatusData.forEach((item, index) => {
            doc.text(`Product: ${item.product}`, 10, 20 + (index * 60));
            doc.text(`Order ID: ${item.orderId}`, 10, 30 + (index * 60));
            doc.text(`Total Commission: ${item.commission}`, 10, 40 + (index * 60));
            doc.text(`Date: ${item.date}`, 10, 50 + (index * 60));
            doc.text(`Status: ${item.status}`, 10, 60 + (index * 60));
        });
    }

    // Save PDF
    const filename = isSingle ? `${paymentStatusData.product}_Payment_status.pdf` : 'AllPaymentsDetails.pdf';
    doc.save(filename);
};
const paymentStatusData = [
    {
        product: "debugbot.com",
        orderId: "VLX245789",
        commission: "$4850.00",
        date: "Oct 20, 2024",
        status: "Pending"
    },
    {
        product: "anotherproduct.com",
        orderId: "XYZ123456",
        commission: "$3500.00",
        date: "Nov 05, 2024",
        status: "Completed"
    },
    {
        product: "thirdproduct.com",
        orderId: "XYZ123456555",
        commission: "$2500.00",
        date: "Nov 09, 2024",
        status: "Completed"
    }
];
// export as pdf end
const OfferTabs = () => {
    const [activeTab, setActiveTab] = useState('active');

    return (
        <div className={styles.offer_tabs_wrapper}>
            {/* Nav tabs */}
            <div className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.ph_30} ${styles.dashboard_small_margin}`}>
                <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs} `}>
                    <li
                        className={`${activeTab === 'active' ? styles.active : ''} `}
                        onClick={() => setActiveTab('active')}
                    >
                        <div className={styles.svg_wrapper_bg_white}>
                            <PayoutIcon />
                        </div>

                        <label>Payouts</label>
                    </li>
                    <li
                        className={`${activeTab === 'declined' ? styles.active : ''} `}
                        onClick={() => setActiveTab('declined')}
                    >
                        <div className={styles.svg_wrapper_bg_white}>
                            <CommissionIcon />
                        </div>
                        <label>  Commissions</label>

                    </li>
                </ul>
                <div className={`${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}>
                    <div className={styles.offerSorts}>
                        <SortIcon />
                        <label>  Sort</label>

                    </div>
                    {/* <div className={`${styles.offerSorts} ${styles.payment_status_export_all}`}>
                        <ExportIcon />
                        <label>  Export</label>
                    </div> */}
                    <div className={`${styles.offerSorts} ${styles.payment_status_export_all}`} onClick={() => handleExportPDF(paymentStatusData, false)}>
                        <ExportIcon />
                        <label> Export</label>
                    </div>
                </div>

            </div>
            {/* Tab content */}
            <div className={styles.tab_content}>
                {activeTab === 'active' && (
                    <div className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.payment_status_cols} `}>
                        {paymentStatusData.map((item, index) => (
                            <div key={index} className={styles.recentOffers_wrapper}>
                                {/* Offer card */}
                                <div className={`${styles.ws_flex} ${styles.gap_5} ${styles.fd_column}`}>
                                    <div className={styles.recentOffers_card}>
                                        <div className={styles.recentOffers_card_image}>
                                            <img src={domain_img} alt="Domain" />
                                        </div>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Product</p>
                                            <h5>{item.product}</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Order ID</p>
                                            <h5>{item.orderId}</h5>
                                        </div>
                                    </div>
                                    <div className={styles.recentOffers_card}>
                                        <div className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}>
                                            <p className='online'> Total Commission
                                                <FaCircle />
                                            </p>
                                            <h5>{item.commission}</h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <p>Date</p>
                                            <h6>{item.date}</h6>
                                        </div>
                                    </div>
                                    <div className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}>
                                        <div className={styles.recentOffers_card_titles}>
                                            <p>Status</p>
                                            <h5 className={`${styles.offer_status} ${styles.pending}`}>
                                                <FaCircle />
                                                {item.status}
                                            </h5>
                                        </div>
                                        <div className={styles.recentOffers_card_details}>
                                            <div className={`${styles.svg_wrapper_bg_grey} ${styles.export_icon_wrapper}`} onClick={() => handleExportPDF(paymentStatusData[index], true)}>
                                                <ExportIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                )
                }

                {activeTab === 'declined' && <div>Commission offers content goes here</div>}
            </div >
        </div >
    );
};

export default OfferTabs;