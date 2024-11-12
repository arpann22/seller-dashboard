// import React from "react";
// import styles from "./Tabs.module.css"; // Import styles
// import salesOverviewIcons from "./images/sales-overview.png";
// import totalSalesIcon from "./images/total-sales.png";
// import Orders from "./Orders";

// const TabContent = ({ activeTab, userData, setUserData }) => {
//   switch (activeTab) {
//     case "My Orders":
//       return <Orders userData={userData} />;
//     case "My Offers":
//       return <p>This is the content for My Offers</p>;
//     case "My Auctions":
//       return <p>This is the content for My Auctions</p>;
//     case "My Support":
//       return <p>This is the content for My Support</p>;
//     case "Edit Profile":
//       return <p>This is the content for Edit Profile</p>;
//     case "Sellers Central":
//       return (
//         <>
//           <div
//             className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
//                 }`}
//           >
//             <img src={salesOverviewIcons} alt="Sales Overview Icon" />
//             <h2>Sales Overview</h2>
//           </div>
//           <div className={styles.salesDetails_wrapper}>
//             <div className={styles.single_sales_wrapper}>
//               <div className={styles.single_sales_data}>
//                 <h2 className={styles.m_0}>$205,700</h2>
//                 <p className={styles.m_0}>Total Sales</p>
//               </div>
//               <div className={styles.single_sales_icon}>
//                 <img src={totalSalesIcon}></img>
//               </div>
//             </div>
//             <div className={styles.single_sales_wrapper}>
//               <div className={styles.single_sales_data}>
//                 <h2 className={styles.m_0}>$205,700</h2>
//                 <p className={styles.m_0}>Total Sales</p>
//               </div>
//               <div className={styles.single_sales_icon}>
//                 <img src={totalSalesIcon}></img>
//               </div>
//             </div>
//             <div className={styles.single_sales_wrapper}>
//               <div className={styles.single_sales_data}>
//                 <h2 className={styles.m_0}>$205,700</h2>
//                 <p className={styles.m_0}>Total Sales</p>
//               </div>
//               <div className={styles.single_sales_icon}>
//                 <img src={totalSalesIcon}></img>
//               </div>
//             </div>
//           </div>
//         </>
//       );
//     default:
//       return null;
//   }
// };

// export default TabContent;





// newwwwwww


// TabContent.js
import React from "react";
import styles from "./Tabs.module.css"; // Import styles
import salesOverviewIcons from "./images/sales-overview.png";
import totalSalesIcon from "./images/total-sales.png";
import Orders from "./Orders";
import { ReactComponent as Sales_distribution_icon } from './image/total.svg';
import { ReactComponent as Average_Sales_icon } from './image/monthly.svg';
import { ReactComponent as Total_Orders_icon } from './image/total_orders.svg'
import { ReactComponent as Sales_Overview_icon } from './image/sales_overview.svg'



const TabContent = ({ activeTab, userData, setUserData }) => {
  switch (activeTab) {
    case "My Orders":
      return <Orders userData={userData} />;
    case "My Offers":
      return <div>Content for My Offers</div>;
    // case "My Auctions":
    //   return <div>Content for My Auctions</div>;
    // case "My Support":
    //   return <div>Content for My Support</div>;
    case "Sellers Central":
      return (
        <>
          <div
            className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                    }`}
          >
            <Sales_Overview_icon />
            <h2>Sales Overview</h2>
          </div>
          <div className={styles.salesDetails_wrapper}>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>$205,700</h2>
                <p className={styles.m_0}>Total Sales</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Sales_distribution_icon />
              </div>
            </div>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>$205,700</h2>
                <p className={styles.m_0}>Total Sales</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Average_Sales_icon />
              </div>
            </div>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>$205,700</h2>
                <p className={styles.m_0}>Total Sales</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Total_Orders_icon />
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