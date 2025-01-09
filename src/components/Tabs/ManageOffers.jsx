import { ReactComponent as DeleteIcon } from "./image/delete.svg";
import { ReactComponent as RecentOffersIcon } from "./image/recents_offers.svg";
import { FaTimes } from "react-icons/fa"; // Import necessary icons
// import categories_icon from './images.categories-icon.png';

import { FaCircle } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
// import { FiMail } from "react-icons/fi";
import OfferTabs from "./OfferTabs";
import { useEffect, useState } from "react";
export default function ManageOffers({
  styles,
  userData,
  domain_img,
  mediaSetupIcon,
}) {
  // const currentUrl = "https://new-webstarter.codepixelz.tech";
  const currentUrl = window.location.origin;
  const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded

  // manage offers section starts ----------------------------------------------
  const [offers, setOffers] = useState([]);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

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

  // offers with both accepted and pending status

  // Filter offers with status "pending" or "accepted"
  const pendingAcceptedOffers = offers.filter(
    (offer) => offer.status === "pending" || offer.status === "accepted"
  );

  // Map relevant offers to include formatted expiry dates and expiry status
  const pendingAcceptedOffersWithFomattedDates = pendingAcceptedOffers.map(
    (offer) => {
      const dateString = offer?.offer_expiry_date
        ? offer.offer_expiry_date
        : "";
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
    }
  );

  // remake an offer starts
  const [counterOffer, setCounterOffer] = useState(0);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterError, setCounterError] = useState("");
  const [counterSuccess, setCounterSuccess] = useState("");

  const handleCounterOfferSubmit = async (offer_id) => {
    // const counter_offer_data = {
    //   counter_offer: counterOffer,
    // };
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
        setCounterError(errorMessage);
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

  const handelOfferDecline = () => {
    console.log("clicked");
    refreshOrderData();
  };
  const refreshOrderData = async () => {
    try {
      // setIsLoading(true);
      setOfferLoading(true);
      await fetchOffers();
      console.log("clickeddd");
    } catch (err) {
      // setError(err.message);
    }
  };
  // manage offers section ends ============================================

  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the input value submission here
  };
  const handleReset = () => {
    // Reset the input field
    const inputField = document.querySelector(`.${styles.offerInput}`);
    if (inputField) {
      inputField.value = "";
    }
  };

  return (
    <>
      <div className={styles.offers_tab_recent_offer_wrap}>
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
          <RecentOffersIcon />
          <h4>Recent Offers</h4>
        </div>
        <div>
          <div
            className={`${styles.ws_flex} ${styles.recent_offers_cols} ${styles.dashboard_small_margin}`}
          >
            {offers.length > 0 ? (
              offersWithFormattedDates &&
              offersWithFormattedDates.map((offer, index) => (
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
                        <h5>{offer.domain_title}</h5>
                      </div>
                      <div className={styles.recentOffers_card_details}>
                        <p>Offer Amount</p>
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
                    <div className={styles.recentOffers_card}>
                      <div className={styles.recentOffers_card_image}>
                        <img src={domain_img} alt="Domain" />
                      </div>
                      <div
                        className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                      >
                        <p className="online">
                          Customer Online
                          <FaCircle />
                        </p>
                        <h5>{offer.buyer_name}</h5>
                      </div>
                      <div className={styles.recentOffers_card_details}>
                        <p className="expiry_soon">
                          Offer Expiry
                          {offer.isExpiringSoon && <span> Soon </span>}
                        </p>
                        <h5>{offer.formattedDate}</h5>
                      </div>
                    </div>
                    <div
                      className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}
                    >
                      <div className={styles.recentOffers_card_titles}>
                        <p>Status</p>
                        <h5
                          className={`${styles.offer_status} ${styles.pending}`}
                        >
                          <FaCircle />
                          {offer.status}
                        </h5>
                      </div>
                      <div className={styles.recentOffers_card_details}>
                        {/* <div
                            className={`${styles.svg_wrapper_bg_grey} ${expanded[index]
                              ? styles.icon_close_wrapper
                              : styles.icon_add_wrapper
                              }`}
                          >
                            {expanded[index] ? (
                              <FaTimes onClick={() => toggleExpanded(index)} />
                            ) : (
                              <FaPlus onClick={() => toggleExpanded(index)} />
                            )}
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
                        {/* <div className={styles.svg_wrapper_bg_grey}>
                            <FiMail />
                          </div> */}
                      </div>
                    </div>
                  </div>
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
                                <div className={styles.recentOffers_card_image}>
                                  <img src={offer.domain_image}></img>
                                </div>
                                <div
                                  className={styles.recentOffers_card_titles}
                                >
                                  <p>Product</p>
                                  <h5>{offer.domain_title}</h5>
                                </div>
                                <div
                                  className={styles.recentOffers_card_details}
                                >
                                  <p>Offer Amount</p>
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
                                    Countered
                                  </h6>
                                </div>
                              </div>

                              {/* {counter_offer.by_userid != userData.id} */}
                              {offer.status == "pending" && (
                                <form
                                  className={styles.offerForm}
                                  onSubmit={handleSubmit}
                                >
                                  {counter_offer_index == firstMatchIndex && (
                                    <>
                                      <div
                                        className={`${styles.p_relative} ${styles.dashboard_mob_w_100}`}
                                      >
                                        <input
                                          type="text"
                                          className={styles.offerInput}
                                          placeholder="Enter your counter offer"
                                          onChange={(e) =>
                                            setCounterOffer(e.target.value)
                                          }
                                        />
                                        <button
                                          type="submit"
                                          className={styles.submitButton}
                                        >
                                          <span className={styles.arrow}>
                                            &#8594;
                                          </span>{" "}
                                          {/* Arrow symbol */}
                                        </button>
                                      </div>
                                      <div
                                        className={`${styles.ws_flex} ${styles.gap_10}`}
                                      >
                                        <button
                                          type="button"
                                          className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          className={`${styles.declineButton} ${styles.hover_white}`}
                                        >
                                          Decline
                                        </button>

                                        {/* Reset button with delete icon */}
                                        <button
                                          type="button"
                                          className={styles.resetButton}
                                          onClick={handleReset}
                                        >
                                          {/* <img src={delete_reset_icon} /> */}
                                          <DeleteIcon />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </form>
                              )}
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
                            <p>Product</p>
                            <h5>{offer.domain_title}</h5>
                          </div>
                          <div className={styles.recentOffers_card_details}>
                            <p>Offer Amount</p>
                            <h6>
                              {offer.currency}
                              {offer.offer_amount}
                            </h6>
                          </div>
                        </div>

                        {/* {counter_offer.by_userid != userData.id} */}
                        {offer.status == "pending" && (
                          <form
                            className={styles.offerForm}
                            onSubmit={handleSubmit}
                          >
                            <div
                              className={`${styles.p_relative} ${styles.dashboard_mob_w_100}`}
                            >
                              <input
                                type="text"
                                className={styles.offerInput}
                                placeholder="Enter your counter offer"
                                onChange={(e) =>
                                  setCounterOffer(e.target.value)
                                }
                              />
                              <button
                                type="submit"
                                className={styles.submitButton}
                              >
                                <span className={styles.arrow}>&#8594;</span>{" "}
                                {/* Arrow symbol */}
                              </button>
                            </div>
                            <div
                              className={`${styles.ws_flex} ${styles.gap_10}`}
                            >
                              <button
                                type="button"
                                className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className={`${styles.declineButton} ${styles.hover_white}`}
                              >
                                Decline
                              </button>

                              {/* Reset button with delete icon */}
                              <button
                                type="button"
                                className={styles.resetButton}
                                onClick={handleReset}
                              >
                                {/* <img src={delete_reset_icon} /> */}
                                <DeleteIcon />
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : offerLoading == false ? (
              <div>No Offers at the Moment. </div>
            ) : (
              ""
            )}
            {[1, 2, 3].map((item, index) => (
              <div key={index} className={styles.recentOffers_wrapper}>
                {/* Offer card */}
                <div
                  className={`${styles.ws_flex} ${styles.gap_10} ${styles.fd_column}`}
                >
                  <div className={styles.recentOffers_card}>
                    <div className={styles.recentOffers_card_image}>
                      <img src={domain_img} alt="Domain" />
                    </div>
                    <div className={styles.recentOffers_card_titles}>
                      <p>Product</p>
                      <h5>debugbot.com</h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      <p>Offer Amount</p>
                      <h6>$5000</h6>
                    </div>
                  </div>
                  <div className={styles.recentOffers_card}>
                    <div className={styles.recentOffers_card_image}>
                      <img src={domain_img} alt="Domain" />
                    </div>
                    <div
                      className={`${styles.recentOffers_card_titles} ${styles.offers_card_customers}`}
                    >
                      <p className="online">
                        Customer Online
                        <FaCircle />
                      </p>
                      <h5>Charles Bedford</h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      <p>Offer Expiry</p>
                      <h6>Oct 20, 2024</h6>
                    </div>
                  </div>
                  <div
                    className={`${styles.recentOffers_card} ${styles.offer_status_cards}`}
                  >
                    <div className={styles.recentOffers_card_titles}>
                      <p>Status</p>
                      <h5
                        className={`${styles.offer_status} ${styles.pending}`}
                      >
                        <FaCircle />
                        Pending
                      </h5>
                    </div>
                    <div className={styles.recentOffers_card_details}>
                      {/* <div
                            className={`${styles.svg_wrapper_bg_grey} ${expanded[index]
                              ? styles.icon_close_wrapper
                              : styles.icon_add_wrapper
                              }`}
                          >
                            {expanded[index] ? (
                              <FaTimes onClick={() => toggleExpanded(index)} />
                            ) : (
                              <FaPlus onClick={() => toggleExpanded(index)} />
                            )}
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
                      {/* <div className={styles.svg_wrapper_bg_grey}>
                            <FiMail />
                          </div> */}
                    </div>
                  </div>
                </div>

                {/* Expanded content as a new column below */}
                <div
                  className={`${styles.extra_column_wrapper} ${
                    expanded[index] ? styles.expanded : ""
                  }`}
                >
                  <div className={styles.extra_column}>
                    <div className={styles.recentOffers_card}>
                      <div className={styles.recentOffers_card_image}>
                        <img src={domain_img}></img>
                      </div>
                      <div className={styles.recentOffers_card_titles}>
                        <p>Product</p>
                        <h5>debugbot.com</h5>
                      </div>
                      <div className={styles.recentOffers_card_details}>
                        <p>Offer Amount</p>
                        <h6>$5000</h6>
                      </div>
                    </div>
                    <form className={styles.offerForm} onSubmit={handleSubmit}>
                      <div
                        className={`${styles.p_relative} ${styles.dashboard_mob_w_100}`}
                      >
                        <input
                          type="number"
                          className={styles.offerInput}
                          placeholder="Enter your counter offer"
                          min="0"
                        />
                        <button type="submit" className={styles.submitButton}>
                          <span className={styles.arrow}>&#8594;</span>{" "}
                          {/* Arrow symbol */}
                        </button>
                      </div>
                      <div className={`${styles.ws_flex} ${styles.gap_10}`}>
                        <button
                          type="button"
                          className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className={`${styles.declineButton} ${styles.hover_white}`}
                        >
                          Decline
                        </button>

                        {/* Reset button with delete icon */}
                        <button
                          type="button"
                          className={styles.resetButton}
                          onClick={handleReset}
                        >
                          {/* <img src={delete_reset_icon} /> */}
                          <DeleteIcon />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.offers_tab_offer_wrap}>
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Past Offers</h4>
        </div>
        <OfferTabs
          pendingAcceptedOffers={pendingAcceptedOffers}
          pendingAcceptedOffersWithFomattedDates={
            pendingAcceptedOffersWithFomattedDates
          }
          declinedOffers={declinedOffers}
          declinedOffersWithFormattedDates={declinedOffersWithFormattedDates}
          userData={userData}
          setCounterOffer={setCounterOffer}
          offerLoading={offerLoading}
        />
      </div>
    </>
  );
}
