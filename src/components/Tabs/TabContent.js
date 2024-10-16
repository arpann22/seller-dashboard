
import React from 'react';
import styles from './Tabs.module.css'; // Import styles
import salesOverviewIcons from './images/sales-overview.png';
import totalSalesIcon from './images/total-sales.png'

const TabContent = ({ activeTab }) => {
    switch (activeTab) {
        case 'My Orders':
            return <p>This is the content for My Orders</p>;
        case 'My Offers':
            return <p>This is the content for My Offers</p>;
        case 'My Auctions':
            return <p>This is the content for My Auctions</p>;
        case 'My Support':
            return <p>This is the content for My Support</p>;
        case 'Edit Profile':
            return <p>This is the content for Edit Profile</p>;
        case 'Sellers Central':
            return (
                <>
                    <div className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                }`}>
                        <img src={salesOverviewIcons} alt="Sales Overview Icon" />
                        <h2>Sales Overview</h2>
                    </div>
                    <div className={styles.salesDetails_wrapper}>
                        <div className={styles.single_sales_wrapper}>
                            <div className={styles.single_sales_data}>
                                <h2 className={styles.m_0}>$205,700</h2>
                                <p className={styles.m_0}>Total Sales</p>
                            </div>
                            <div className={styles.single_sales_icon}>
                                <img src={totalSalesIcon}></img>
                            </div>
                        </div>
                        <div className={styles.single_sales_wrapper}>
                            <div className={styles.single_sales_data}>
                                <h2 className={styles.m_0}>$205,700</h2>
                                <p className={styles.m_0}>Total Sales</p>
                            </div>
                            <div className={styles.single_sales_icon}>
                                <img src={totalSalesIcon}></img>
                            </div>
                        </div>
                        <div className={styles.single_sales_wrapper}>
                            <div className={styles.single_sales_data}>
                                <h2 className={styles.m_0}>$205,700</h2>
                                <p className={styles.m_0}>Total Sales</p>
                            </div>
                            <div className={styles.single_sales_icon}>
                                <img src={totalSalesIcon}></img>
                            </div>
                        </div>

                    </div>
                </>


            );
        default:
            return null;
    }
};
export default TabContent;