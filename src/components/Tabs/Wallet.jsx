import styles from "./Tabs.module.css"; // Import styles
import { ReactComponent as PayPalIcon } from "./image/paypal.svg";
import { ReactComponent as AvailableBalanceIcon } from "./image/balance.svg";
import { ReactComponent as BankIcon } from "./image/bank.svg";

import PaymentStatusTabs from "./PaymentStatusTabs";
import delete_reset_icon from "./image/delete.svg";
import available_balance_circle from "./images/SHAPES_available_balance.png";
import available_balance_right_icon from "./images/available_balance_right_icon.png";
import { IoMdInformationCircle } from "react-icons/io";
// import { ReactComponent as PaymentMethodIcon } from "./image/payment_method_icon.png";
import payment_method_icon from "./image/payment_method_icon.png";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";

const currentUrl = window.location.origin;
// const currentUrl = "https://new-webstarter.codepixelz.tech";

export default function Wallet({
  selectedCard,
  isPaypalPopupOpen,
  isBankPopupOpen,
  setSelectedCard,
  setPaypalPopupOpen,
  setBankPopupOpen,
  mediaSetupIcon,
  userData,
}) {
  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId); // Set the selected card
  };
  const handleClosePopup = () => {
    setPaypalPopupOpen(false);
    setBankPopupOpen(false);
  };

  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    notes: "",
  });
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState("");
  const [bankSuccess, setBankSuccess] = useState("");

  const fetchBankDetails = async () => {
    try {
      setBankLoading(true);
      const res = await fetch(`${currentUrl}/wp-json/wstr/v1/bank-details`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setBankError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setBankDetails(data[0]);
        console.log(data[0]);
      }
    } catch (error) {
      setBankError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setBankLoading(false);
    }
  };
  useEffect(() => {
    fetchBankDetails();
  }, [userData.id]);

  /**
   *
   * @param
   * for updating bank details
   */
  const handleBankDetailsSave = async (e) => {
    e.preventDefault();
    try {
      setBankSuccess("");
      setBankError("");
      setBankLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/update-user-bank-details/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(bankDetails),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setBankError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setBankSuccess(data.message || "Bank details saved successfully.");
      }
    } catch (error) {
      setBankError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setBankLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.wallet_top_wrapper} ${styles.ws_flex}`}>
        <div className={styles.wallet_available_balance}>
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
              <h2 className="ws_text_center">
                205,700 <span>USD</span>
              </h2>
            </div>
            <div
              className={`${styles.available_balance_card_footer} ${styles.ws_flex} ${styles.f_wrap}`}
            >
              <div>
                <h6>Holder</h6>
                <h5>Jenny Remigton</h5>
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
        </div>
        {/* Payment Method */}
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={payment_method_icon} alt="Media Setup Icon" />
            {/* <PaymentMethodIcon /> */}
            <h4>Payment Method</h4>
          </div>
          <form>
            <div
              className={`${styles.paymentMethodcard_section} ${styles.fd_column}`}
            >
              {/* Card 1 */}
              <label
                className={`${styles.card} ${
                  selectedCard === 1 ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedCard === 1}
                  onChange={() => handleCardSelect(1)}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === 1 && (
                    <span className={styles.check_icon}>
                      <FaCheckCircle />
                    </span>
                  )}
                  <div className={styles.svg_wrapper_bg}>
                    <PayPalIcon />
                  </div>
                  <div>
                    <h4>Paypal</h4>
                    <p>Connect your Paypal Account</p>
                  </div>
                  <button
                    type="button"
                    className={styles.edit_profile_button}
                    onClick={() => setPaypalPopupOpen(true)}
                  >
                    Edit Email
                  </button>
                </div>
              </label>

              {/* Card 2 */}
              <label
                className={`${styles.card} ${
                  selectedCard === 2 ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={selectedCard === 2}
                  onChange={() => handleCardSelect(2)}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === 2 && (
                    <span className={styles.check_icon}>
                      <FaCheckCircle />
                    </span>
                  )}
                  <div className={styles.svg_wrapper_bg}>
                    <BankIcon />
                  </div>

                  <div>
                    <h4>Bank Transfer</h4>
                    <p>Connect your Bank Account</p>
                  </div>
                  <button
                    type="button"
                    className={styles.edit_profile_button}
                    onClick={() => setBankPopupOpen(true)}
                  >
                    Bank Settings
                  </button>
                </div>
              </label>

              {/* Paypal Email Popup */}
              {isPaypalPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popup_content}>
                    <AiOutlineClose
                      className={styles.close_icon}
                      onClick={handleClosePopup}
                    />
                    <h4>Enter PayPal Email</h4>
                    <input
                      type="email"
                      placeholder="Enter your PayPal email"
                      className={`${styles.input_field} paypal_email_address`}
                    />
                    <div className={styles.popup_actions}>
                      <button
                        type="button"
                        className={`${styles.save_button} ${styles.hover_blue_white} save_paypal_email_address`}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Settings Popup */}
              {isBankPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popup_content}>
                    <AiOutlineClose
                      className={styles.close_icon}
                      onClick={handleClosePopup}
                    />
                    <h4>Enter Bank Details</h4>
                    {bankLoading && (
                      <div>
                        <div className="loading_overlay">
                          <FaSpinner className="loading" />
                        </div>
                      </div>
                    )}
                    {bankSuccess && (
                      <div className="completed">{bankSuccess}</div>
                    )}
                    {bankError && <div className="refunded">{bankError}</div>}
                    <input
                      type="text"
                      placeholder="Enter your bank name"
                      className={`${styles.input_field} customer_bank_name`}
                      value={bankDetails.bank_name}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bank_name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Enter your bank account number"
                      className={`${styles.input_field} customer_bank_acc_number`}
                      value={bankDetails.account_number}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          account_number: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter your account name"
                      className={`${styles.input_field} customer_bank_acc_name`}
                      value={bankDetails.account_name}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          account_name: e.target.value,
                        })
                      }
                    />
                    <textarea
                      name="notes"
                      placeholder="Notes.."
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          notes: e.target.value,
                        })
                      }
                    ></textarea>
                    <div
                      className={`${styles.popup_actions} customer_bank_notes`}
                    >
                      <button
                        type="button"
                        className={`${styles.save_button} ${styles.hover_blue_white} save_customer_bank_details`}
                        onClick={handleBankDetailsSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className={styles.payment_status_wrapper}>
        <div
          className={`${styles.paymentStatus_title_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Payment Status</h4>
        </div>
        <PaymentStatusTabs />
      </div>
    </>
  );
}
