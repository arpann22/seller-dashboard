import styles from "./Tabs.module.css"; // Import styles
import { ReactComponent as PayPalIcon } from "./image/paypal.svg";
// import { ReactComponent as AvailableBalanceIcon } from "./image/balance.svg";
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
import WalletBalance from "./WalletBalance.jsx";
const currentUrl = window.location.origin;
// const currentUrl = "https://new-webstarter.codepixelz.tech";

export default function Wallet({
  selectedCard,
  isPaypalPopupOpen,
  isBankPopupOpen,
  isCryptoPopupOpen,
  setSelectedCard,
  setPaypalPopupOpen,
  setBankPopupOpen,
  setCryptoPopupOpen,
  mediaSetupIcon,
  userData,
}) {
  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId); // Set the selected card
  };
  const handleClosePopup = () => {
    setPaypalPopupOpen(false);
    setBankPopupOpen(false);
    setCryptoPopupOpen(false);
  };
  /**
   * Bank details states and functions
   */
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
      }
    } catch (error) {
      setBankError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setBankLoading(false);
    }
  };

  /**
   * Paypal details states and functions
   */
  const [paypalDetails, setPaypalDetails] = useState({ paypal_email: "" });
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [paypalSuccess, setPaypalSuccess] = useState("");

  const fetchPaypalDetails = async () => {
    try {
      setPaypalLoading(true);
      const res = await fetch(`${currentUrl}/wp-json/wstr/v1/paypal-details`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setBankError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setPaypalDetails(data[0]);
      }
    } catch (error) {
      setPaypalError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setPaypalLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchPaypalDetails();
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

  const handlePaypalDetailsSave = async (e) => {
    e.preventDefault();
    try {
      setPaypalSuccess("");
      setPaypalError("");
      setPaypalLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/update-user-paypal-details/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(paypalDetails),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setPaypalError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setPaypalSuccess(data.message || "Paypal details saved successfully.");
      }
    } catch (error) {
      setPaypalError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setPaypalLoading(false);
    }
  };
  return (
    <>
      <div className={`${styles.wallet_top_wrapper} ${styles.ws_flex}`}>
        <div className={styles.wallet_available_balance}>
          <WalletBalance />
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

              {/* Card 3 */}
              <label
                className={`${styles.card} ${
                  selectedCard === 3 ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  // value="bankTransfer"
                  checked={selectedCard === 3}
                  onChange={() => handleCardSelect(3)}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === 3 && (
                    <span className={styles.check_icon}>
                      <FaCheckCircle />
                    </span>
                  )}
                  <div className={styles.svg_wrapper_bg}>
                    <BankIcon />
                  </div>

                  <div>
                    <h4>Crypto Wallet</h4>
                    <p>Connect your Crypto Wallet</p>
                  </div>
                  <button
                    type="button"
                    className={styles.edit_profile_button}
                    onClick={() => {
                      console.log("Button clicked");
                      setCryptoPopupOpen(true);
                    }}
                  >
                    Edit Wallet
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
                    {paypalLoading && (
                      <div>
                        <div className="loading_overlay">
                          <FaSpinner className="loading" />
                        </div>
                      </div>
                    )}
                    {paypalSuccess && (
                      <div className="completed">{paypalSuccess}</div>
                    )}
                    {paypalError && (
                      <div className="refunded">{paypalError}</div>
                    )}
                    <input
                      type="email"
                      placeholder="Enter your PayPal email"
                      className={`${styles.input_field} paypal_email_address`}
                      value={paypalDetails.paypal_email}
                      onChange={(e) =>
                        setPaypalDetails({
                          ...paypalDetails,
                          paypal_email: e.target.value,
                        })
                      }
                    />
                    <div className={styles.popup_actions}>
                      <button
                        type="button"
                        className={`${styles.save_button} ${styles.hover_blue_white} save_paypal_email_address`}
                        onClick={handlePaypalDetailsSave}
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
                      type="text"
                      placeholder="State"
                      className={`${styles.input_field} customer_address_state`}
                      // onChange={(e) =>
                      //   setBankDetails({
                      //     ...bankDetails,
                      //     bank_name: e.target.value,
                      //   })
                      // }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className={`${styles.input_field} customer_address_city`}
                      // onChange={(e) =>
                      //   setBankDetails({
                      //     ...bankDetails,
                      //     bank_name: e.target.value,
                      //   })
                      // }
                    />
                    <input
                      type="text"
                      placeholder="Swift Code"
                      className={`${styles.input_field} customer_swift_code`}
                      // onChange={(e) =>
                      //   setBankDetails({
                      //     ...bankDetails,
                      //     bank_name: e.target.value,
                      //   })
                      // }
                    />
                    {/* <textarea
                      name="notes"
                      placeholder="Notes.."
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          notes: e.target.value,
                        })
                      }
                    ></textarea> */}
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
              {/* crypto wallet popup */}
              {isCryptoPopupOpen && (
                <div className={styles.popup}>
                  <div className={styles.popup_content}>
                    <AiOutlineClose
                      className={styles.close_icon}
                      onClick={handleClosePopup}
                    />
                    <h4>Enter Wallet ID</h4>
                    {/* {paypalLoading && (
                      <div>
                        <div className="loading_overlay">
                          <FaSpinner className="loading" />
                        </div>
                      </div>
                    )} */}
                    {/* {paypalSuccess && (
                      <div className="completed">{paypalSuccess}</div>
                    )}
                    {paypalError && (
                      <div className="refunded">{paypalError}</div>
                    )} */}
                    <input
                      type="email"
                      placeholder="Enter your Walled ID"
                      className={`${styles.input_field} crypto_wallet_id`}
                      value={paypalDetails.paypal_email}
                      onChange={(e) =>
                        setPaypalDetails({
                          ...paypalDetails,
                          paypal_email: e.target.value,
                        })
                      }
                    />
                    {/* <div className={styles.popup_actions}>
                      <button
                        type="button"
                        className={`${styles.save_button} ${styles.hover_blue_white} save_paypal_email_address`}
                        onClick={handlePaypalDetailsSave}
                      >
                        Save
                      </button>
                    </div> */}
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
