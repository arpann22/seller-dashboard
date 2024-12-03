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
import React, { useEffect, useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
import salesOverviewIcons from "./images/sales-overview.png";
import totalSalesIcon from "./images/total-sales.png";
import Orders from "./Orders";
import { ReactComponent as Sales_distribution_icon } from "./image/total.svg";
import { ReactComponent as Average_Sales_icon } from "./image/monthly.svg";
import { ReactComponent as Total_Orders_icon } from "./image/total_orders.svg";
import { ReactComponent as Sales_Overview_icon } from "./image/sales_overview.svg";

import { LineChart } from "@mui/x-charts/LineChart";

const TabContent = ({
  activeTab,
  userData,
  setUserData,
  soldDomains,
  salesAllTime,
  salesCurrentYear,
  orderTotal,
  currentMonthOrders,
  lastThreeMonthsOrders,
  currentYearOrders,
  fiveYearOrders,
}) => {
  console.log("tabcontent", currentMonthOrders);
  console.log("tabcontents", lastThreeMonthsOrders);
  console.log("tabcontentss", currentYearOrders);
  console.log("tabcontentsss", fiveYearOrders);

  const [prices, setPrices] = useState([]);
  const [months, setMonths] = useState([]);
  // lastThreeMonthsOrders.map(()=>)
  useEffect(() => {
    function get_order_totals() {
      // Reverse the orders to ensure correct chronological order
      // const reversedOrders = [...lastThreeMonthsOrders].reverse();
      const reversedOrders = lastThreeMonthsOrders.reverse();
      // Initialize arrays to store extracted prices and months
      const extractedPrices = [];
      const extractedMonths = [];

      reversedOrders.forEach((order) => {
        // Extract price
        const price =
          order?.meta?._currency?.[0] === "USD"
            ? parseInt(order?.meta?._order_total?.[0])
            : parseInt(order?.meta?._usd_total?.[0]);
        extractedPrices.push(price);

        // Extract and format date as a numeric value
        const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
        if (dateCreated) {
          const dateObj = new Date(dateCreated);
          const numericMonth = dateObj.getMonth() + 1; // 1 = Jan, 2 = Feb, ...
          extractedMonths.push(numericMonth);
          // const year = dateObj.getFullYear();
          // extractedMonths.push(`${numericMonth}/${year}`); // e.g., "1/2024"
        }
      });

      // Map prices to all 12 months
      const allMonthsPrices = Array(12)
        .fill(null)
        .map((_, i) => {
          const monthIndex = i + 1;
          const foundPrice = extractedPrices.find(
            (price, j) => extractedMonths[j] === monthIndex
          );
          return foundPrice || null;
        });

      setPrices(allMonthsPrices);
      setMonths(Array.from({ length: 12 }, (_, i) => i + 1));
      // Update states with the extracted values
      // setPrices(extractedPrices);
      // setMonths(extractedMonths);
    }
    if (lastThreeMonthsOrders.length > 0) {
      get_order_totals();
    }
  }, [lastThreeMonthsOrders]);
  useEffect(() => {
    console.log("Prices:", prices);
    console.log("Months:", months);
  }, [prices, months]);
  const currentMonth = new Date().getMonth();

  var average_monthly_sales = salesCurrentYear / currentMonth;

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
          {console.log("prices", prices)}
          <div
            className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                    }`}
          >
            <div className={styles.small_svg}>
              <Sales_Overview_icon />
            </div>
            <h2>Sales Overview</h2>
          </div>
          <div className={`${styles.salesDetails_wrapper} ${styles.fd_column}`}>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>
                  ${salesAllTime ? salesAllTime : "0"}
                </h2>
                <p className={styles.m_0}>Total Sales</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Sales_distribution_icon />
              </div>
            </div>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>
                  $
                  {average_monthly_sales
                    ? average_monthly_sales.toFixed(2)
                    : "0"}
                </h2>
                <p className={styles.m_0}>Average Monthly Sales</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Average_Sales_icon />
              </div>
            </div>
            <div className={styles.single_sales_wrapper}>
              <div className={styles.single_sales_data}>
                <h2 className={styles.m_0}>${orderTotal ? orderTotal : "0"}</h2>
                <p className={styles.m_0}>Total Orders</p>
              </div>
              <div className={styles.single_sales_icon}>
                <Total_Orders_icon />
              </div>
            </div>
          </div>
          <div
            className={`${styles.sales_overview_graph} ${styles.sales_graph_svg} sales_overview_graph`}
          >
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              // xAxis={[{ data: months }]}
              series={[
                {
                  data: [2, -5.5, 2, -7.5, 1.5, 6],
                  // data: prices,
                  area: true,
                  baseline: "min",
                  color: "rgb(197, 235, 240)",
                },
              ]}
              width={800}
              height={500}
            />
          </div>
        </>
      );
    default:
      return null;
  }
};

export default TabContent;
