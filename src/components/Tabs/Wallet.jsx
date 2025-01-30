import styles from "./Tabs.module.css"; // Import styles
import { ReactComponent as PayPalIcon } from "./image/paypal.svg";
import { ReactComponent as CryptoIcon } from "./image/generic-cryptocurrency.svg";
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
  isPaypalPopupOpen,
  isBankPopupOpen,
  isCryptoPopupOpen,
  setPaypalPopupOpen,
  setBankPopupOpen,
  setCryptoPopupOpen,
  mediaSetupIcon,
  userData,
}) {
  const [selectedCard, setSelectedCard] = useState(null);

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
    bank_state: "",
    bank_city: "",
    bank_swift_code: "",
    bank_country: "",
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
        setPaypalError(errorMessage);
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

  /**
   * Crypto details states and functions
   */
  const [cryptoDetails, setCryptoDetails] = useState({ crypto_wallet_id: "" });
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoError, setCryptoError] = useState("");
  const [cryptoSuccess, setCryptoSuccess] = useState("");

  const fetchCryptoDetails = async () => {
    try {
      setCryptoLoading(true);
      const res = await fetch(`${currentUrl}/wp-json/wstr/v1/crypto-details`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setCryptoError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setCryptoDetails(data[0]);
      }
    } catch (error) {
      setCryptoError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCryptoLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchPaypalDetails();
    fetchCryptoDetails();
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

  const handleCryptoDetailsSave = async (e) => {
    e.preventDefault();
    try {
      setCryptoSuccess("");
      setCryptoError("");
      setCryptoLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/update-crypto-details/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(cryptoDetails),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setCryptoError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setCryptoSuccess(data.message || "Crypto details saved successfully.");
      }
    } catch (error) {
      setCryptoError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCryptoLoading(false);
    }
  };

  /**
   * payment method section starts
   */

  const [loading, setLoading] = useState(false);
  const [success_msg, setSuccess_msg] = useState("");
  const [error_msg, setError_msg] = useState("");
  const [type, setType] = useState("");

  async function save_prefereed_payment_method(cardId, type) {
    try {
      setSuccess_msg(" ");
      setError_msg(" ");
      setLoading(true);
      if (type) {
        setType(type);
      } else {
        setType("");
      }
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/save-preferred-payment-method/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify({ payment_method: cardId }),
        }
      );

      if (!res.ok) {
        throw new Error("HTTP error! status: " + res.status);
      }
      const data = await res.json();
      if (data) {
        setSuccess_msg(data.message || "Payment method saved successfully.");
      }
    } catch (error) {
      setError_msg(
        "Error saving preferred payment method. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleCardSelect = async (cardId) => {
    setSelectedCard(cardId); // Set the selected card
    await save_prefereed_payment_method(cardId);
    if (cardId === "bank") {
      setPaymentMethod("Bank Transfer");
    } else if (cardId === "crypto") {
      setPaymentMethod("Crypto Wallet");
    } else {
      setPaymentMethod("Paypal");
    }
  };

  const [paymentMethod, setPaymentMethod] = useState(null);
  useEffect(() => {
    if (userData) {
      if (userData?.preferred_payment_method) {
        if (userData?.preferred_payment_method === "bank") {
          setPaymentMethod("Bank Transfer");
        } else if (userData?.preferred_payment_method === "crypto") {
          setPaymentMethod("Crypto Wallet");
        } else {
          setPaymentMethod("Paypal");
        }
        setSelectedCard(userData.preferred_payment_method);
      } else {
        setSelectedCard("paypal"); // At first, paypal is selected by default
        save_prefereed_payment_method("paypal", "first");
        setPaymentMethod("Paypal");
      }
    }
  }, [userData]);
  /**
   * payment method section ends
   */

  return (
    <>
      <div
        className={`${styles.wallet_top_wrapper} ${styles.ws_flex} ${styles.fw_wrap}`}
      >
        <div className={styles.wallet_available_balance}>
          <WalletBalance userData={userData} paymentMethod={paymentMethod} />
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
          {loading && (
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          )}
          {!type && success_msg && <div class="completed">{success_msg}</div>}
          {error_msg && <div class="cancelled">{error_msg}</div>}
          <form>
            <div
              className={`${styles.paymentMethodcard_section} ${styles.fd_column}`}
            >
              {/* Card 1 */}
              <label
                className={`${styles.card} ${
                  selectedCard === "paypal" ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedCard === "paypal"}
                  onChange={() => handleCardSelect("paypal")}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === "paypal" && (
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
                  selectedCard === "bank" ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={selectedCard === "bank"}
                  onChange={() => handleCardSelect("bank")}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === "bank" && (
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
                  selectedCard === "crypto" ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  // value="bankTransfer"
                  checked={selectedCard === "crypto"}
                  onChange={() => handleCardSelect("crypto")}
                  className={styles.radio_input}
                />
                <div className={styles.card_content}>
                  {selectedCard === "crypto" && (
                    <span className={styles.check_icon}>
                      <FaCheckCircle />
                    </span>
                  )}
                  <div className={styles.svg_wrapper_bg}>
                    <CryptoIcon />
                  </div>

                  <div>
                    <h4>Crypto Wallet</h4>
                    <p>Connect your Crypto Wallet</p>
                  </div>
                  <button
                    type="button"
                    className={styles.edit_profile_button}
                    onClick={() => {
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
                      <div className="success_msg">{paypalSuccess}</div>
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
                      <div className="success_msg">{bankSuccess}</div>
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
                    <select
                      value={bankDetails.bank_country}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bank_country: e.target.value,
                        })
                      }
                    >
                      <option value="">Country</option>
                      <option value="United States">United States</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="American Samoa">American Samoa</option>
                      <option value="Andorra">Andorra</option>
                      <option value="Angola">Angola</option>
                      <option value="Anguilla">Anguilla</option>
                      <option value="Antartica">Antarctica</option>
                      <option value="Antigua and Barbuda">
                        Antigua and Barbuda
                      </option>
                      <option value="Argentina">Argentina</option>
                      <option value="Armenia">Armenia</option>
                      <option value="Aruba">Aruba</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Bahamas">Bahamas</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Barbados">Barbados</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Belize">Belize</option>
                      <option value="Benin">Benin</option>
                      <option value="Bermuda">Bermuda</option>
                      <option value="Bhutan">Bhutan</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Bosnia and Herzegowina">
                        Bosnia and Herzegowina
                      </option>
                      <option value="Botswana">Botswana</option>
                      <option value="Bouvet Island">Bouvet Island</option>
                      <option value="Brazil">Brazil</option>
                      <option value="British Indian Ocean Territory">
                        British Indian Ocean Territory
                      </option>
                      <option value="Brunei Darussalam">
                        Brunei Darussalam
                      </option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Canada">Canada</option>
                      <option value="Cape Verde">Cape Verde</option>
                      <option value="Cayman Islands">Cayman Islands</option>
                      <option value="Central African Republic">
                        Central African Republic
                      </option>
                      <option value="Chad">Chad</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Christmas Island">Christmas Island</option>
                      <option value="Cocos Islands">
                        Cocos (Keeling) Islands
                      </option>
                      <option value="Colombia">Colombia</option>
                      <option value="Comoros">Comoros</option>
                      <option value="Congo">Congo</option>
                      <option value="Congo">
                        Congo, the Democratic Republic of the
                      </option>
                      <option value="Cook Islands">Cook Islands</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                      <option value="Croatia">Croatia (Hrvatska)</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Dominica">Dominica</option>
                      <option value="Dominican Republic">
                        Dominican Republic
                      </option>
                      <option value="East Timor">East Timor</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Egypt">Egypt</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Equatorial Guinea">
                        Equatorial Guinea
                      </option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Falkland Islands">
                        Falkland Islands (Malvinas)
                      </option>
                      <option value="Faroe Islands">Faroe Islands</option>
                      <option value="Fiji">Fiji</option>
                      <option value="Finland">Finland</option>
                      <option value="France">France</option>
                      <option value="France Metropolitan">
                        France, Metropolitan
                      </option>
                      <option value="French Guiana">French Guiana</option>
                      <option value="French Polynesia">French Polynesia</option>
                      <option value="French Southern Territories">
                        French Southern Territories
                      </option>
                      <option value="Gabon">Gabon</option>
                      <option value="Gambia">Gambia</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Germany">Germany</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Gibraltar">Gibraltar</option>
                      <option value="Greece">Greece</option>
                      <option value="Greenland">Greenland</option>
                      <option value="Grenada">Grenada</option>
                      <option value="Guadeloupe">Guadeloupe</option>
                      <option value="Guam">Guam</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Guinea-Bissau">Guinea-Bissau</option>
                      <option value="Guyana">Guyana</option>
                      <option value="Haiti">Haiti</option>
                      <option value="Heard and McDonald Islands">
                        Heard and Mc Donald Islands
                      </option>
                      <option value="Holy See">
                        Holy See (Vatican City State)
                      </option>
                      <option value="Honduras">Honduras</option>
                      <option value="Hong Kong">Hong Kong</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Iceland">Iceland</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Iran">Iran (Islamic Republic of)</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Israel">Israel</option>
                      <option value="Italy">Italy</option>
                      <option value="Jamaica">Jamaica</option>
                      <option value="Japan">Japan</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Kiribati">Kiribati</option>
                      <option value="Democratic People's Republic of Korea">
                        Korea, Democratic People's Republic of
                      </option>
                      <option value="Korea">Korea, Republic of</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                      <option value="Lao">
                        Lao People's Democratic Republic
                      </option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Libyan Arab Jamahiriya">
                        Libyan Arab Jamahiriya
                      </option>
                      <option value="Liechtenstein">Liechtenstein</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Macau">Macau</option>
                      <option value="Macedonia">
                        Macedonia, The Former Yugoslav Republic of
                      </option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malawi">Malawi</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Maldives">Maldives</option>
                      <option value="Mali">Mali</option>
                      <option value="Malta">Malta</option>
                      <option value="Marshall Islands">Marshall Islands</option>
                      <option value="Martinique">Martinique</option>
                      <option value="Mauritania">Mauritania</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Mayotte">Mayotte</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Micronesia">
                        Micronesia, Federated States of
                      </option>
                      <option value="Moldova">Moldova, Republic of</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Mongolia">Mongolia</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Nauru">Nauru</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Netherlands Antilles">
                        Netherlands Antilles
                      </option>
                      <option value="New Caledonia">New Caledonia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Niue">Niue</option>
                      <option value="Norfolk Island">Norfolk Island</option>
                      <option value="Northern Mariana Islands">
                        Northern Mariana Islands
                      </option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Palau">Palau</option>
                      <option value="Panama">Panama</option>
                      <option value="Papua New Guinea">Papua New Guinea</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Peru">Peru</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Pitcairn">Pitcairn</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Puerto Rico">Puerto Rico</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Reunion">Reunion</option>
                      <option value="Romania">Romania</option>
                      <option value="Russia">Russian Federation</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Saint Kitts and Nevis">
                        Saint Kitts and Nevis
                      </option>
                      <option value="Saint Lucia">Saint LUCIA</option>
                      <option value="Saint Vincent">
                        Saint Vincent and the Grenadines
                      </option>
                      <option value="Samoa">Samoa</option>
                      <option value="San Marino">San Marino</option>
                      <option value="Sao Tome and Principe">
                        Sao Tome and Principe
                      </option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Sierra">Sierra Leone</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Slovakia">
                        Slovakia (Slovak Republic)
                      </option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="Solomon Islands">Solomon Islands</option>
                      <option value="Somalia">Somalia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Georgia">
                        South Georgia and the South Sandwich Islands
                      </option>
                      <option value="Span">Spain</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="St. Helena">St. Helena</option>
                      <option value="St. Pierre and Miguelon">
                        St. Pierre and Miquelon
                      </option>
                      <option value="Sudan">Sudan</option>
                      <option value="Suriname">Suriname</option>
                      <option value="Svalbard">
                        Svalbard and Jan Mayen Islands
                      </option>
                      <option value="Swaziland">Swaziland</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Syria">Syrian Arab Republic</option>
                      <option value="Taiwan">Taiwan, Province of China</option>
                      <option value="Tajikistan">Tajikistan</option>
                      <option value="Tanzania">
                        Tanzania, United Republic of
                      </option>
                      <option value="Thailand">Thailand</option>
                      <option value="Togo">Togo</option>
                      <option value="Tokelau">Tokelau</option>
                      <option value="Tonga">Tonga</option>
                      <option value="Trinidad and Tobago">
                        Trinidad and Tobago
                      </option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Turks and Caicos">
                        Turks and Caicos Islands
                      </option>
                      <option value="Tuvalu">Tuvalu</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States Minor Outlying Islands">
                        United States Minor Outlying Islands
                      </option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Vanuatu">Vanuatu</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Viet Nam</option>
                      <option value="Virgin Islands (British)">
                        Virgin Islands (British)
                      </option>
                      <option value="Virgin Islands (U.S)">
                        Virgin Islands (U.S.)
                      </option>
                      <option value="Wallis and Futana Islands">
                        Wallis and Futuna Islands
                      </option>
                      <option value="Western Sahara">Western Sahara</option>
                      <option value="Yemen">Yemen</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>

                    <input
                      type="text"
                      placeholder="State"
                      className={`${styles.input_field} customer_address_state`}
                      value={bankDetails.bank_state}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bank_state: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className={`${styles.input_field} customer_address_city`}
                      value={bankDetails.bank_city}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bank_city: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Swift Code"
                      className={`${styles.input_field} customer_swift_code`}
                      value={bankDetails.bank_swift_code}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bank_swift_code: e.target.value,
                        })
                      }
                    />
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
                    {cryptoLoading && (
                      <div>
                        <div className="loading_overlay">
                          <FaSpinner className="loading" />
                        </div>
                      </div>
                    )}
                    {cryptoSuccess && (
                      <div className="success_msg">{cryptoSuccess}</div>
                    )}
                    {cryptoError && (
                      <div className="refunded">{cryptoError}</div>
                    )}

                    <input
                      type="email"
                      placeholder="Enter your Walled ID"
                      className={`${styles.input_field} crypto_wallet_id`}
                      value={cryptoDetails.crypto_wallet_id}
                      onChange={(e) =>
                        setCryptoDetails({
                          ...cryptoDetails,
                          crypto_wallet_id: e.target.value,
                        })
                      }
                    />
                    <div
                      className={`${styles.popup_actions} customer_bank_notes`}
                    >
                      <button
                        type="button"
                        className={`${styles.save_button} ${styles.hover_blue_white} save_customer_bank_details`}
                        onClick={handleCryptoDetailsSave}
                      >
                        Save
                      </button>
                    </div>
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
        <PaymentStatusTabs userData={userData} />
      </div>
    </>
  );
}
