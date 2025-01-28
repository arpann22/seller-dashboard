import { useState, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import { FiMail } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import profileImage from "./images/profile.jpg";
import editProfileIcon from "./images/edit-profile.png";
import { ReactComponent as EditProfileIcon } from "./image/edit_profil.svg";
import { ReactComponent as EmailIcon } from "./image/email.svg";
import { FaSpinner } from "react-icons/fa";
export default function UserDetails({ userData, setUserData }) {
  // const currentUrl = "https://new-webstarter.codepixelz.tech";
  const currentUrl = window.location.origin;
  // const [userData, setUserData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    user_email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    profile_picture: null, // Profile picture state
  });
  const [imagePreview, setImagePreview] = useState(null); // Preview URL state

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        profile_picture: file, // Update profile_picture in formData
      }));
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  useEffect(() => {
    // Fetch API data
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
        // Populate the form with the API data
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          display_name: user.display_name || "",
          user_email: user.user_email || "",
          current_password: "",
          new_password: "",
          confirm_password: "",
          profile_picture: null, // Profile picture state
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Toggle popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle input change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     profile_picture: file,
  //   }));
  // };

  // // password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (password) {
      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }
    }
    return ""; // No validation errors
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    setSuccessMessage("");
    setIsLoading(true);

    // Check if the current password is provided when new password is being set
    if (formData.new_password || formData.confirm_password) {
      if (!formData.current_password) {
        setErrorMessage("Current Password is required to change the password.");
        setIsLoading(false);
        return;
      }
    }
    // Validate the new password
    const passwordValidationError = validatePassword(formData.new_password);
    if (passwordValidationError) {
      setErrorMessage(passwordValidationError);
      setIsLoading(false);
      return; // Prevent form submission
    }

    // Check if new password and confirm password match
    if (formData.new_password !== formData.confirm_password) {
      setErrorMessage("New Password and Confirm Password do not match");
      setIsLoading(false);
      return; // Prevent form submission
    }
    // Send the form data to the server (or process it)
    const formSubmissionData = new FormData();
    formSubmissionData.append("first_name", formData.first_name);
    formSubmissionData.append("last_name", formData.last_name);
    formSubmissionData.append("display_name", formData.display_name);
    formSubmissionData.append("current_password", formData.current_password);
    formSubmissionData.append("new_password", formData.new_password);
    formSubmissionData.append("profile_image", formData.profile_picture); // Appe
    // To check the contents of FormData:

    // Send the form data to the server
    fetch(`${currentUrl}/wp-json/wstr/v1/update-user/${userData.id}`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      //   // "X-WP-Nonce": wpApiSettings.nonce, // Uncomment this if using nonce for authentication
      // },
      credentials: "include", // Include cookies to send authentication information
      // body: JSON.stringify(requestData),
      body: formSubmissionData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "An error occurred");
          });
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        // setIsPopupOpen(false);
        setSuccessMessage("Profile updated successfully!"); // Set success message
        setTimeout(() => {
          setIsPopupOpen(false);
        }, 1500);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating profile:", error);
        setErrorMessage(error.message); // Display the error message to the user
      });
  };
  // console.log(userData);
  return (
    <div className={styles.profileSection}>
      <div className={`${styles.profileDetails} ${styles.ws_flex}`}>
        {userData.user_image && (
          <img
            src={userData.user_image ? userData.user_image : profileImage}
            alt={userData.display_name}
            className={styles.profileImage}
          />
        )}
        {/* <img src={profileImage} alt="Profile" className={styles.profileImage} /> */}
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
          {/* <img
            src={editProfileIcon}
            alt="Edit Profile"
            className={styles.icon}
          /> */}
          <div className={styles.svg_bg_white}>
            <EditProfileIcon />
          </div>
          Edit Profile
        </button>
        <div className={`${styles.p_relative}  ${styles.wstr_message_icon}`}>
          <div className={`${styles.svg_bg_white} ${styles.mailIcon}`}>
            <EmailIcon />
          </div>
          {/* <FiMail className={styles.mailIcon} /> */}
          <span className={styles.mailNotifications}>
            <p>2</p>
          </span>
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popupContent} ${styles.editProfilePopup}`}>
            <div className={styles.editProfileHeader}>
              {/* Close icon in top-right */}
              <AiOutlineClose
                className={styles.closeIcon}
                onClick={togglePopup} // Close popup when clicked
              />
              <h2>Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                First name
                <input
                  type="text"
                  value={formData.first_name}
                  name="first_name"
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  value={formData.last_name}
                  name="last_name"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className={styles.fw_100}>
                Display Name:
                <input
                  type="text"
                  value={formData.display_name}
                  name="display_name"
                  onChange={handleChange}
                  required
                />
                <span>
                  This will be how your name will be displayed in the account
                  section and in reviews
                </span>
              </label>

              <label className={styles.fw_100}>
                Email:
                <input
                  type="email"
                  value={formData.user_email}
                  name="user_email"
                  onChange={handleChange}
                  readOnly
                />
              </label>

              <label className={styles.fw_100}>
                Profile Picture
                <div className={styles.customFileInput}>
                  <input
                    type="file"
                    name="profile_picture"
                    onChange={handleFileChange} // File input change handler
                    id="fileInput"
                    className={styles.hiddenInput}
                  />
                  <label htmlFor="fileInput" className={styles.customFileLabel}>
                    <i className="fas fa-upload"></i> Upload Your Photo
                  </label>
                </div>
                {/* Image preview */}
                {imagePreview && (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        borderRadius: "10px", // Circular preview
                        border: "transparent",
                      }}
                    />
                  </div>
                )}
                <span>Add your profile picture</span>
              </label>
              <h4>Change Password:</h4>
              <div className={styles.edit_password_wrapper}>
                <label className={styles.fw_100}>
                  <p>
                    Current Password{" "}
                    <span>(leave blank to leave unchanged)</span>
                  </p>
                  <input
                    type="password"
                    value={formData.current_password}
                    name="current_password"
                    onChange={handleChange}
                  />
                </label>
                <label className={styles.fw_100}>
                  {" "}
                  <p>
                    New Password <span>(leave blank to leave unchanged)</span>
                  </p>
                  <input
                    type="password"
                    value={formData.new_password}
                    name="new_password"
                    onChange={handleChange}
                  />
                </label>
                <label className={styles.fw_100}>
                  Confirm New Password
                  <input
                    type="password"
                    value={formData.confirm_password}
                    name="confirm_password"
                    onChange={handleChange}
                  />
                </label>
                {isLoading && (
                  <div className="loading_overlay">
                    <FaSpinner className="loading" />
                  </div>
                )}
                {errorMessage && (
                  <p class="error_msg" style={{ color: "red" }}>
                    {errorMessage}
                  </p>
                )}
                {successMessage && <p class="success_msg">{successMessage}</p>}
              </div>
              <button type="submit" className="hover-white">
                Save Changes
              </button>
            </form>
            {/* {formData} */}
          </div>
        </div>
      )}
    </div>
  );
}
