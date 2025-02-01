import save_draft_icon from "./images/edit-profile.png";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { FaCircle, FaPlus, FaSpinner, FaTimes } from "react-icons/fa"; // Import necessary icons
import { FiMail } from "react-icons/fi";
import styles from "./Tabs.module.css"; // Import styles
import mobilestyles from "./Tabs.module.mobile.css";
import payment_status_icon from "./images/payment_status_icon.png";
// import sort_icon from './images/sort-icon.png'
// import export_icon from './images/export_icon.png'
import { ReactComponent as PayoutIcon } from "./image/payout.svg";
import { ReactComponent as CommissionIcon } from "./image/commissions.svg";
import { ReactComponent as SortIcon } from "./image/sort.svg";
import { ReactComponent as ExportIcon } from "./image/export.svg";
import domain_img from "./images/chatseek.com.png";

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
  // You can add more logic if needed, such as resetting state or other form elements
};
// export as pdf start
const handleExportPDF = (paymentStatusData, isSingle = true) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text(isSingle ? "Order Details" : "All Order Details", 10, 10);

  // Details
  doc.setFontSize(12);

  console.log("paymentStatusData", paymentStatusData);
  if (isSingle) {
    // Single Order
    const selectedData = paymentStatusData;
    doc.text(`Product: ${selectedData.domain_title}`, 10, 20);
    doc.text(`Order ID: ${selectedData.order_id}`, 10, 30);
    doc.text(`Total Commission: ${selectedData.amount}`, 10, 40);
    doc.text(`Date: ${selectedData.created_at}`, 10, 50);
    doc.text(`Status: ${selectedData.status}`, 10, 60);
  } else {
    // All Orders
    paymentStatusData.forEach((item, index) => {
      doc.text(`Product: ${item.product}`, 10, 20 + index * 60);
      doc.text(`Order ID: ${item.orderId}`, 10, 30 + index * 60);
      doc.text(`Total Commission: ${item.commission}`, 10, 40 + index * 60);
      doc.text(`Date: ${item.date}`, 10, 50 + index * 60);
      doc.text(`Status: ${item.status}`, 10, 60 + index * 60);
    });
  }

  // Save PDF
  const filename = isSingle
    ? `${paymentStatusData.domain_title}_Payment_status.pdf`
    : "AllPaymentsDetails.pdf";
  doc.save(filename);
};
// const paymentStatusData = [
//   {
//     product: "debugbot.com",
//     orderId: "VLX245789",
//     commission: "$4850.00",
//     date: "Oct 20, 2024",
//     status: "Pending",
//   },
//   {
//     product: "anotherproduct.com",
//     orderId: "XYZ123456",
//     commission: "$3500.00",
//     date: "Nov 05, 2024",
//     status: "Completed",
//   },
//   {
//     product: "thirdproduct.com",
//     orderId: "XYZ123456555",
//     commission: "$2500.00",
//     date: "Nov 09, 2024",
//     status: "Completed",
//   },
// ];
// export as pdf end

// const currentUrl = "https://new-webstarter.codepixelz.tech";
const currentUrl = window.location.origin;

