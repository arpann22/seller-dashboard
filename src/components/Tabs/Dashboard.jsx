import React, { useState, useRef, useEffect } from "react";
import styles from "./Tabs.module.css"; // Import styles
import "./Dashboard.css";
import { ReactComponent as ThreeDots } from "./image/menu.svg";
import { ReactComponent as ForSaleIcon } from "./image/domaine.svg";
import { ReactComponent as TotalSoldIcon } from "./image/sold.svg";
import { ReactComponent as SaleCurrentIcon } from "./image/sales.svg";
import { ReactComponent as SalesAllTimeIcon } from "./image/all_time.svg";
import { ReactComponent as Reviews } from "./image/reviews.svg";
import { ReactComponent as Followers } from "./image/followers.svg";
import { HiDotsVertical } from "react-icons/hi";
import { FaCircle, FaSpinner } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import domain_img from "./images/chatseek.com.png";
import plus_bg_icon from "./images/plus-bg-icon.png";
import cust_img from "./images/cust_image.png";
import domains_add_domain_img from "./images/domains_add_domain_img.png";
import WalletBalance from "./WalletBalance.jsx";
// import CustReviews from "./CustReviews";

const progress = 50; //
const currentUrl = window.location.origin;
// const currentUrl = "https://new-webstarter.codepixelz.tech";

//const currentUrl = window.location.origin;

