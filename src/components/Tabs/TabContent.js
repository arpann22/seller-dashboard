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
import { c } from "locutus";

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
  // tabs for sellercentral years months

  // tabs for sellercentral end
  const [selectedTab, setSelectedTab] = useState("1 m");

  console.log("tabcontent", currentMonthOrders);
  console.log("tabcontents", lastThreeMonthsOrders);
  console.log("tabcontentss", currentYearOrders);
  console.log("tabcontentsss", fiveYearOrders);

  const [prices, setPrices] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  // lastThreeMonthsOrders.map(()=>)
  useEffect(() => {
    function get_order_totals() {
      console.log(selectedTab);
      if (selectedTab == "1 m") {
        const reversedOrders = currentMonthOrders.reverse();
        // Initialize arrays to store extracted prices and days
        const extractedPrices = [];
        const extractedDays = [];

        reversedOrders.forEach((order) => {
          // Extract price
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);
          extractedPrices.push(price);

          // Extract and format day of the month
          const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const dayOfMonth = dateObj.getDate(); // Extracts day of the month (1-31)
            extractedDays.push(dayOfMonth);
          }
        });

        // Map prices to all days of the current month
        const daysInCurrentMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate(); // Get the number of days in the current month

        const dailyPrices = Array(daysInCurrentMonth)
          .fill(null)
          .map((_, i) => {
            const dayIndex = i + 1; // Day of the month (1-31)
            const foundPrice = extractedPrices.find(
              (price, j) => extractedDays[j] === dayIndex
            );
            return foundPrice || 0; // Default to 0 if no price found for the day
          });

        console.log(dailyPrices); // Prices mapped to each day of the current month
        // setPrices(dailyPrices); // Set prices by day
        // setDays(Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)); // Set a

        const all_days = [];
        for (let i = 1; i <= daysInCurrentMonth; i++) {
          all_days.push(i);
        }

        setPrices(dailyPrices);
        setXAxis(all_days);
      }

      if (selectedTab == "3 m") {
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
            return foundPrice || 0;
          });

        // const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so add 1

        // Calculate the last three months dynamically
        const lastThreeMonths = Array.from({ length: 3 }, (_, i) => {
          let month = currentMonth - i; // Subtract i to go back in months
          return month > 0 ? month : month + 12; // Wrap around to previous year if needed
        }).reverse(); // Reverse to make it ascending

        // Map allMonthsPrices to lastThreeMonths
        const lastThreeMonthsPrices = lastThreeMonths.map(
          (month) => allMonthsPrices[month - 1] // Map the month to its index in allMonthsPrices
        );

        setPrices(lastThreeMonthsPrices);
        setXAxis(lastThreeMonths);

        // console.log("prices", lastThreeMonthsPrices);
        // console.log("lasts Three", lastThreeMonths);
        // setMonths(Array.from({ length: 12 }, (_, i) => i + 1));
      }

      if (selectedTab == "1 y") {
        // Reverse the orders to ensure correct chronological order
        // const reversedOrders = [...lastThreeMonthsOrders].reverse();
        const reversedOrders = currentYearOrders.reverse();
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
            return foundPrice || 0;
          });

        // const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so add 1

        // Calculate the last three months dynamically
        const lastThreeMonths = Array.from({ length: 3 }, (_, i) => {
          let month = currentMonth - i; // Subtract i to go back in months
          return month > 0 ? month : month + 12; // Wrap around to previous year if needed
        }).reverse(); // Reverse to make it ascending

        // Map allMonthsPrices to lastThreeMonths
        const lastThreeMonthsPrices = lastThreeMonths.map(
          (month) => allMonthsPrices[month - 1] // Map the month to its index in allMonthsPrices
        );

        // setPrices(lastThreeMonthsPrices);
        // setXAxis(lastThreeMonths);
      }

      // Update states with the extracted values
      // setPrices(extractedPrices);
      // setMonths(extractedMonths);
    }
    if (lastThreeMonthsOrders.length > 0) {
      get_order_totals();
    }
  }, [lastThreeMonthsOrders, selectedTab]);
  useEffect(() => {
    console.log("Prices:", prices);
    // console.log("Months:", months);
  }, [prices]);

  // chart tab starts
  const timePeriodTabs = [
    {
      label: "1 m",
      title: "Line Chart for 1 Month",
      xAxis: xAxis,
      data: prices,
    },
    {
      label: "3 m",
      title: "Line Chart for 3 Months",
      xAxis: xAxis,
      data: prices,
    },
    {
      label: "1 y",
      title: "Line Chart for 1 Year",
      xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      data: [3, -2.5, 4, -6, 2.5, 7],
    },
    {
      label: "5 y",
      title: "Line Chart for 5 Years",
      xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      data: [5, -1, 6.5, -8, 3, 9],
    },
    {
      label: "Max",
      title: "Line Chart for Max Time Period",
      xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      data: [6, -0.5, 7, -9.5, 4, 10],
    },
  ];

  const handleTabClick = (tabLabel) => {
    setSelectedTab(tabLabel);
  };

  const selectedTabData = timePeriodTabs.find(
    (tab) => tab.label === selectedTab
  );
  // chart tab ends

  const currentMonth = new Date().getMonth() + 1;

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
            className={`${styles.sales_distribution_chart_wrapper} ${styles.sellerCentralGraphTabsWrapper}`}
          >
            {/* Tab Navigation */}
            <div className={styles.sales_distribution_tab_labels}>
              {timePeriodTabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`${styles.tabButton} ${
                    selectedTab === tab.label ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick(tab.label)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Line Chart for the Selected Tab */}
            <div
              className={`${styles.sales_overview_graph} ${styles.sales_graph_svg} sales_overview_graph`}
            >
              <LineChart
                xAxis={[{ data: selectedTabData.xAxis }]} // Replace with dynamic data if needed
                series={[
                  {
                    data: selectedTabData.data,
                    // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 14999, 0, 15700],
                    area: true,
                    baseline: "min",
                    color: "rgb(197, 235, 240)",
                  },
                ]}
                width={800}
                height={500}
              />
            </div>
          </div>
          {/* <div
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
          </div> */}
        </>
      );
    default:
      return null;
  }
};

export default TabContent;