const PaymentStatus = ({ userData, setGetPayouts, getPayouts }) => {
  // for payouts
  const [payouts, setPayouts] = useState([]);
  const [payoutsError, setPayoutsError] = useState(null);
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  async function get_payouts() {
    setPayoutsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch(
        `${currentUrl}/wp-json/wstr/v1/payouts/${userData.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPayouts(data); // Update the payouts state with the fetched data
      setPayoutsError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setPayoutsError(error.message); // Set the error state
    } finally {
      setPayoutsLoading(false); // Set loading to false when the request completes
    }
  }
  // for commissions
  const [commissions, setComissions] = useState([]);
  const [commissionsError, setComissionsError] = useState(null);
  const [commissionsLoading, setComissionsLoading] = useState(false);

  async function get_commissions() {
    setComissionsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch(
        `${currentUrl}/wp-json/wstr/v1/commissions/${userData.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setComissions(data); // Update the payouts state with the fetched data
      setComissionsError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setComissionsError(error.message); // Set the error state
    } finally {
      setComissionsLoading(false); // Set loading to false when the request completes
    }
  }
  useEffect(() => {
    if (userData.id) {
      get_payouts();
      get_commissions();
    }
  }, [userData, getPayouts]);

  const [activeTab, setActiveTab] = useState("active");

  const [isReversed, setIsReversed] = useState(true); // Track the reversal state

  function handleSort() {
    setIsReversed(!isReversed);
    if (activeTab == "active") {
      const sortedOffers = [...payouts].sort((a, b) => {
        if (a.created_at < b.created_at) return isReversed ? 1 : -1;
        if (a.created_at > b.created_at) return isReversed ? -1 : 1;
        return 0;
      });
      setPayouts(sortedOffers);
    }
    if (activeTab == "declined") {
      const sortedOffers = [...commissions].sort((a, b) => {
        if (a.created_at < b.created_at) return isReversed ? 1 : -1;
        if (a.created_at > b.created_at) return isReversed ? -1 : 1;
        return 0;
      });
      setComissions(sortedOffers);
    }
  }

  function payoutsCommissionContent(items, type) {
    {
      return items.map((item, index) => {
        let status_class = "";
        let status = "";
        if (item.status == "pending") {
          status = "Pending";
          status_class = "pending";
        } else if (item.status == "paid") {
          status = "Paid";
          status_class = "paid";
        } else if (item.status == "cancelled") {
          status = "Cancelled";
          status_class = "cancelled";
        } else if (item.status == "in-progress") {
          status = "In Progress";
          status_class = "in-progress";
        }

        return (
          <div key={index} className={styles.recentOffers_wrapper}>
            {/* Offer card */}
            <div
              className={`${styles.ws_flex} ${styles.gap_5} ${styles.fd_column}`}
            >
              {type !== "payout" && (
                <div className={styles.recentOffers_card}>
                  <div className={styles.recentOffers_card_image}>
                    <img src={item?.domain_image} alt={item?.domain_title} />
                  </div>
                  <div className={styles.recentOffers_card_titles}>
                    <p>Product</p>
                    <a href={item?.domain_link} target="_blank">
                      <h5>{item?.domain_title}</h5>
                    </a>
                  </div>
                  <div className={styles.recentOffers_card_details}>
                    <p>Order ID</p>
                    <h5>{item?.order_id}</h5>
                  </div>
                </div>
              )}
              <div className={styles.recentOffers_card}>
                <div
                  className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                >
                  <p className="online">
                    {" "}
                    Total Commission
                    <FaCircle />
                  </p>
                  <h5>
                    {item?.amount ? item?.currency : "$"}
                    {item?.amount}
                  </h5>
                </div>
                <div className={styles.recentOffers_card_details}>
                  <p>Date</p>
                  <h6>{item?.created_at}</h6>
                </div>
              </div>

              <div
                className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}
              >
                {type !== "commission" && (
                  <div className={styles.recentOffers_card_titles}>
                    <p>Status</p>
                    <h5
                      className={`${styles.offer_status} ${styles.pending}`}
                      class={status_class}
                    >
                      <FaCircle />
                      {status}
                    </h5>
                  </div>
                )}
                <div className={styles.recentOffers_card_details}>
                  <div
                    className={`${styles.svg_wrapper_bg_grey} ${styles.export_icon_wrapper}`}
                    onClick={() => handleExportPDF(item[index], true)}
                  >
                    <ExportIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  return (
    <div className={styles.offer_tabs_wrapper}>
      {/* Nav tabs */}
      <div
        className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.ph_30} ${styles.dashboard_small_margin}`}
      >
        <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs} `}>
          <li
            className={`${activeTab === "active" ? styles.active : ""} `}
            onClick={() => setActiveTab("active")}
          >
            <div className={styles.svg_wrapper_bg_white}>
              <PayoutIcon />
            </div>

            <label>Payouts</label>
          </li>
          <li
            className={`${activeTab === "declined" ? styles.active : ""} `}
            onClick={() => setActiveTab("declined")}
          >
            <div className={styles.svg_wrapper_bg_white}>
              <CommissionIcon />
            </div>
            <label> Commissions</label>
          </li>
        </ul>
        <div
          className={`${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <div className={styles.offerSorts} onClick={handleSort}>
            <SortIcon />
            <label> Sort</label>
          </div>
          {/* <div className={`${styles.offerSorts} ${styles.payment_status_export_all}`}>
                        <ExportIcon />
                        <label>  Export</label>
                    </div> */}
          <div
            className={`${styles.offerSorts} ${styles.payment_status_export_all}`}
            onClick={() => handleExportPDF(payouts, false)}
          >
            <ExportIcon />
            <label> Export</label>
          </div>
        </div>
      </div>
      {/* Tab content */}
      <div className={styles.tab_content}>
        {activeTab === "active" && (
          <div
            className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.payment_status_cols} `}
          >
            {payoutsLoading && (
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>
            )}
            {payoutsError && <div class="error_msg">{payoutsError}</div>}
            {!payoutsError && payouts.length > 0 ? (
              payoutsCommissionContent(payouts, "payout")
            ) : (
              <div className={styles.dash_error_wrap}>
                <div className={styles.order_error_msg}>No payouts yet! </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "declined" && (
          <div
            className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.payment_status_cols} `}
          >
            {commissionsLoading && (
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>
            )}
            {commissionsError && <div>{commissionsError}</div>}
            {!payoutsError && commissions.length > 0 ? (
              payoutsCommissionContent(commissions, "commission")
            ) : (
              <div className={styles.dash_error_wrap}>
                <div className={styles.order_error_msg}>
                  No commissions yet!{" "}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
