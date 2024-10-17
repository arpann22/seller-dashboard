import { useState, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import { FiMail } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import profileImage from "./images/profile.jpg";
import editProfileIcon from "./images/edit-profile.png";

export default function UserDetails() {
  const [userData, setUserData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    user_email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    // Fetch API data
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
        const user = data[0];
        setUserData(user);
        // Populate the form with the API data
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          display_name: user.display_name || "",
          user_email: user.user_email || "",
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Toggle popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle input change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the form data to the server (or process it)
    console.log("Form submitted:", formData);

    // // Example of posting the data (adjust the endpoint as needed)
    // fetch("http://webstarter.local/wp-json/wstr/v1/update-profile", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Profile updated:", data);
    //     // Close popup on successful update
    //     setIsPopupOpen(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error updating profile:", error);
    //   });
  };

  return (
    <div className={styles.profileSection}>
      <div className={`${styles.profileDetails} ${styles.ws_flex}`}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />
        <MdVerifiedUser />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{userData.display_name}</h2>
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
                First name
                <input
                  type="text"
                  value={userData.first_name}
                  name="first_name"
                  onChange={handleChange}
                />
              </label>

              <label>
                Last name <input type="text" value={userData.last_name} />
              </label>

              <label>
                {userData.user_login}
                Display Name:
                <input type="text" value={userData.display_name} />
                <span>
                  This will be how your name will be displayed in the account
                  section and in reviews
                </span>
              </label>

              <label>
                Email:
                <input type="email" value={userData.user_email} />
              </label>

              <label>
                Profile Picture
                <input type="file" />
                <span>Add your profile picture</span>
              </label>
              <div>
                <h2>Password Changed</h2>
                <label>
                  Current Password (leave blank to leave unchanged)
                  <input type="password" />
                </label>
                <label>
                  New Password (leave blank to leave unchanged)
                  <input type="password" />
                </label>
                <label>
                  Confirm New Password <input type="password" />
                </label>
              </div>
              {/* Add any other fields */}
            </form>
            {/* {formData} */}
          </div>
        </div>
      )}
    </div>
  );
}
