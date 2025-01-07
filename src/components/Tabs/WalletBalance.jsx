import React from "react";
import styles from "./Tabs.module.css"; // Import styles
import available_balance_circle from "./images/SHAPES_available_balance.png";
import { ReactComponent as AvailableBalanceIcon } from "./image/balance.svg";
// import available_balance_right_icon from "./images/available_balance_right_icon.png";
import { IoMdInformationCircle } from "react-icons/io";
const WalletBalance = () => {
  return (
    <>
      <div
        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
      >
        <div className={styles.small_svg}>
          <AvailableBalanceIcon />
        </div>
        <h4>Available Balance</h4>
      </div>
      <div className={styles.available_balance_card}>
        <div
          className={`${styles.available_balance_card_shapes} ${styles.justify_space_between} ${styles.ws_flex}`}
        >
          <img src={available_balance_circle}></img>
          {/* <img src={available_balance_right_icon}></img> */}
          <div className={styles.balanceInfoIcon}>
            <IoMdInformationCircle />
          </div>
        </div>
        <div>
          <h5>Account Balance</h5>
          <h2 className="ws_text_center">
            205,700 <span>USD</span>
          </h2>
        </div>
        <div
          className={`${styles.available_balance_card_footer} ${styles.ws_flex} ${styles.f_wrap}`}
        >
          <div>
            <h6>Holder</h6>
            <h5>Jenny Remigton</h5>
          </div>
          <div>
            <h6>Payment Method</h6>
            <h5>PAYPAL</h5>
          </div>
          <div>
            <button>Request Payout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
