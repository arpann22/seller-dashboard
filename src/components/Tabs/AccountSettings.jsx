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
const AccountSettings = ({ userData }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [is2FaEnabled, set2FaEnabled] = useState(false);

  const [loginActivity, setLoginActivity] = useState([]);
  const [activtyLoading, setActivityLoading] = useState(false);
  useEffect(() => {
    const two_fa_enabled = userData.two_fa_enabled;
    if (two_fa_enabled) {
      set2FaEnabled((prevState) => !prevState);
    }

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
        console.log("location data", data);
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

  const handleSaveMessage = (message) => {
    setSettingsMessage(message);
    setTimeout(() => setSettingsMessage(""), 3000); // Clear message after 3 seconds
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
        // window.location.reload();
      }
    } catch (err) {
      setTwoFaErrorMessage(err);
    } finally {
      setTwoFaLoading(false);
    }
  };

  const LogoutDevice = () => {
    return (
      // <div>
      //   <div>
      //     <p>Are you sure want to delete?</p>
      //   </div>
      //   <div>
      //     <input type="submit" value="Delete" onClick={handleDeleteConfirm} />
      //     <input type="submit" value="Cancel" onClick={handleDeleteCancel} />
      //   </div>
      // </div>

      <div className={styles.success_popup_overlay}>
        <div className={styles.success_popup}>
          <div>
            <p>Are you sure want to logout all devices.</p>
          </div>
          <div>
            <input
              type="submit"
              value="Ok"
              onClick={handleLogout}
              className={`${styles.okButton} ${styles.hover_blue_white}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={accountstyles.accountSettingsContainer}>
      {showPopup && <LogoutDevice />}

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
              {twoFaSucessMessage && <div> {twoFaSucessMessage} </div>}
              {twoFaErrorMessage && <div> {twoFaErrorMessage} </div>}
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
                  {loginActivity.map((location) => (
                    <li>{location}</li>
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
                  <li>
                    <div>
                      <span>Domain inquiries/offers</span>
                      <div
                        className={styles.toggle_button}
                        onClick={() =>
                          setNotificationToggles((prev) => ({
                            ...prev,
                            domain: !prev.domain,
                          }))
                        }
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
                  <li>
                    <div>
                      <span>Payment updates</span>
                      <div
                        className={styles.toggle_button}
                        onClick={() =>
                          setNotificationToggles((prev) => ({
                            ...prev,
                            payment: !prev.payment,
                          }))
                        }
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
                  <select
                    onChange={() =>
                      handleSaveMessage("Language settings saved.")
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <p>Choose standard currency option globally:</p>
                  <select
                    onChange={() =>
                      handleSaveMessage("Currency settings saved.")
                    }
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {settingsMessage && (
        <div className={accountstyles.settingsMessage}>{settingsMessage}</div>
      )}
    </div>
  );
};

export default AccountSettings;
