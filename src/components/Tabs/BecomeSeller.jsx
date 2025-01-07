import { useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
const currentUrl = window.location.origin;
export default function BecomeSeller({ userData, refreshTabs }) {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [sellerSuccess, setSellerSuccess] = useState(false);

  const [showPopup, setShowPopup] = useState(true);

  console.log("become a seller", isChecked);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (isChecked) {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/become-seller/${userData.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              check: "hello",
              become_seller: isChecked,
            }),
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();

        if (data) {
          setSellerSuccess(true);
          // location.reload();
        }
      } catch (err) {
        setError(err);
        console.log(err);
      }
    }
  }

  function handleSellerSuccess() {
    window.location.reload();
    setShowPopup(false);
  }

  const Become_seller = () => {
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
      showPopup && (
        <div className={styles.success_popup_overlay}>
          <div className={styles.success_popup}>
            <div>
              <p>Congratulations! You are now a seller</p>
            </div>
            <div>
              <input
                type="submit"
                value="Ok"
                onClick={handleSellerSuccess}
                className={`${styles.okButton} ${styles.hover_blue_white}`}
              />
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <div className={styles.becomeSellerWrapper}>
      {sellerSuccess && <Become_seller />}
      <form onSubmit={handleSubmit} className={styles.become_seller_form}>
        <h4>Vendor Application</h4>
        <p>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            required
          />{" "}
          I have read and accepted the{" "}
          <a href="/terms-conditions/">terms and conditions.</a>
        </p>
        <input
          type="submit"
          value="Become a Seller"
          className={styles.hover_blue_white}
        />
      </form>

      {error && <p> {error}</p>}
    </div>
  );
}
