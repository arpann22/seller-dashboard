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

const progress = 50; //
const currentUrl = window.location.origin;

const Dashboard = ({ userData }) => {
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
        // console.log(data)
        setDomains(data);
      } catch (err) {
        // setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userData.id) {
      fetchDomainsForSale();
    }
  }, [userData.id]);

  const [soldDomains, setSoldDomains] = useState([]);

  // fetching order ids by seller id
  useEffect(() => {
    async function fetchOrderBysellerId() {
      try {
        // setLoading(true);
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/sales-order/${userData.id}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        console.log(data);
        setSoldDomains(data);
      } catch (err) {
        // setError(err);
        // console.log(err);
      } finally {
        // setLoading(false);
      }
    }
    if (userData.id) {
      fetchOrderBysellerId();
    }
  }, [userData.id]);

  // Fetch all order details based on the order IDs
  const [orderDetails, setOrderDetails] = useState();
  const [salesCurrentYear, setSalesCurrentYear] = useState(0);
  const [salesAllTime, setSalesAllTime] = useState(0);

  useEffect(() => {
    if (soldDomains.length > 0) {
      async function fetchAllOrderDetails() {
        try {
          const orderDetailsPromises = soldDomains.map(async (orderId) => {
            const res = await fetch(
              `${currentUrl}/wp-json/wp/v2/domain_order/${orderId}`
            );
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message);
            }
            return res.json(); // Return the order data
          });

          const allOrderDetails = await Promise.all(orderDetailsPromises);
          setOrderDetails(allOrderDetails);
          console.log(allOrderDetails);

          // // storing customer ids
          // const customerIds = allOrderDetails.map((order) => {
          //   return order?.meta?._customer?.[0];
          // });
          // setCustomerIds(customerIds);
          const currentYear = new Date().getFullYear();

          let salesCurrentYear = 0;
          let salesAllTime = 0;
          allOrderDetails.forEach((order) => {
            const date_created = order?.meta?._date_created?.[0];
            const orderTotal = parseFloat(order?.meta?._order_total?.[0] || 0); // Convert to number

            if (date_created) {
              // Parse the year from the date_created string
              const orderYear = new Date(date_created).getFullYear();

              // Add to current year sales if the year matches
              if (orderYear === currentYear) {
                salesCurrentYear += orderTotal;
              }
            }

            // Add to all-time sales
            salesAllTime += orderTotal;
          });
          setSalesCurrentYear(salesCurrentYear);
          setSalesAllTime(salesAllTime);
        } catch (err) {
          // setError(err.message);
        }
      }

      fetchAllOrderDetails();
    }
  }, [soldDomains]);

  return (
    <>
      <div
        className={`${styles.wallet_top_wrapper} ${styles.ws_flex} ${styles.dashboard_top_wrapper}`}
      >
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>Sales Report</h4>
            <HiDotsVertical />
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
            <HiDotsVertical />
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
                    <div className={styles.svg_wrapper_bg_grey}>
                      <FiMail />
                    </div>
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
                    <div className={styles.svg_wrapper_bg_grey}>
                      <FiMail />
                    </div>
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
          <h5>Manage Offers</h5>
        </div>
        <div
          className={`${styles.dashboard_small_margin} dashboard_domains_cards_wrapper`}
        >
          <div className="swiper-slide ws-cards-container-noHover p_relative ws_cards_domains_active_draft">
            {/* Premium Icon */}
            <div className="premium_icon status">
              <h6
                className={`${styles.offer_status} ${styles.pending} pending`}
              >
                <FaCircle />
                Pending
              </h6>
            </div>

            <div class="reviews_images_lists ws_flex jc_center ai_center dashboard_offer_customers">
              <img src={cust_img} />
              <img src={cust_img} />
              <span>+3</span>
            </div>

            {/* Hover buttons */}
            {/* <div class="domains_hover_buttons">
              <div
                className="domianEditIcon"
                onClick={() => handleIconClick(domain.id)}
              >
                <img src={save_draft_icon} />
              </div>
              <div>
                <img src={add_product_icon} />
              </div>
              <div>
                <img src={delete_reset_icon} />
              </div>
            </div> */}
            {/* Card Image */}
            <div className="ws-card-img">
              <img src={domain_img || "default-image.png"} />
            </div>
            {/* Card Contents */}
            <div className="ws-card-contents ws-flex">
              {/* <Logo
                logoImageId={logoImageId}
                domain_title={domain.title.rendered}
                featuredImageUrl={featuredImageUrl}
              /> */}
              <img src={cust_img || "default-image.png"} />
              <span className="ws-card-inner-contents">
                <h6>Hamar Sheriff</h6>
                <div className="ws_card_price_wrapper ws_flex gap_10">
                  {/* <p className="regular_price">$2000</p> */}
                  <p className="sale_price">$1500</p>
                </div>
                <h6>25 July, 2024</h6>
              </span>
              <div className="ws-card-manage">
                <h6>MANAGE</h6>
              </div>
            </div>
          </div>
          {/* card 2 */}
          <div className="swiper-slide ws-cards-container-noHover p_relative ws_cards_domains_active_draft">
            {/* Premium Icon */}
            <div className="premium_icon status">
              <h6
                className={`${styles.offer_status} ${styles.pending} counter_offer`}
              >
                <FaCircle />
                Counter Offer
              </h6>
            </div>

            {/* <div class="reviews_images_lists ws_flex jc_center ai_center dashboard_offer_customers">
              <img src={cust_img} />
              <img src={cust_img} />
              <span>+3</span>
            </div> */}

            {/* Hover buttons */}
            {/* <div class="domains_hover_buttons">
              <div
                className="domianEditIcon"
                onClick={() => handleIconClick(domain.id)}
              >
                <img src={save_draft_icon} />
              </div>
              <div>
                <img src={add_product_icon} />
              </div>
              <div>
                <img src={delete_reset_icon} />
              </div>
            </div> */}
            {/* Card Image */}
            <div className="ws-card-img">
              <img src={domain_img || "default-image.png"} />
            </div>
            {/* Card Contents */}
            <div className="ws-card-contents ws-flex">
              {/* <Logo
                logoImageId={logoImageId}
                domain_title={domain.title.rendered}
                featuredImageUrl={featuredImageUrl}
              /> */}
              <img src={cust_img || "default-image.png"} />
              <span className="ws-card-inner-contents">
                <h6>Hamar Sheriff</h6>
                <div className="ws_card_price_wrapper ws_flex gap_10">
                  {/* <p className="regular_price">$2000</p> */}
                  <p className="sale_price">$1500</p>
                </div>
                <h6>25 July, 2024</h6>
              </span>
              <div className="ws-card-manage">
                <h6>MANAGE</h6>
              </div>
            </div>
          </div>
          {/* stataic add domain  */}
          <div className="ws-cards-container-noHover swiper-slide dashboard_domain_cards ws-cards-container-add-domain">
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
                <div className="ws_card_price_wrapper ws_flex gap_10">
                  <p>Start Earning</p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/*bottom row */}
      <div
        className={`${styles.wallet_top_wrapper} ${styles.ws_flex} ${styles.dashboard_small_margin} `}
      >
        <div className={styles.wallet_available_balance}>
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>From Community</h4>
            <HiDotsVertical />
          </div>
          <div className={`${styles.fd_column} dashboard_community_cards `}>
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
                    Reviews <span>+5 This Month</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="dashboard_community_card community_followers">
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
                  <Followers />
                </div>
                <div className={styles.community_card_detail_wrapper}>
                  <h2 className="ws_text_start">74</h2>
                  <p>
                    Followers <span>+5 This Month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.wallet_available_balance} dashboard_cust_reviews_wrapper`}
        >
          <div
            className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
          >
            <h4>Latest Reviews</h4>
            <HiDotsVertical />
          </div>
          <div className="dashboard_reviews">
            <div className="dashboard_review_card">
              <p>
                “Excellent experience! The domain transfer was smooth and quick.
                The seller was professional and provided great communication
                throughout the process. Highly recommend!"
              </p>
              <div className="review_cust_detail ws_dashboard_flex">
                <img src={cust_img}></img>

                <div>
                  <span class="cust_review_point">
                    5.0
                    <Reviews />
                  </span>
                  <h5>Micheal Jackson</h5>
                </div>
                <a href="#" className="ml_auto">
                  <span className="ml_auto">Reply</span>
                </a>
              </div>
            </div>
            <div className="dashboard_review_card">
              <p>
                “Excellent experience! The domain transfer was smooth and quick.
                The seller was professional and provided great communication
                throughout the process. Highly recommend!"
              </p>
              <div className="review_cust_detail ws_dashboard_flex">
                <img src={cust_img}></img>

                <div>
                  <span class="cust_review_point">
                    5.0
                    <Reviews />
                  </span>
                  <h5>Micheal Jackson</h5>
                </div>
                <a href="#" className="ml_auto">
                  <span className="ml_auto">Reply</span>
                </a>
              </div>
            </div>
            <div className="dashboard_review_card">
              <p>
                “Excellent experience! The domain transfer was smooth and quick.
                The seller was professional and provided great communication
                throughout the process. Highly recommend!"
              </p>
              <div className="review_cust_detail ws_dashboard_flex">
                <img src={cust_img}></img>

                <div>
                  <span class="cust_review_point">
                    5.0
                    <Reviews />
                  </span>
                  <h5>Micheal Jackson</h5>
                </div>
                <a href="#" className="ml_auto">
                  <span className="ml_auto">Reply</span>
                </a>
              </div>
            </div>
            <div className="dashboard_review_card">
              <p>
                “Excellent experience! The domain transfer was smooth and quick.
                The seller was professional and provided great communication
                throughout the process. Highly recommend!"
              </p>
              <div className="review_cust_detail ws_dashboard_flex">
                <img src={cust_img}></img>

                <div>
                  <span class="cust_review_point">
                    5.0
                    <Reviews />
                  </span>
                  <h5>Micheal Jackson</h5>
                </div>
                <a href="#" className="ml_auto">
                  <span className="ml_auto">Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; // Export the component
