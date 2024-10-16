import { useState, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import { FiMail } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import profileImage from "./images/profile.jpg";
import editProfileIcon from "./images/edit-profile.png";

export default function UserDetails() {
  const [userData, setUserData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  useEffect(() => {
    fetch("http://localhost:10038/wp-json/wstr/v1/login", {
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
        setUserData(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className={styles.profileSection}>
      <div className={`${styles.profileDetails} ${styles.ws_flex}`}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        <MdVerifiedUser />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{userData.user_login}</h2>
          <p className={styles.profileEmail}>{userData.user_email}</p>
        </div>
      </div>

      <div className={styles.profile_detail_buttons}>
        <button
          className={`${styles.editProfileButton} ${styles.button_icon_wrapper}`}
          onClick={togglePopup} // Toggle the popup on click
        >
          <img
            src={editProfileIcon}
            alt="Edit Profile"
            className={styles.icon}
          />
          Edit Profile
        </button>
        <div className={styles.p_relative}>
          <FiMail className={styles.mailIcon} />
          <span className={styles.mailNotifications}>
            <p>2</p>
          </span>
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popupContent} ${styles.editProfilePopup}`}>
            {/* Close icon in top-right */}
            <AiOutlineClose
              className={styles.closeIcon}
              onClick={togglePopup} // Close popup when clicked
            />
            <h2>Edit Profile</h2>
            <form>
              <label>
                Username:
                <input type="text" value={userData.user_login} readOnly />
              </label>
              <label>
                Email:
                <input type="email" value={userData.user_email} readOnly />
              </label>
              {/* Add any other fields */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
