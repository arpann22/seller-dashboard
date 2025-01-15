import React, { useEffect } from "react";
import { useState } from "react";
import "./MyOffers.css"; // Import styles specific to this component
import styles from "./Tabs.module.css";
import { ReactComponent as MyOfferIcon } from "./image/offer.svg";
import { ReactComponent as SortIcon } from "./image/sort.svg";
import { ReactComponent as OfferActive } from "./image/offers_active.svg";
import { ReactComponent as OfferDecline } from "./image/offers_declined.svg";
import { ReactComponent as CartIcon } from "./image/sales_overview.svg";
import { ReactComponent as RemakeOfferIcon } from "./image/pricing_setup.svg";
import { ReactComponent as DeleteIcon } from "./image/delete.svg";
import { FaCircle, FaSpinner, FaTimes } from "react-icons/fa"; // Import necessary icons
import { FaPlus } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import domain_img from "./images/chatseek.com.png";
const handleSubmit = (event) => {
  event.preventDefault();
  // Handle the input value submission here
};

const MyOffers = ({ userData }) => {
  // const currentUrl = "https://new-webstarter.codepixelz.tech";
  const currentUrl = window.location.origin;
  const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded

  // Offers section starts ----------------------------------------------
  const [offers, setOffers] = useState([]);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  const [sortValue, setSortValue] = useState("");
  const [isReversed, setIsReversed] = useState(true); // Track the reversal state

  async function fetchOffers() {
    // Fetch offers from the API
    try {
      setOfferLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/offers/${userData.id}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        if (sortValue) {
          data.reverse();
        }
        setOffers(data);
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

  // function for handeling sort
  // function handleSort() {
  //   setIsReversed(!isReversed);
  //   if (activeTab === "active") {
  //     setSortValue(isReversed ? "sort" : "");
  //   } else if (activeTab === "declined") {
  //     setSortValue(isReversed ? "sort" : "");
  //   } else if (activeTab === "accepted") {
  //     setSortValue(isReversed ? "sort" : "");
  //   }
  // }
  // Function for handling sort
  function handleSort() {
    setIsReversed(!isReversed);
    const sortedOffers = [...offers].sort((a, b) => {
      if (a.created_at < b.created_at) return isReversed ? 1 : -1;
      if (a.created_at > b.created_at) return isReversed ? -1 : 1;
      return 0;
    });
    setOffers(sortedOffers);
  }

  const pendingOffers = offers.filter((offer) => offer.status == "pending");
  // Map pending offers to include formatted expiry dates
  const pendingOffersWithFormattedDates = pendingOffers.map((offer) => {
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

  const acceptedOffers = offers.filter((offer) => offer.status == "accepted");
  const acceptedOffersWithFormattedDates = acceptedOffers.map((offer) => {
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

  const declinedOffers = offers.filter((offer) => offer.status == "declined");
  const declinedOffersWithFormattedDates = declinedOffers.map((offer) => {
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

  // remake an offer starts
  const [counterOffer, setCounterOffer] = useState(0);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterError, setCounterError] = useState("");
  const [counterSuccess, setCounterSuccess] = useState("");

  const handleCounterOfferSubmit = async (offer_id) => {
    try {
      setCounterError("");
      setCounterSuccess("");
      setCounterLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/update-counter-offer/${offer_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            counter_offer: counterOffer,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        // setCounterSuccess(data);
        setCounterSuccess(data || "Offer Sent Successfully.");
        refreshOrderData();
      }
    } catch (error) {
      setCounterError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCounterLoading(false);
    }
  };

  // remake an offer ends

  const handelOfferDecline = async (offer_id, type, counter_offer_id) => {
    try {
      setCounterError("");
      setCounterSuccess("");
      setCounterLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/accept-delete-offers/${offer_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: type,
            counter_offer_id: counter_offer_id,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setCounterSuccess(data || "Offer Declined Successfully.");
        refreshOrderData();
      }
    } catch (error) {
      setCounterError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCounterLoading(false);
    }
  };
  const refreshOrderData = async () => {
    try {
      // setIsLoading(true);
      setOfferLoading(true);
      await fetchOffers();
    } catch (err) {
      // setError(err.message);
    }
  };

  const [cartError, setCartError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  // Add to the cart for offer section
  const handleOfferCart = async (offer_id, domain_id, amount, type) => {
    try {
      setCartError("");
      setCartSuccess("");
      setCartLoading(true);
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/offers-cart/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offer_id: offer_id,
            domain_id: domain_id,
            amount: amount,
            type: type,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData?.message || "Something went wrong. Please try again later.";
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data) {
        setCartSuccess(data || "Added to the cart successfully");
        // refreshOrderData();
      }
    } catch (error) {
      setCartError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Offers section ends ----------------------------------------------

  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };

  return (
    <div className="myOffersContainer">
      <div
        className={`${styles.salesOverViewTitle} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}
                    } myOffersTitle`}
      >
        <div>
          <MyOfferIcon />
        </div>
        <h4>My Offers</h4>
      </div>
      {/* my offers main content */}
      <div className={styles.offer_tabs_wrapper}>
        {/* Nav tabs */}
        <div
          className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.dashboard_small_margin}`}
        >
          <ul className={`${styles.nav_tabs} ${styles.offer_tabs_navs}`}>
            <li
              className={`${activeTab === "active" ? styles.active : ""}`}
              onClick={() => setActiveTab("active")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <OfferActive />
              </div>
              <label> Active</label>
            </li>
            <li
              className={`${activeTab === "declined" ? styles.active : ""}`}
              onClick={() => setActiveTab("declined")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <OfferDecline />
              </div>
              <label>Declined</label>
            </li>
            <li
              className={`${
                activeTab === "accepted" ? styles.active : ""
              } my_offer_accepted_tab`}
              onClick={() => setActiveTab("accepted")}
            >
              {/* <img src={save_draft_icon} alt="Save Draft Icon" className={styles.tab_icon} /> */}
              <div className={styles.svg_wrapper_bg_white}>
                <MyOfferIcon />
              </div>
              <label>Accepted</label>
            </li>
          </ul>
          <div className={styles.offerSorts} onClick={handleSort}>
            {/* <img src={sort_icon}></img> */}
            <SortIcon />
            <label>Sort </label>
          </div>
        </div>
        {offerLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {offerError && <div className="cancelled">{offerError}</div>}
        {/* Tab content */}
        {counterLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {counterError && <div className="refunded">{counterError}</div>}
        {counterSuccess && <div className="completed">{counterSuccess}</div>}

        {cartLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {cartError && <div className="refunded">{cartError}</div>}
        {cartSuccess && <div className="completed">{cartSuccess}</div>}

        <div>
          {activeTab === "active" && (
            <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
              {pendingOffers.length > 0 ? (
                pendingOffersWithFormattedDates &&
                pendingOffersWithFormattedDates.map((offer, index) => (
                  <div
                    key={index}
                    className={`${styles.recentOffers_wrapper} myOffers_wrapper `}
                  >
                    {/* Offer card */}
                    <div
                      className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                    >
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div className={styles.recentOffers_card_image}>
                          <img src={offer.domain_image} alt="Domain" />
                        </div>
                        <div className={styles.recentOffers_card_titles}>
                          <p>Product</p>

                          <a
                            href={offer?.permalink ? offer.permalink : ""}
                            target="_blank"
                          >
                            <h5>{offer.domain_title}</h5>
                          </a>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>My Offer</p>
                          <h6>
                            {offer?.currency ? offer.currency : ""}
                            {offer?.offer_amount ? offer.offer_amount : "000"}
                          </h6>
                        </div>
                        {offer?.counter_offers &&
                          offer?.counter_offers.map(
                            (counter_offer, counter_offer_index) => {
                              if (counter_offer_index == 0) {
                                return (
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Counter price</p>
                                    <h6>
                                      {offer?.currency ? offer.currency : ""}
                                      {counter_offer?.counter_price
                                        ? counter_offer.counter_price
                                        : "000"}
                                    </h6>
                                  </div>
                                );
                              }
                            }
                          )}
                      </div>
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div class="width_100">
                          <div
                            className={`${styles.recentOffers_card_image} myOffers_offer_image`}
                          >
                            <MyOfferIcon />
                          </div>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                        >
                          <p className="expiry_soon">
                            Offer Expiry
                            {offer.isExpiringSoon && <span> Soon </span>}
                          </p>
                          <h5>{offer.formattedDate}</h5>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_details} ${styles.offer_status_cards} ${styles.recentOffers_card_titles}`}
                        >
                          <p>Pending</p>
                          <h5
                            className={`${styles.offer_status} ${styles.pending}`}
                          >
                            <FaCircle />
                            {offer.status}
                          </h5>
                        </div>
                      </div>
                      <div
                        className={`${styles.recentOffers_card} ${styles.offer_status_cards} myOffers_flex1`}
                      >
                        <div
                          className={`${styles.recentOffers_card_details} myOffers_icons`}
                        >
                          {/* <div className={styles.svg_wrapper_bg_grey}>
                          <FiMail />
                        </div> */}
                          <div
                            className={`${styles.svg_wrapper_bg_grey} ${
                              expanded[index]
                                ? styles.icon_close_wrapper
                                : styles.icon_add_wrapper
                            }`}
                            onClick={() => toggleExpanded(index)}
                          >
                            {expanded[index] ? <FaTimes /> : <FaPlus />}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Expanded content as a new column below */}

                    <div
                      className={`${styles.extra_column_wrapper} ${
                        expanded[index] ? styles.expanded : ""
                      }`}
                    >
                      {/*
                   mapping through the counter offers
                   checking the first index of the counter offer sent by the seller
                  */}
                      {offer?.counter_offers &&
                        offer?.counter_offers.map(
                          (counter_offer, counter_offer_index) => {
                            const firstMatchIndex =
                              offer?.counter_offers.findIndex(
                                (offer) => offer.by_user_id !== userData.id
                              );

                            return (
                              <div className={styles.extra_column}>
                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_image}
                                  >
                                    <img src={offer.domain_image}></img>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Select Counter Offer</p>
                                    <a
                                      href={
                                        offer?.permalink ? offer.permalink : ""
                                      }
                                      target="_blank"
                                    >
                                      <h5>{offer.domain_title}</h5>
                                    </a>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Save</p>
                                    <h6>
                                      {offer.currency}
                                      {counter_offer.counter_price}
                                    </h6>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Status</p>
                                    <h6 class="counter">Countered</h6>
                                  </div>
                                </div>

                                {/* {counter_offer.by_userid != userData.id} */}

                                <form
                                  className={`${styles.offerForm} myOffers_extra_offer_form`}
                                  onSubmit={handleSubmit}
                                >
                                  {counter_offer_index == 0 && (
                                    <div className={styles.p_relative}>
                                      <input
                                        type="text"
                                        className={styles.offerInput}
                                        placeholder="Remake an Offer"
                                        onChange={(e) =>
                                          setCounterOffer(e.target.value)
                                        }
                                      />
                                      <span className="remake_offer_icon">
                                        <RemakeOfferIcon />
                                      </span>
                                      <button
                                        type="submit"
                                        className={styles.submitButton}
                                        onClick={() =>
                                          handleCounterOfferSubmit(
                                            offer.offer_id
                                          )
                                        }
                                      >
                                        <span className={styles.arrow}>
                                          &#8594;
                                        </span>{" "}
                                        {/* Arrow symbol */}
                                      </button>
                                    </div>
                                  )}
                                  {counter_offer_index == firstMatchIndex && (
                                    <div
                                      className={`${styles.ws_flex} ${styles.gap_10} myOffers_extra_column_buttons `}
                                    >
                                      <button
                                        type="button"
                                        className={styles.declineButton}
                                        onClick={() =>
                                          handelOfferDecline(
                                            offer.offer_id,
                                            "decline",
                                            counter_offer.counter_offer_id
                                          )
                                        }
                                      >
                                        <div className={`svg_white`}>
                                          <OfferDecline />
                                        </div>
                                      </button>
                                      <button
                                        type="button"
                                        className={styles.acceptButton}
                                        onClick={() =>
                                          handleOfferCart(
                                            offer.offer_id,
                                            offer.domain_id,
                                            counter_offer.counter_price,
                                            "offer"
                                          )
                                        }
                                      >
                                        <div
                                          className={`${styles.small_svg} svg_white `}
                                        >
                                          <CartIcon />
                                        </div>
                                      </button>
                                    </div>
                                  )}
                                </form>
                              </div>
                            );
                          }
                        )}

                      {/* No counter offers starts ------------------------------------------- */}
                      {offer?.counter_offers.length == 0 && (
                        <div className={styles.extra_column}>
                          <div className={styles.recentOffers_card}>
                            <div className={styles.recentOffers_card_image}>
                              <img src={offer.domain_image}></img>
                            </div>
                            <div className={styles.recentOffers_card_titles}>
                              <p>Select Counter Offer</p>
                              <a
                                href={offer?.permalink ? offer.permalink : ""}
                                target="_blank"
                              >
                                <h5>{offer.domain_title}</h5>
                              </a>
                            </div>
                            <div className={styles.recentOffers_card_details}>
                              <p>Save</p>
                              <h6>
                                {offer.currency}
                                {offer.offer_amount}
                              </h6>
                            </div>
                            <div className={styles.recentOffers_card_details}>
                              <p>Status</p>
                              <h6>Pending</h6>
                            </div>
                          </div>

                          {/* {counter_offer.by_userid != userData.id} */}
                          <form
                            className={`${styles.offerForm} myOffers_extra_offer_form`}
                            onSubmit={handleSubmit}
                          >
                            <div className={styles.p_relative}>
                              <input
                                type="text"
                                className={styles.offerInput}
                                placeholder="Remake an Offer"
                                onChange={(e) =>
                                  setCounterOffer(e.target.value)
                                }
                              />
                              <span className="remake_offer_icon">
                                <RemakeOfferIcon />
                              </span>
                              <button
                                type="submit"
                                className={styles.submitButton}
                                onClick={() =>
                                  handleCounterOfferSubmit(offer.offer_id)
                                }
                              >
                                <span className={styles.arrow}>&#8594;</span>{" "}
                                {/* Arrow symbol */}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : offerLoading == false ? (
                // <div className={styles.order_error_msg_wrapper}>
                <div className={styles.order_error_msg}>
                  No Active Offers at the Moment.{" "}
                </div>
              ) : (
                // </div>
                ""
              )}
            </div>
          )}

          {activeTab === "declined" && (
            <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
              {declinedOffers.length > 0 ? (
                declinedOffersWithFormattedDates &&
                declinedOffersWithFormattedDates.map((offer, index) => (
                  <div
                    key={index}
                    className={`${styles.recentOffers_wrapper} myOffers_wrapper `}
                  >
                    {/* Offer card */}
                    <div
                      className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                    >
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div className={styles.recentOffers_card_image}>
                          <img src={offer.domain_image} alt="Domain" />
                        </div>
                        <div className={styles.recentOffers_card_titles}>
                          <p>Product</p>
                          <a
                            href={offer?.permalink ? offer.permalink : ""}
                            target="_blank"
                          >
                            <h5>{offer.domain_title}</h5>
                          </a>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>My Offer</p>
                          <h6>
                            {offer?.currency ? offer.currency : ""}
                            {offer?.offer_amount ? offer.offer_amount : "000"}
                          </h6>
                        </div>
                        {offer?.counter_offers &&
                          offer?.counter_offers.map(
                            (counter_offer, counter_offer_index) => {
                              if (counter_offer_index == 0) {
                                return (
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Counter price</p>
                                    <h6>
                                      {offer?.currency ? offer.currency : ""}
                                      {counter_offer?.counter_price
                                        ? counter_offer.counter_price
                                        : "000"}
                                    </h6>
                                  </div>
                                );
                              }
                            }
                          )}
                      </div>
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div class="width_100">
                          <div
                            className={`${styles.recentOffers_card_image} myOffers_offer_image`}
                          >
                            <MyOfferIcon />
                          </div>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                        >
                          <p className="expiry_soon">
                            Offer Expiry
                            {offer.isExpiringSoon && <span> Soon </span>}
                          </p>
                          <h5>{offer.formattedDate}</h5>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_details} ${styles.offer_status_cards} ${styles.recentOffers_card_titles}`}
                        >
                          <p>Declined</p>
                          <h5
                            className={`${styles.offer_status} ${styles.pending}`}
                          >
                            <FaCircle />
                            {offer.status}
                          </h5>
                        </div>
                      </div>
                      <div
                        className={`${styles.recentOffers_card} ${styles.offer_status_cards} myOffers_flex1`}
                      >
                        {/* <div className={styles.recentOffers_card_titles}>
             <p>Status</p>
             <h5
               className={`${styles.offer_status} ${styles.pending}`}
             >
               <FaCircle />
               Pending
             </h5>
           </div> */}
                        <div
                          className={`${styles.recentOffers_card_details} myOffers_icons`}
                        >
                          {/* <div className={styles.svg_wrapper_bg_grey}>
               <FiMail />
             </div> */}
                          <div
                            className={`${styles.svg_wrapper_bg_grey} ${
                              expanded[index]
                                ? styles.icon_close_wrapper
                                : styles.icon_add_wrapper
                            }`}
                            onClick={() => toggleExpanded(index)}
                          >
                            {expanded[index] ? <FaTimes /> : <FaPlus />}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Expanded content as a new column below */}

                    {/* {
         offer?.counter_offers.forEach((counter_offer, index) => {
         })
         // offer?.counter_offers.foreach()
       } */}
                    {/* changes by sunder */}

                    <div
                      className={`${styles.extra_column_wrapper} ${
                        expanded[index] ? styles.expanded : ""
                      }`}
                    >
                      {/*
        mapping through the counter offers
        checking the first index of the counter offer sent by the seller
       */}
                      {offer?.counter_offers &&
                        offer?.counter_offers.map(
                          (counter_offer, counter_offer_index) => {
                            const firstMatchIndex =
                              offer?.counter_offers.findIndex(
                                (offer) => offer.by_user_id !== userData.id
                              );

                            return (
                              <div className={styles.extra_column}>
                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_image}
                                  >
                                    <img src={offer.domain_image}></img>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Select Counter Offer</p>
                                    <a
                                      href={
                                        offer?.permalink ? offer.permalink : ""
                                      }
                                      target="_blank"
                                    >
                                      <h5>{offer.domain_title}</h5>
                                    </a>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Save</p>
                                    <h6>
                                      {offer.currency}
                                      {counter_offer.counter_price}
                                    </h6>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Status</p>
                                    <h6 class="counter">
                                      {/* {offer.currency}
                         {counter_offer.counter_price} */}
                                      Declined
                                    </h6>
                                  </div>
                                </div>

                                {/* {counter_offer.by_userid != userData.id} */}
                              </div>
                            );
                          }
                        )}

                      {/* No counter offers starts ------------------------------------------- */}
                      {offer?.counter_offers.length == 0 && (
                        <div className={styles.extra_column}>
                          <div className={styles.recentOffers_card}>
                            <div className={styles.recentOffers_card_image}>
                              <img src={offer.domain_image}></img>
                            </div>
                            <div className={styles.recentOffers_card_titles}>
                              <p>Select Counter Offer</p>
                              <a
                                href={offer?.permalink ? offer.permalink : ""}
                                target="_blank"
                              >
                                <h5>{offer.domain_title}</h5>
                              </a>
                            </div>
                            <div className={styles.recentOffers_card_details}>
                              <p>Save</p>
                              <h6>
                                {offer.currency}
                                {offer.offer_amount}
                              </h6>
                            </div>
                            <div className={styles.recentOffers_card_details}>
                              <p>Status</p>
                              <h6>Declined</h6>
                            </div>
                          </div>

                          {/* {counter_offer.by_userid != userData.id} */}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.order_error_msg}>
                  <div>No Offers Have Been Declined.</div>
                </div>
              )}
            </div>
          )}
          {activeTab === "accepted" && (
            <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
              {acceptedOffers.length > 0 ? (
                acceptedOffersWithFormattedDates &&
                acceptedOffersWithFormattedDates.map((offer, index) => (
                  <div
                    key={index}
                    className={`${styles.recentOffers_wrapper} myOffers_wrapper `}
                  >
                    {/* Offer card */}
                    <div
                      className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                    >
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div className={styles.recentOffers_card_image}>
                          <img src={offer.domain_image} alt="Domain" />
                        </div>
                        <div className={styles.recentOffers_card_titles}>
                          <p>Product</p>
                          <a
                            href={offer?.permalink ? offer.permalink : ""}
                            target="_blank"
                          >
                            <h5>{offer.domain_title}</h5>
                          </a>
                        </div>
                        <div className={styles.recentOffers_card_details}>
                          <p>My Offer</p>
                          <h6>
                            {offer?.currency ? offer.currency : ""}
                            {offer?.offer_amount ? offer.offer_amount : "000"}
                          </h6>
                        </div>
                        {offer?.counter_offers &&
                          offer?.counter_offers.map(
                            (counter_offer, counter_offer_index) => {
                              if (counter_offer_index == 0) {
                                return (
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Counter price</p>
                                    <h6>
                                      {offer?.currency ? offer.currency : ""}
                                      {counter_offer?.counter_price
                                        ? counter_offer.counter_price
                                        : "000"}
                                    </h6>
                                  </div>
                                );
                              }
                            }
                          )}
                      </div>
                      <div
                        className={`${styles.recentOffers_card} myOffers_flex3`}
                      >
                        <div class="width_100">
                          <div
                            className={`${styles.recentOffers_card_image} myOffers_offer_image`}
                          >
                            <MyOfferIcon />
                          </div>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                        >
                          <p className="expiry_soon">
                            Offer Expiry
                            {offer.isExpiringSoon && <span> Soon </span>}
                          </p>
                          <h5>{offer.formattedDate}</h5>
                        </div>
                        <div
                          className={`${styles.recentOffers_card_details} ${styles.offer_status_cards} ${styles.recentOffers_card_titles}`}
                        >
                          <p>Accepted</p>
                          <h5
                            className={`${styles.offer_status} ${styles.pending}`}
                          >
                            <FaCircle />
                            {offer.status}
                          </h5>
                        </div>
                      </div>
                      <div
                        className={`${styles.recentOffers_card} ${styles.offer_status_cards} myOffers_flex1`}
                      >
                        <div
                          className={`${styles.recentOffers_card_details} myOffers_icons`}
                        >
                          <div
                            className={`${styles.svg_wrapper_bg_grey} ${
                              expanded[index]
                                ? styles.icon_close_wrapper
                                : styles.icon_add_wrapper
                            }`}
                            onClick={() => toggleExpanded(index)}
                          >
                            {expanded[index] ? <FaTimes /> : <FaPlus />}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Expanded content as a new column below */}

                    <div
                      className={`${styles.extra_column_wrapper} ${
                        expanded[index] ? styles.expanded : ""
                      }`}
                    >
                      {/*
                        mapping through the counter offers
                        checking the first index of the counter offer sent by the seller
                        */}
                      {offer?.counter_offers &&
                        offer?.counter_offers.map(
                          (counter_offer, counter_offer_index) => {
                            const firstMatchIndex =
                              offer?.counter_offers.findIndex(
                                (offer) => offer.by_user_id !== userData.id
                              );

                            return (
                              <div className={styles.extra_column}>
                                <div className={styles.recentOffers_card}>
                                  <div
                                    className={styles.recentOffers_card_image}
                                  >
                                    <img src={offer.domain_image}></img>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_titles}
                                  >
                                    <p>Select Counter Offer</p>
                                    <a
                                      href={
                                        offer?.permalink ? offer.permalink : ""
                                      }
                                      target="_blank"
                                    >
                                      <h5>{offer.domain_title}</h5>
                                    </a>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Save</p>
                                    <h6>
                                      {offer.currency}
                                      {counter_offer.counter_price}
                                    </h6>
                                  </div>
                                  <div
                                    className={styles.recentOffers_card_details}
                                  >
                                    <p>Status</p>
                                    <h6 class="counter">
                                      {counter_offer.status == "accepted"
                                        ? "Accepted"
                                        : "Countered"}
                                    </h6>
                                  </div>
                                </div>

                                <form
                                  className={`${styles.offerForm} myOffers_extra_offer_form`}
                                  onSubmit={handleSubmit}
                                >
                                  {counter_offer.by_user_id == userData.id &&
                                    counter_offer.status == "accepted" && (
                                      // {counter_offer_index == 0 && (
                                      <div
                                        className={`${styles.ws_flex} ${styles.gap_10} myOffers_extra_column_buttons `}
                                      >
                                        <button
                                          type="button"
                                          className={styles.acceptButton}
                                          onClick={() =>
                                            handleOfferCart(
                                              offer.offer_id,
                                              offer.domain_id,
                                              counter_offer.counter_price,
                                              "offer"
                                            )
                                          }
                                        >
                                          <div
                                            className={`${styles.small_svg} svg_white `}
                                          >
                                            <CartIcon />
                                          </div>
                                        </button>
                                      </div>
                                    )}
                                </form>
                              </div>
                            );
                          }
                        )}

                      {/* No counter offers starts ------------------------------------------- */}
                      {offer?.counter_offers.length == 0 && (
                        <div className={styles.extra_column}>
                          <div className={styles.recentOffers_card}>
                            <div className={styles.recentOffers_card_image}>
                              <img src={offer.domain_image}></img>
                            </div>
                            <div className={styles.recentOffers_card_titles}>
                              <p>Select Counter Offer</p>
                              <a
                                href={offer?.permalink ? offer.permalink : ""}
                                target="_blank"
                              >
                                <h5>{offer.domain_title}</h5>
                              </a>
                            </div>
                            <div className={styles.recentOffers_card_details}>
                              <p>Save</p>
                              <h6>
                                {offer.currency}
                                {offer.offer_amount}
                              </h6>
                            </div>
                          </div>

                          {/* {counter_offer.by_userid != userData.id} */}
                          <form
                            className={`${styles.offerForm} myOffers_extra_offer_form`}
                            onSubmit={handleSubmit}
                          >
                            <div
                              className={`${styles.ws_flex} ${styles.gap_10} myOffers_extra_column_buttons `}
                            >
                              <button
                                type="button"
                                className={styles.acceptButton}
                                onClick={() =>
                                  handleOfferCart(
                                    offer.offer_id,
                                    offer.domain_id,
                                    offer.offer_amount,
                                    "offer"
                                  )
                                }
                              >
                                <div
                                  className={`${styles.small_svg} svg_white `}
                                >
                                  <CartIcon />
                                </div>
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.order_error_msg}>
                  <div>No Offers Have Been Accepted.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyOffers;
