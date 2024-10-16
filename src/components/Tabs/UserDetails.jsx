import { useState, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import { FiMail } from "react-icons/fi";
import profileImage from "./images/profile.jpg";
import { MdVerifiedUser } from "react-icons/md";
import editProfileIcon from "./images/edit-profile.png";

export default function UserDetails() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch("http://webstarter.local/wp-json/wstr/v1/login", {
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
        setUserData(data[0]); // Assuming the response is a string like 'hey' or 'hello'
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array means this runs once on mount

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
    </div>
  );
}
