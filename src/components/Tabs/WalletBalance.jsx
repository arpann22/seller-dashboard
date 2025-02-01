import React, { useEffect, useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
import available_balance_circle from "./images/SHAPES_available_balance.png";
import { ReactComponent as AvailableBalanceIcon } from "./image/balance.svg";
// import available_balance_right_icon from "./images/available_balance_right_icon.png";
import { IoMdInformationCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
// const currentUrl = "https://new-webstarter.codepixelz.tech";
const currentUrl = window.location.origin;
const WalletBalance = ({ userData, paymentMethod, setGetPayouts }) => {
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

  // handling request payout
  const [showPopup, setShowPopup] = useState(false);
  const [requestError, setRequestError] = useState(false);

  const handlePayoutPopup = (amount) => {
    if (amount <= 0) {
      setRequestError("You don't have any balance to request payout");
      return;
    }
    setRequestSuccess("");
    setRequestError("");
    setShowPopup(true);
  };
  const [requestSuccess, setRequestSuccess] = useState("");

  const PayoutPopup = () => {
    const [requestAmount, setRequestAmount] = useState("");

    const [request_error, setRequest_error] = useState("");
    const [requestLoader, setRequestLoader] = useState(false);

    const handleRequestPayout = async (total_commission) => {
      if (requestAmount > total_commission) {
        setRequest_error(
          "You can't request more than your withdrawable amount"
        );
        return;
      }
      if (requestAmount < 50) {
        setRequest_error("You can't requeset less than $50");
        return;
      }
      try {
        setRequestLoader(true);
        setRequestError("");
        setRequestSuccess("");
        const response = await fetch(
          `${currentUrl}/wp-json/wstr/v1/request-payout/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
            body: JSON.stringify({
              // user_id: userData.id,
              user_id: userData.id,
              amount: requestAmount,
            }),
          }
        );

        // Parse response JSON once
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }
        setRequestSuccess(data.message);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        setGetPayouts(true);
        await getCommission();
      } catch (err) {
        setRequest_error(
          err.message
            ? err.message
            : "Something went wrong. Please try again later"
        );
      } finally {
        setRequestLoader(false);
      }
    };
    return (
      <div
        className={`${styles.success_popup_overlay} ${styles.withdrawl_popup}`}
      >
        <div className={styles.success_popup}>
          {requestLoader && (
            <div>
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>
            </div>
          )}
          {request_error && <div class="error_msg">{request_error} </div>}
          {requestSuccess && <div class="success_msg">{requestSuccess}</div>}
          {!requestSuccess && (
            <>
              <p className={styles.withdraw_popup_amt}>
                Withdrawable Amount:{" "}
                <span>
                  {" "}
                  $
                  {commission?.withdrawable_amount
                    ? commission.withdrawable_amount
                    : 0}
                </span>
              </p>
              <div>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)} // Directly updating state
                  min="50"
                />
              </div>

              <div>
                <input
                  type="submit"
                  value="Ok"
                  onClick={() =>
                    handleRequestPayout(
                      commission?.withdrawable_amount
                        ? commission.withdrawable_amount
                        : 0
                    )
                  }
                  className={`${styles.okButton} ${styles.hover_blue_white}`}
                />
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setShowPopup(false)} // Close the popup
                  className={`${styles.cancelButton} ${styles.hover_blue_white}`}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {showPopup && <PayoutPopup />}
      <div
        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
      >
        <div className={styles.small_svg}>
          <AvailableBalanceIcon />
        </div>
        <h4>Available Balance</h4>
      </div>
      {requestError && <div class="cancelled">{requestError}</div>}
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
            <h5>{paymentMethod}</h5>
          </div>
          <div>
            <button
              onClick={() =>
                handlePayoutPopup(
                  commission?.total_commission ? commission.total_commission : 0
                )
              }
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
