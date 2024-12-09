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

import React, { useState, useRef, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
// import "./AccountSettings.css";
import accountstyles from "./AccountSettings.css";

const AccountSettings = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [settingsMessage, setSettingsMessage] = useState("");

  const handleAccordionToggle = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
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
        <div className={accountstyles.accordionItem}>
          <div
            className={accountstyles.accordionHeader}
            onClick={() => handleAccordionToggle("password-management")}
          >
            Password Management
          </div>
          {activeAccordion === "password-management" && (
            <div className={accountstyles.accordionContent}>
              <div className={accountstyles.settingItem}>
                <h4>Two-Factor Authentication (2FA)</h4>
                <p>Enable or disable 2FA for added security.</p>
                <button
                  onClick={() => handleSaveMessage("2FA settings saved.")}
                >
                  Toggle 2FA
                </button>
              </div>
              <div className={accountstyles.settingItem}>
                <h4>Login Activity</h4>
                <p>View recent login locations and devices.</p>
                <ul>
                  <li>Device 1: New York, USA</li>
                  <li>Device 2: London, UK</li>
                </ul>
                <button
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
        <div className={accountstyles.accordionItem}>
          <div
            className={accountstyles.accordionHeader}
            onClick={() => handleAccordionToggle("preferences")}
          >
            Preferences
          </div>
          {activeAccordion === "preferences" && (
            <div className={accountstyles.accordionContent}>
              <div className={accountstyles.settingItem}>
                <h4>Notification Settings</h4>
                <p>Customize email or SMS notifications for:</p>
                <ul>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleSaveMessage("Notification settings saved.")
                        }
                      />
                      Domain inquiries/offers
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleSaveMessage("Notification settings saved.")
                        }
                      />
                      Payment updates
                    </label>
                  </li>
                </ul>
              </div>
              <div className={accountstyles.settingItem}>
                <h4>Language/Region Settings</h4>
                <p>
                  Choose preferred language or region for localized features.
                </p>
                <select
                  onChange={() => handleSaveMessage("Language settings saved.")}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
                <p>Choose standard currency option globally:</p>
                <select
                  onChange={() => handleSaveMessage("Currency settings saved.")}
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </select>
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
