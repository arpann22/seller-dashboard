import React, { useEffect, useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
import available_balance_circle from "./images/SHAPES_available_balance.png";
import { ReactComponent as AvailableBalanceIcon } from "./image/balance.svg";
// import available_balance_right_icon from "./images/available_balance_right_icon.png";
import { IoMdInformationCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
// const currentUrl = "https://new-webstarter.codepixelz.tech";
const currentUrl = window.location.origin;
const WalletBalance = ({ userData }) => {
  const [commissionLoader, setCommissionLoader] = useState(true);
  const [commissionError, setCommissionError] = useState(false);
  const [commission, setcommission] = useState("$000");

  async function getCommission() {
    try {
      setCommissionLoader(true);
      setCommissionError("");
      const response = await fetch(
        `${currentUrl}/wp-json/wstr/v1/total-commission/${userData.id}`,
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
      setcommission(data);
    } catch (err) {
      console.error("Error fetching total-commissions:", err);
      setCommissionError(err.message); // Set the error state
      console.log(err);
    } finally {
      setCommissionLoader(false);
    }
  }
  useEffect(() => {
    if (userData) {
      getCommission();
    }
  }, [userData]);

  return (
    <>
      <div
        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
      >
        <div className={styles.small_svg}>
          <AvailableBalanceIcon />
        </div>
        <h4>Available Balance</h4>
      </div>
      <div className={styles.available_balance_card}>
        <div
          className={`${styles.available_balance_card_shapes} ${styles.justify_space_between} ${styles.ws_flex}`}
        >
          <img src={available_balance_circle}></img>
          {/* <img src={available_balance_right_icon}></img> */}
          <div className={styles.balanceInfoIcon}>
            <IoMdInformationCircle />
          </div>
        </div>
        <div>
          <h5>Account Balance</h5>
          {commissionLoader && (
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          )}
          <h2 className="ws_text_center">
            {commission?.total_commission
              ? commission.total_commission
              : "0000"}
            <span>USD</span>
          </h2>
        </div>
        <div
          className={`${styles.available_balance_card_footer} ${styles.ws_flex} ${styles.f_wrap}`}
        >
          <div>
            <h6>Holder</h6>
            <h5>{userData?.first_name + " " + userData?.last_name}</h5>
          </div>
          <div>
            <h6>Payment Method</h6>
            <h5>PAYPAL</h5>
          </div>
          <div>
            <button>Request Payout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
