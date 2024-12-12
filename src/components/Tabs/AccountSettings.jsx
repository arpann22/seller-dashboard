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

import React, { useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
import accountstyles from "./AccountSettings.module.css";
import { FaPlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { TbPasswordUser } from "react-icons/tb";
import { Si2Fas } from "react-icons/si";
import { GrLogin } from "react-icons/gr";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdLanguage } from "react-icons/md";

const AccountSettings = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [isLeaseToOwnEnabled, setLeaseToOwnEnabled] = useState(false);

  // State for Notification Toggles
  const [notificationToggles, setNotificationToggles] = useState({
    domain: false,
    payment: false,
  });

  const handleAccordionToggle = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  const handleLeaseToOwnToggle = () => {
    setLeaseToOwnEnabled((prevState) => !prevState);
  };

  const handleSaveMessage = (message) => {
    setSettingsMessage(message);
    setTimeout(() => setSettingsMessage(""), 3000); // Clear message after 3 seconds
  };

  return (
    <div className={accountstyles.accountSettingsContainer}>
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

                <div
                  className={styles.toggle_button}
                  onClick={handleLeaseToOwnToggle}
                >
                  <div
                    className={`${styles.toggle_switch} ${
                      isLeaseToOwnEnabled ? styles.on : styles.off
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
                <p>View recent login locations and devices.</p>
                <ul className={accountstyles.loggedInDevices}>
                  <li>Device 1: New York, USA</li>
                  <li>Device 2: London, UK</li>
                </ul>
                <button
                  className={styles.hover_blue_white}
                  onClick={() =>
                    handleSaveMessage("Logged out of all devices.")
                  }
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