const Dashboard = ({
  userData,
  soldDomains,
  salesAllTime,
  salesCurrentYear,
  setSellerCentralTab,
  getPayouts,
  setGetPayouts,
  paymentMethod,
  setPaymentMethod,
}) => {
  function handleManageOffers() {
    setSellerCentralTab("Manage Offers");
  }
  function handleAddDomainRedirect() {
    setSellerCentralTab("Add New Domain");
  }

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchDomainsForSale() {
      try {
        setLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain?author=${userData.id}&per_page=999&_embed`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();

        setDomains(data);
      } catch (err) {
        console.log(err);
        // setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userData.id) {
      fetchDomainsForSale();
    }
  }, [userData.id]);

  const currentUrl = window.location.origin;
  const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded

  // manage offers section starts ----------------------------------------------
  const [offers, setOffers] = useState([]);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  const [pendingAcceptedOffers, setPendingAcceptedOffers] = useState([]);
  const [declinedOffers, setDeclinedOffers] = useState([]);

  async function fetchOffers() {
    // Fetch offers from the API
    try {
      setOfferLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/manage-offers/${userData.id}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setOfferError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setOffers(data);
        // Filter offers with status "pending" or "accepted"
        const pending_accepted_offers = data.filter(
          (offer) => offer.status === "pending" || offer.status === "accepted"
        );
        setPendingAcceptedOffers(pending_accepted_offers);

        const declined_offers = data.filter(
          (offer) => offer.status == "declined"
        );
        setDeclinedOffers(declined_offers);
      }
    } catch (error) {
      setOfferError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setOfferLoading(false);
    }
  }
  useEffect(() => {
    if (userData.id) {
      fetchOffers();
    }
  }, [userData.id]);

  // Format offers and include formatted expiry dates for the first three offers
  const offersWithFormattedDates = offers.map((offer, index) => {
    if (index >= 3) return offer; // Return the offer as-is if beyond the first three

    const dateString = offer?.offer_expiry_date ? offer.offer_expiry_date : "";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Calculate days left until expiry
    const currentDate = new Date();
    const timeDiff = date - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return {
      ...offer,
      formattedDate,
      isExpiringSoon: daysLeft <= 7 && daysLeft >= 0,
    };
  });
  // manage offers section ends ----------------------------------------------

  // community sections starts -----------------------------------------------
  const [communityDetails, setCommunityDetails] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState("");
  async function get_community_details() {
    try {
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/community/${userData.id}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        setCommunityError(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setCommunityDetails(data);
      }
      console.log("community", data);
    } catch (error) {
      setCommunityError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCommunityLoading(false);
    }
  }
  useEffect(() => {
    if (userData.id) {
      get_community_details();
    }
  }, [userData]);

  // community sections ends -----------------------------------------------

  return (
    <>
      <div
        className={`${styles.wallet_top_wrapper} ${styles.ws_flex} ${styles.dashboard_top_wrapper} ${styles.tabs_fd_col}`}
      >
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>Sales Report</h4>
            {/* <HiDotsVertical /> */}
          </div>
          {loading ? (
            <div>
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="dashboard_reports_wrapper">
            <div
              className={`${styles.single_sales_wrapper} dashboard_reports_report_single`}
            >
              <div className={styles.single_sales_data}>
                <h2 className={`${styles.m_0} ${styles.ws_text_start}`}>
                  {domains ? domains.length : 0}
                </h2>
                <p className={styles.m_0}>Domains for sale</p>
              </div>
              <div className={styles.single_sales_icon}>
                <ForSaleIcon />
              </div>
            </div>
            <div
              className={`${styles.single_sales_wrapper} dashboard_reports_report_single`}
            >
              <div className={styles.single_sales_data}>
                <h2 className={`${styles.m_0} ${styles.ws_text_start}`}>
                  {soldDomains ? soldDomains.length : 0}
                </h2>
                <p className={styles.m_0}>Total Domains sold</p>
              </div>
              <div className={styles.single_sales_icon}>
                <TotalSoldIcon />
              </div>
            </div>
            <div
              className={`${styles.single_sales_wrapper} dashboard_reports_report_single`}
            >
              <div className={styles.single_sales_data}>
                <h2 className={`${styles.m_0} ${styles.ws_text_start}`}>
                  ${salesCurrentYear ? salesCurrentYear : 0}
                </h2>
                <p className={styles.m_0}>Sale current year</p>
              </div>
              <div className={styles.single_sales_icon}>
                <SaleCurrentIcon />
              </div>
            </div>
            <div
              className={`${styles.single_sales_wrapper} dashboard_reports_report_single`}
            >
              <div className={styles.single_sales_data}>
                <h2 className={`${styles.m_0} ${styles.ws_text_start}`}>
                  {/* $2,450.00 */}${salesAllTime ? salesAllTime : 0}
                </h2>
                <p className={styles.m_0}>Sales-all time</p>
              </div>
              <div className={styles.single_sales_icon}>
                <SalesAllTimeIcon />
              </div>
            </div>
          </div>
        </div>
        {/* Payment Method */}
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>Commissions</h4>
            {/* <HiDotsVertical /> */}
          </div>
          <div className="dashboard_commission_cards">
            <div
              className={`${styles.fd_column} dashboard_commission_card paid_commission`}
            >
              <div className="dashboard_commission_card_left">
                <h4>Paid Commissions</h4>
                <div className="commission_details">
                  <div className={`${styles.ws_flex} ${styles.gap_20}`}>
                    <h6>Total Paid:</h6>
                    <h6>$20,000.00</h6>
                  </div>
                  <div
                    className={`${styles.ws_flex} ${styles.gap_20} ${styles.mt_5}`}
                  >
                    <h6>Last Paid:</h6>
                    <h6>24 July, 2024</h6>
                  </div>
                  <div className="commission_profile_detail">
                    <img src={cust_img} alt="Domain" />
                    <div class="commission_profile_text-section">
                      <h6>Top Buyer</h6>
                      <h5>Charles Bedford</h5>
                    </div>
                    {/* <div
                      className={`${styles.svg_wrapper_bg_grey} commissions_profile_mail`}
                    >
                      <FiMail />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="dashboard_commission_card_right">
                <div className="progress_circle">
                  <svg width="80" height="80" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f3f5fa"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgb(245, 185, 3)"
                      strokeWidth="3.2"
                      strokeDasharray={`${progress}, 100`}
                    />
                    <foreignObject x="9" y="12" width="20" height="16">
                      <h2
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="progress_text"
                      >
                        {`${progress}%`}
                      </h2>
                    </foreignObject>
                    <foreignObject x="5" y="22" width="20" height="10">
                      <h6
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="progress_subtext"
                      >
                        #Paid 21
                      </h6>
                    </foreignObject>
                  </svg>
                </div>
              </div>
            </div>
            <div
              className={`${styles.fd_column} dashboard_commission_card due_commission`}
            >
              <div className="dashboard_commission_card_left">
                <h4>Due Commissions</h4>
                <div className="commission_details">
                  <div className={`${styles.ws_flex} ${styles.gap_20}`}>
                    <h6>Total Due:</h6>
                    <h6>$20,000.00</h6>
                  </div>
                  <div className={`${styles.ws_flex} ${styles.gap_20}`}>
                    <h6>Next Due:</h6>
                    <h6>24 July, 2024</h6>
                  </div>
                  <div className="commission_profile_detail">
                    <img src={cust_img} alt="Domain" />
                    <div class="commission_profile_text-section">
                      <h6>Top Owed</h6>
                      <h5>Charles Bedford</h5>
                    </div>
                    {/* <div
                      className={`${styles.svg_wrapper_bg_grey} commissions_profile_mail`}
                    >
                      <FiMail />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="dashboard_commission_card_right">
                <div className="progress_circle">
                  <svg width="80" height="80" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f3f5fa"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#00d9f5"
                      strokeWidth="3.2"
                      strokeDasharray={`${progress}, 100`}
                    />
                    <foreignObject x="9" y="12" width="20" height="16">
                      <h2
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="progress_text"
                      >
                        {`${progress}%`}
                      </h2>
                    </foreignObject>
                    <foreignObject x="5" y="22" width="20" height="10">
                      <h6
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="progress_subtext"
                      >
                        #Due 7
                      </h6>
                    </foreignObject>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${styles.dashboard_small_margin} dashboard_active_domain_wrapper`}
      >
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} dashboard_active_domain_title_wrapper`}
        >
          {/* <img src={active_domains_icon}></img> */}
          <h4>Recent Offers</h4>
          <h5 onClick={handleManageOffers}>Manage Offers</h5>
        </div>
        {offerLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {offerError && <div className="cancelled">{offerError}</div>}
        {offers.length == 0 && offerLoading == false ? (
          <div className={`${styles.order_error_msg} error_msg`}>
            <div>No Offers at the Moment. </div>
          </div>
        ) : (
          ""
        )}
        <div
          className={`${styles.dashboard_small_margin} dashboard_domains_cards_wrapper`}
        >
          {offersWithFormattedDates &&
            offersWithFormattedDates.map((offer, index) => {
              let status = "";
              if (offer?.status == "pending") {
                status = "Pending";
              } else if (offer?.status == "accepted") {
                status = "Accepted";
              } else if (offer?.status == "declined") {
                status = "Declined";
              }

              const formatDate = (dateString) => {
                const date = new Date(dateString);
                const options = {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                };
                return date.toLocaleDateString("en-US", options);
              };

              // Example usage
              // const inputDate = "2025-01-14 16:23:29";
              const formattedDate = formatDate(offer.created_at);
              return (
                <div
                  key={index}
                  className="swiper-slide ws-cards-container-noHover p_relative ws_cards_domains_active_draft"
                >
                  {/* Premium Icon */}
                  <div className="premium_icon status">
                    <h6 className={`${styles.offer_status} ${offer.status}`}>
                      <FaCircle />
                      {status}
                    </h6>
                  </div>

                  {/* <div className="reviews_images_lists ws_flex jc_center ai_center dashboard_offer_customers">
                    <img src={offer.buyer_image} />
                    <img src={offer.buyer_image} />
                    <span>+3</span>
                  </div> */}

                  {/* Card Image */}
                  <div className="ws-card-img">
                    <img src={offer.domain_image} />
                  </div>

                  {/* Card Contents */}
                  <div className="ws-card-contents ws-flex">
                    <img src={offer.buyer_image} />
                    <span className="ws-card-inner-contents">
                      <h6>{offer.buyer_name || "Unknown Name"}</h6>
                      <div className="ws_card_price_wrapper ws_flex gap_10">
                        {/* <p className="regular_price">${offer.regularPrice}</p> */}
                        <p className="sale_price">${offer.offer_amount}</p>
                      </div>
                      <h6>{formattedDate}</h6>
                    </span>
                    <div className="ws-card-manage">
                      <a onClick={handleManageOffers}>
                        <h6 onClick={handleManageOffers}>MANAGE</h6>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* stataic add domain  */}
          <div
            className="ws-cards-container-noHover swiper-slide dashboard_domain_cards ws-cards-container-add-domain"
            onClick={handleAddDomainRedirect}
          >
            {/* Card Image */}
            <div className="ws-card-img">
              <img src={domains_add_domain_img} />
            </div>
            <div className="ws-card-contents ws-flex">
              <div>
                <img src={plus_bg_icon} />
              </div>
              <span className="ws-card-inner-contents">
                <h5>Add new Domain !</h5>
                <div className="ws_card_price_wrapper ws_flex gap_10 ws_card_price_wrapper_add_domain">
                  <p>Start Earning</p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/*bottom row */}
      <div
        className={`${styles.wallet_top_wrapper} ${styles.ws_flex} ${styles.dashboard_small_margin} ${styles.tabs_fd_col}  `}
      >
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>From Community</h4>
            {/* <HiDotsVertical /> */}
          </div>
          <div className={`${styles.tablet_fd_col} dashboard_community_cards `}>
            <div className="dashboard_community_card community_reviews">
              <div class="reviews_images_lists ws_flex jc_center ai_center">
                <img src={cust_img} />
                <img src={cust_img} />
                <img src={cust_img} />
                <img src={cust_img} />
                <span>+3</span>
              </div>
              <div
                className={`${styles.community_card_content_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_20} community_card_content_wrapper`}
              >
                <div className={styles.svg_wrapper_bg}>
                  <Reviews />
                </div>
                <div className={styles.community_card_detail_wrapper}>
                  <h2 className="ws_text_start">74</h2>
                  <p>
                    {/* People have viewed <span>your domains</span> */}
                    People have viewed your domains.
                  </p>
                </div>
              </div>
            </div>
            <div className="dashboard_community_card community_followers">
              <div class="reviews_images_lists ws_flex jc_center ai_center">
                {communityDetails.offered_images &&
                  communityDetails.offered_images
                    .slice(0, 4)
                    .map((details, index) => (
                      <img
                        key={index}
                        src={details}
                        alt={`Offer ${index + 1}`}
                      />
                    ))}
                {communityDetails.offered_images &&
                  communityDetails.offered_images.length > 4 && (
                    <span>+{communityDetails.offered_images.length - 4}</span>
                  )}
              </div>
              <div
                className={`${styles.community_card_content_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_20} community_card_content_wrapper`}
              >
                <div className={styles.svg_wrapper_bg}>
                  <Followers />
                </div>
                <div className={styles.community_card_detail_wrapper}>
                  <h2 className="ws_text_start">
                    {communityDetails?.buyer_count
                      ? communityDetails.buyer_count
                      : 0}
                  </h2>
                  <p>
                    {/* F</h2>ollowers <span>+5 This Month</span> */}
                    People have sent an offer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.wallet_available_balance} dashboard_cust_reviews_wrapper`}
        >
          {/* <CustReviews /> */}
          <WalletBalance
            userData={userData}
            paymentMethod={paymentMethod}
            setGetPayouts={setGetPayouts}
            getPayouts={getPayouts}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard; // Export the component
