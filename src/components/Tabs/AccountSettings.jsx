// Account settings
// Password Management:
// Two-Factor Authentication (2FA): Enable or disable 2FA for added security.
// Login Activity: View recent login locations and devices, with the option to log out remotely.
// Preferences:

// Notification Settings: Customize email or SMS notifications for:
// 	•	Domain inquiries/offers
// 	•	payment updates
// Language/Region Settings: Choose preferred language or region for localized features.
// Choose standard currency option global.

import React, { useEffect, useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
import accountstyles from "./AccountSettings.module.css";
import { FaPlus, FaSpinner } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { TbPasswordUser } from "react-icons/tb";
import { Si2Fas } from "react-icons/si";
import { GrLogin } from "react-icons/gr";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdLanguage } from "react-icons/md";

const currentUrl = window.location.origin;
// const AccountSettings = ({ userData }) => {
const AccountSettings = () => {
  // fetching userdata again so there will be no need of site reloading after setting changes.
  const [userData, setUserData] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState(""); // State to manage selected value
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userLoader, setUserLoader] = useState(false);
  useEffect(() => {
    // Fetch API data
    setUserLoader(true);
    fetch(`${currentUrl}/wp-json/wstr/v1/login`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        const user = data[0];
        setUserData(user);
        setSelectedCurrency(user.currency);
        setSelectedLanguage(user.language);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setUserLoader(false); // Stop the loader after the fetch completes
      });
  }, []);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [is2FaEnabled, set2FaEnabled] = useState(false);

  const [loginActivity, setLoginActivity] = useState([]);
  const [activtyLoading, setActivityLoading] = useState(false);
  useEffect(() => {
    const two_fa_enabled = userData.two_fa_enabled;
    if (two_fa_enabled) {
      set2FaEnabled((prevState) => !prevState);
    }

    // notfication section stars
    const domain_enquery_offers = userData.domain_enquery_offers;
    const payment_update = userData.payment_update;
    if (domain_enquery_offers) {
      setNotificationToggles((prev) => ({
        ...prev,
        domain: !prev.domain,
      }));
    }

    if (payment_update) {
      setNotificationToggles((prev) => ({
        ...prev,
        payment: !prev.payment,
      }));
    }

    // notification section ends

    async function fetchLoginActivity() {
      try {
        setActivityLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/login-activity/${userData.id}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        if (data) {
          setLoginActivity(data);
        }
      } catch (err) {
        console.log("login activity error:", err.message);
      } finally {
        setActivityLoading(false);
      }
    }

    if (userData.id) {
      fetchLoginActivity();
    }
  }, [userData]);

  // fetching currencies
  const [currencies, setCurrenceis] = useState([]);
  const [currenciesLoading, setCurrenceisLoading] = useState(false);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        setCurrenceisLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/currency/${userData.id}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        if (data) {
          setCurrenceis(data);
        }
      } catch (err) {
        console.log("login activity error:", err.message);
      } finally {
        setCurrenceisLoading(false);
      }
    }
    if (userData.id) {
      fetchCurrencies();
    }
  }, [userData]);

  // State for Notification Toggles
  const [notificationToggles, setNotificationToggles] = useState({
    domain: false,
    payment: false,
  });

  const handleAccordionToggle = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  const [twoFaSucessMessage, setTwoFaSuccessMessage] = useState("");
  const [twoFaErrorMessage, setTwoFaErrorMessage] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);

  const handle2faToggle = async () => {
    set2FaEnabled((prevState) => !prevState);
    const newIs2FaEnabled = !is2FaEnabled;

    try {
      setTwoFaSuccessMessage("");
      setTwoFaErrorMessage("");
      setTwoFaLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/2fa-verification/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            two_fa_enabled: newIs2FaEnabled,
          }),
        }
      );

      if (!res.ok) {
        setTwoFaErrorMessage("Error occured on 2fa verification");
        throw new Error("Error occured on 2fa verification");
      }
      const data = await res.json();

      if (data) {
        setTwoFaSuccessMessage(data.message);
      }
      // const mediaData = await mediaResponse.json();
      // return mediaData.id; // Get the media ID for the uploaded image
    } catch (err) {
      setTwoFaErrorMessage(err);
    } finally {
      setTwoFaLoading(false);
    }
  };

  //================================= logout of all devices
  const [logoutErrorMessage, setLogoutErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleLogoutPopup = () => {
    setShowPopup(true);
  };
  const handleLogout = async () => {
    try {
      setTwoFaLoading(true);
      setLogoutErrorMessage("");
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/logout-all-device/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logut: true,
          }),
        }
      );
      if (!res.ok) {
        setLogoutErrorMessage("Error occured on logging out all devices");
        throw new Error("Error occured on logging out all devices");
      }
      const data = await res.json();
      if (data) {
        window.location.reload();
      }
    } catch (err) {
      setTwoFaErrorMessage(err);
    } finally {
      setTwoFaLoading(false);
    }
  };

  //
  const [notificationData, setNotificationData] = useState([]);
  const [notificationError, setNotifcationError] = useState("");
  const [domainEnqueryLoader, setdomainEnqueryLoader] = useState(false);
  const [paymentUpdateLoader, setPaymentUpdateLoader] = useState(false);
  const handlePreferences = async (type) => {
    let body = "";
    if (type == "domain") {
      setNotificationToggles((prev) => ({
        ...prev,
        domain: !prev.domain,
      }));
      const domainEnqueriesEnabled = !notificationToggles.domain;
      body = JSON.stringify({
        domain_enquery: domainEnqueriesEnabled,
        // payment_update: paymentUpdateEnabled,
      });
    }

    if (type == "payment") {
      setNotificationToggles((prev) => ({
        ...prev,
        payment: !prev.payment,
      }));

      const paymentUpdateEnabled = !notificationToggles.payment;
      body = JSON.stringify({
        // domain_enquery: domainEnqueriesEnabled,
        payment_update: paymentUpdateEnabled,
      });
    }

    try {
      if (type == "payment") {
        setPaymentUpdateLoader(true);
      }
      if (type == "domain") {
        setdomainEnqueryLoader(true);
      }

      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/preferences/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.log("preferences error:", errorData.message);
      }
      const data = await res.json();
      setNotificationData(data);
    } catch (err) {
      setNotifcationError(err.message);
    } finally {
      if (type == "payment") {
        setPaymentUpdateLoader(false);
      }
      if (type == "domain") {
        setdomainEnqueryLoader(false);
      }
    }
  };

  const [languageData, setLanguageData] = useState([]);
  // const [notificationError, setNotifcationError] = useState("");
  const [languageLoader, setLanguageLoader] = useState(false);
  const [currencyLoader, setCurrencyLoader] = useState(false);

  const handelLanguageRegion = async (type, value) => {
    let body = "";
    if (type == "language") {
      body = JSON.stringify({
        language: value,
      });
      setSelectedLanguage(value);
    }
    if (type == "currency") {
      body = JSON.stringify({
        currency: value,
      });
      setSelectedCurrency(value);
    }
    try {
      if (type == "language") {
        setLanguageLoader(true);
      }
      if (type == "domain") {
        setCurrencyLoader(true);
      }

      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/preferences/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.log("preferences error:", errorData.message);
      }
      const data = await res.json();

      setLanguageData(data);
    } catch (err) {
      console.log(err.message);
      // setNotifcationError(err.message);
    } finally {
      if (type == "language") {
        setLanguageLoader(false);
      }
      if (type == "domain") {
        setCurrencyLoader(false);
      }
    }
  };
  if (userLoader) {
    return (
      <div>
        <div className="loading_overlay">
          <FaSpinner className="loading" />
        </div>
      </div>
    );
  }
  const LogoutDevicePopup = () => {
    return (
      <div className={styles.success_popup_overlay}>
        <div className={styles.success_popup}>
          <div>
            <p>Are you sure you want to log out from all devices?</p>
          </div>
          <div className={accountstyles.logOutAllbtnWrapper}>
            <input
              type="submit"
              value="Ok"
              onClick={handleLogout}
              className={`${styles.okButton} ${styles.hover_blue_white}`}
            />
            <input
              type="button"
              value="Cancel"
              onClick={() => setShowPopup(false)} // Close the popup
              className={`${styles.cancelButton} ${styles.hover_blue_white}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={accountstyles.accountSettingsContainer}>
      {showPopup && <LogoutDevicePopup />}

      <h2>Account Settings</h2>

      {/* Password Management Accordion */}
      <div className={accountstyles.settingsAccoridionContainer}>
        <div
          className={`${accountstyles.accordionItem} ${
            activeAccordion === "password-management" ? accountstyles.open : ""
          }`}
        >
          <div
            className={accountstyles.accordionHeader}
            onClick={() => handleAccordionToggle("password-management")}
          >
            <h3>
              <TbPasswordUser />
              Password Management
            </h3>
            <div className={accountstyles.svg_wrapper_bg_grey}>
              {activeAccordion === "password-management" ? (
                <FaTimes />
              ) : (
                <FaPlus />
              )}
            </div>
          </div>
          {activeAccordion === "password-management" && (
            <div className={accountstyles.accordionContent}>
              {twoFaSucessMessage && (
                <div class="success_msg"> {twoFaSucessMessage} </div>
              )}
              {twoFaErrorMessage && (
                <div class="error_msg"> {twoFaErrorMessage} </div>
              )}
              {twoFaLoading && (
                <div>
                  <div className="loading_overlay">
                    <FaSpinner className="loading" />
                  </div>
                </div>
              )}

              <div
                className={`${accountstyles.settingItem} ${accountstyles.toggle2FA}`}
              >
                <div>
                  <h4>
                    <Si2Fas />
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p>Enable or disable 2FA for added security.</p>
                </div>

                <div className={styles.toggle_button} onClick={handle2faToggle}>
                  <div
                    className={`${styles.toggle_switch} ${
                      is2FaEnabled ? styles.on : styles.off
                    }`}
                  >
                    <div className={styles.toggle_indicator}>
                      <RxCross2 />
                      <IoCheckmarkOutline />
                    </div>
                  </div>
                </div>
              </div>
              <div className={accountstyles.settingItem}>
                <h4>
                  <GrLogin />
                  Login Activity
                </h4>
                {activtyLoading && (
                  <div>
                    <div className="loading_overlay">
                      <FaSpinner className="loading" />
                    </div>
                  </div>
                )}
                <p>View recent login locations and devices.</p>
                <ul className={accountstyles.loggedInDevices}>
                  {loginActivity.map((location, index) => (
                    <li>
                      Device {index + 1}: {location}
                    </li>
                  ))}
                  {/* <li>Device 1: New York, USA</li>
                  <li>Device 2: London, UK</li> */}
                </ul>
                {logoutErrorMessage && <div> {logoutErrorMessage}</div>}
                <button
                  className={styles.hover_blue_white}
                  onClick={handleLogoutPopup}
                >
                  Log out of all devices
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Accordion */}
        <div
          className={`${accountstyles.accordionItem} ${
            activeAccordion === "preferences" ? accountstyles.open : ""
          }`}
        >
          <div
            className={accountstyles.accordionHeader}
            onClick={() => handleAccordionToggle("preferences")}
          >
            <h3>
              <VscSettings /> Preferences
            </h3>
            <div className={accountstyles.svg_wrapper_bg_grey}>
              {activeAccordion === "preferences" ? <FaTimes /> : <FaPlus />}
            </div>
          </div>
          {activeAccordion === "preferences" && (
            <div className={accountstyles.accordionContent}>
              {/* Notification Settings */}
              <div
                className={`${accountstyles.settingItem} ${accountstyles.notificationSettings}`}
              >
                <h4>
                  <IoMdNotificationsOutline />
                  Notification Settings
                </h4>
                <p>Customize email or SMS notifications for:</p>
                <ul>
                  {notificationData &&
                  notificationData?.preferences == "domain_enquery" ? (
                    <div class="success_msg">{notificationData.message}</div>
                  ) : (
                    ""
                  )}

                  {domainEnqueryLoader && (
                    <div>
                      <div className="loading_overlay">
                        <FaSpinner className="loading" />
                      </div>
                    </div>
                  )}
                  <li>
                    <div>
                      <span>Domain inquiries/offers</span>
                      <div
                        className={styles.toggle_button}
                        onClick={() => handlePreferences("domain")}
                      >
                        <div
                          className={`${styles.toggle_switch} ${
                            notificationToggles.domain ? styles.on : styles.off
                          }`}
                        >
                          <div className={styles.toggle_indicator}>
                            <RxCross2 />
                            <IoCheckmarkOutline />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  {notificationData &&
                  notificationData?.preferences == "payment_update" ? (
                    <div class="success_msg"> {notificationData.message}</div>
                  ) : (
                    ""
                  )}

                  {paymentUpdateLoader && (
                    <div>
                      <div className="loading_overlay">
                        <FaSpinner className="loading" />
                      </div>
                    </div>
                  )}
                  <li>
                    <div>
                      <span>Payment updates</span>
                      <div
                        className={styles.toggle_button}
                        onClick={() => handlePreferences("payment")}
                      >
                        <div
                          className={`${styles.toggle_switch} ${
                            notificationToggles.payment ? styles.on : styles.off
                          }`}
                        >
                          <div className={styles.toggle_indicator}>
                            <RxCross2 />
                            <IoCheckmarkOutline />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Language/Region Settings */}
              <div
                className={`${accountstyles.settingItem} ${accountstyles.preferneces_settings}`}
              >
                <h4>
                  <MdLanguage />
                  Language/Region Settings
                </h4>
                <div>
                  <p>
                    Choose preferred language or region for localized features.
                  </p>
                  {languageData && languageData.preferences == "language" ? (
                    <div class="success_msg"> {languageData.message}</div>
                  ) : (
                    ""
                  )}
                  {languageLoader && (
                    <div>
                      <div className="loading_overlay">
                        <FaSpinner className="loading" />
                      </div>
                    </div>
                  )}
                  <select
                    // defaultValue={userData.id ? userData.language : ""}
                    value={selectedLanguage}
                    onChange={(e) =>
                      handelLanguageRegion("language", e.target.value)
                    }
                  >
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
                    <option value="Brunei Darussalam">Brunei Darussalam</option>
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
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
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
                    <option value="Slovakia">Slovakia (Slovak Republic)</option>
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
                </div>

                <div>
                  <p>Choose standard currency option globally:</p>
                  {languageData && languageData.preferences == "currency" ? (
                    <div class="success_msg"> {languageData.message}</div>
                  ) : (
                    ""
                  )}
                  {currencyLoader && (
                    <div>
                      <div className="loading_overlay">
                        <FaSpinner className="loading" />
                      </div>
                    </div>
                  )}

                  <select
                    value={selectedCurrency} // Bind value to state
                    onChange={(e) =>
                      handelLanguageRegion("currency", e.target.value)
                    }
                  >
                    {currencies &&
                      currencies.map((currency) => (
                        <option value={currency}>{currency}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
