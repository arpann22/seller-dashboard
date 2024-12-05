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
  maxOrder,
}) => {
  // tabs for sellercentral years months

  // tabs for sellercentral end
  const [selectedTab, setSelectedTab] = useState("1 m");

  console.log("tabcontent", currentMonthOrders);
  console.log("tabcontents", lastThreeMonthsOrders);
  console.log("tabcontentss", currentYearOrders);
  console.log("tabcontentsss", fiveYearOrders);
  console.log("max", maxOrder);

  const [prices, setPrices] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [xAxis, setXAxis] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const [yAxis, setYAxis] = useState({ min: 0, max: 12 }); // Default y-axis values
  // const yAxis:
  // lastThreeMonthsOrders.map(()=>)
  useEffect(() => {
    function get_order_totals() {
      if (selectedTab == "1 m") {
        if (currentMonthOrders.length == 0) {
          setPrices([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setXAxis([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          setYAxis({ min: 0, max: 12 });
          return;
        }
        const reversedOrders = currentMonthOrders.reverse();

        // Initialize an object to store daily totals
        const dayPriceMap = {};

        reversedOrders.forEach((order) => {
          // Extract price
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);

          // Extract and format day of the month
          const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const dayOfMonth = dateObj.getDate(); // Extracts day of the month (1-31)

            // Accumulate prices for the same day
            if (!dayPriceMap[dayOfMonth]) {
              dayPriceMap[dayOfMonth] = 0; // Initialize if not present
            }
            dayPriceMap[dayOfMonth] += price; // Add the price to the day's total
          }
        });

        // Get the number of days in the current month
        const daysInCurrentMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate(); // e.g., 31 for December

        // Map prices to all days of the current month
        const dailyPrices = Array.from(
          { length: daysInCurrentMonth },
          (_, i) => {
            const dayIndex = i + 1; // Day of the month (1-31)
            return dayPriceMap[dayIndex] || 0; // Default to 0 if no price found for the day
          }
        );

        // Generate the X-axis labels (days of the month)
        const all_days = Array.from(
          { length: daysInCurrentMonth },
          (_, i) => i + 1
        );

        // Set the results
        setPrices(dailyPrices); // Set aggregated prices by day
        setXAxis(all_days); // Set X-axis labels
        // Reset the yAxis if needed
        setYAxis({ min: 0, max: Math.max(...dailyPrices) + 500 }); // Dynamically set max based on data
      }

      if (selectedTab == "3 m") {
        // Reverse the orders to ensure correct chronological order
        // const reversedOrders = [...lastThreeMonthsOrders].reverse();
        if (lastThreeMonthsOrders.length == 0) {
          setPrices([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setXAxis([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          setYAxis({ min: 0, max: 12 });
          return;
        }
        const reversedOrders = lastThreeMonthsOrders.reverse();
        // Initialize an object to store month-wise totals
        const monthPriceMap = {};

        reversedOrders.forEach((order) => {
          // Extract price
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);

          // Extract and format date as a numeric month
          const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const numericMonth = dateObj.getMonth() + 1; // 1 = Jan, 2 = Feb, ...

            // Accumulate prices for the same month
            if (!monthPriceMap[numericMonth]) {
              monthPriceMap[numericMonth] = 0; // Initialize if not present
            }
            monthPriceMap[numericMonth] += price; // Add the price to the month's total
          }
        });

        // Calculate the last three months dynamically
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so add 1
        const lastThreeMonths = Array.from({ length: 3 }, (_, i) => {
          let month = currentMonth - i; // Subtract i to go back in months
          return month > 0 ? month : month + 12; // Wrap around to previous year if needed
        }).reverse(); // Reverse to make it ascending

        // Map monthPriceMap to lastThreeMonths
        const lastThreeMonthsPrices = lastThreeMonths.map(
          (month) => monthPriceMap[month] || 0 // Default to 0 if no data for the month
        );
        // Update the state
        setPrices(lastThreeMonthsPrices);
        setXAxis(lastThreeMonths);
        // Reset the yAxis if needed
        setYAxis({ min: 0, max: Math.max(...lastThreeMonthsPrices) + 500 }); // Dynamically set max based on data
      }

      if (selectedTab == "1 y") {
        // Reverse the orders to ensure correct chronological order
        // const reversedOrders = [...lastThreeMonthsOrders].reverse();
        if (currentYearOrders.length == 0) {
          setPrices([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setXAxis([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          setYAxis({ min: 0, max: 12 });
          return;
        }
        const reversedOrders = currentYearOrders.reverse();

        // Calculate the current month and initialize the X-axis
        const currentMonth = new Date().getMonth() + 1; // 1 = Jan, ..., 12 = Dec
        // console.log("current month", currentMonth);
        // const currentMonth = 2; // 1 = Jan, ..., 12 = Dec

        // Create the X-axis starting from last year's same month
        const xAxis = Array.from({ length: 12 }, (_, i) => {
          let month = currentMonth - i; // Subtract i to go back in months

          // Ensure the month is between 1 and 12
          if (month <= 0) {
            month += 12; // If month is <= 0, wrap it around to the correct month in the previous year
          }
          return month;
        }).reverse(); // Reverse to keep months in chronological order

        // Initialize an object to store month-wise totals
        const monthPriceMap = {};

        reversedOrders.forEach((order) => {
          // Extract price
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);

          // Extract and format date as a numeric month
          const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const numericMonth = dateObj.getMonth() + 1; // 1 = Jan, ..., 12 = Dec

            // Accumulate prices for the same month
            if (!monthPriceMap[numericMonth]) {
              monthPriceMap[numericMonth] = 0; // Initialize if not present
            }
            monthPriceMap[numericMonth] += price; // Add the price to the month's total
          }
        });

        // Map prices for the past 12 months based on the calculated X-axis
        const allMonthsPrices = xAxis.map((month) => monthPriceMap[month] || 0); // Default to 0 if no data for the month
        console.log("xais", xAxis);
        console.log("xais", allMonthsPrices);
        // Set X-axis and prices
        setXAxis(xAxis); // Update X-axis with the past 12 months
        setPrices(allMonthsPrices); // Update prices with monthly totals
        setYAxis({ min: 0, max: Math.max(...allMonthsPrices) + 500 }); // Dynamically set max based on data
        // setXAxis(lastThreeMonths);
      }

      if (selectedTab == "5 y") {
        // Reverse the orders to ensure correct chronological order
        // const reversedOrders = [...lastThreeMonthsOrders].reverse();

        // Reverse orders to process them from oldest to newest
        if (fiveYearOrders.length == 0) {
          setPrices([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setXAxis([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          setYAxis({ min: 0, max: 12 });
          return;
        }
        const reversedOrders = fiveYearOrders.reverse();

        // Initialize an object to store year-wise totals
        const yearPriceMap = {};

        reversedOrders.forEach((order) => {
          // Extract price
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);

          // Extract and format date as a numeric year
          const dateCreated = order?.meta?._date_created?.[0]; // Example: "2024-12-16T13:54"
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const numericYear = dateObj.getFullYear(); // Extract year

            // Accumulate prices for the same year
            if (!yearPriceMap[numericYear]) {
              yearPriceMap[numericYear] = 0; // Initialize if not present
            }
            yearPriceMap[numericYear] += price; // Add the price to the year's total
          }
        });

        // Get the last 5 years dynamically
        const currentYear = new Date().getFullYear();
        const lastFiveYears = Array.from(
          { length: 5 },
          (_, i) => currentYear - i
        ).reverse(); // e.g., [2020, 2021, 2022, 2023, 2024]

        // Map prices to the last 5 years with totals
        const lastFiveYearsPrices = lastFiveYears.map(
          (year) => yearPriceMap[year] || 0
        ); // Default to 0 if no data for the year

        setXAxis(lastFiveYears); // Update X-axis with the last 5 years
        setPrices(lastFiveYearsPrices); // Update prices with the last 5 years' totals
        setYAxis({ min: 0, max: Math.max(...lastFiveYearsPrices) + 500 }); // Dynamically set max based on data
        // setXAxis(lastFiveYears); // Update X-axis with the last 5 years
        // setPrices(lastFiveYearsPrices); // Update prices with the last 5 years' prices

        // setXAxis(lastThreeMonths);
      }
      if (selectedTab == "Max") {
        // Reverse the orders to ensure correct chronological order
        // Reverse orders to process them from oldest to newest
        if (maxOrder.length == 0) {
          setPrices([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setXAxis([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
          setYAxis({ min: 0, max: 12 });
          return;
        }
        const reversedOrders = maxOrder.reverse();
        // Initialize an object to store year-wise totals
        const yearPriceMap = {};

        reversedOrders.forEach((order) => {
          const price =
            order?.meta?._currency?.[0] === "USD"
              ? parseInt(order?.meta?._order_total?.[0])
              : parseInt(order?.meta?._usd_total?.[0]);

          const dateCreated = order?.meta?._date_created?.[0];
          if (dateCreated) {
            const dateObj = new Date(dateCreated);
            const numericYear = dateObj.getFullYear();

            if (!yearPriceMap[numericYear]) {
              yearPriceMap[numericYear] = 0;
            }
            yearPriceMap[numericYear] += price;
          }
        });

        // Get all available years dynamically
        const allYears = Object.keys(yearPriceMap)
          .map(Number)
          .sort((a, b) => a - b);

        // Get min and max year
        const minYear = Math.min(...allYears);
        const maxYear = Math.max(...allYears);

        // Add two years before the min and after the max
        const extendedYears = [
          minYear - 2,
          minYear - 1,
          ...allYears,
          maxYear + 1,
          maxYear + 2,
        ];

        // Map prices to extended years
        const extendedYearsPrices = extendedYears.map(
          (year) => yearPriceMap[year] || 0
        );
        setXAxis(extendedYears); // Update X-axis with extended years
        setPrices(extendedYearsPrices); // Update prices with totals
        setYAxis({ min: 0, max: Math.max(...extendedYearsPrices) + 500 }); // Dynamically set max based on data
      }
    }
    // if (lastThreeMonthsOrders.length > 0) {
    get_order_totals();
    // }
  }, [lastThreeMonthsOrders, selectedTab]);
  useEffect(() => {
    console.log("Prices:", prices);
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
      xAxis: xAxis,
      data: prices,
    },
    {
      label: "5 y",
      title: "Line Chart for 5 Years",
      xAxis: xAxis,
      data: prices,
    },
    {
      label: "Max",
      title: "Line Chart for Max Time Period",
      // xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      xAxis: xAxis,
      data: prices,
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
                xAxis={[
                  {
                    scaleType: "point",
                    data: selectedTabData.xAxis,
                    valueFormatter: (value) => Math.round(value).toString(), // This will convert to integer
                    tickMinStep: 1, // Ensures whole number steps
                    tickMaxStep: 1, // Prevents intermediate decimal ticks
                  },
                ]} // Replace with dynamic data if needed
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
                yAxis={[yAxis]}
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
