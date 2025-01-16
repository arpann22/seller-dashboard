import save_draft_icon from "./images/edit-profile.png";
import { useState } from "react";
import { FaCircle, FaSpinner, FaTimes } from "react-icons/fa"; // Import necessary icons
import { FaPlus } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import styles from "./Tabs.module.css"; // Import styles
import delete_reset_icon from "./images/delete-reset-icon.png";
import sort_icon from "./images/sort-icon.png";
import { ReactComponent as SortIcon } from "./image/sort.svg";
import { ReactComponent as OfferActive } from "./image/offers_active.svg";
import { ReactComponent as OfferDecline } from "./image/offers_declined.svg";
import { ReactComponent as DeleteIcon } from "./image/delete.svg";

import domain_img from "./images/chatseek.com.png";
const handleSubmit = (event) => {
  event.preventDefault();
  // Handle the input value submission here
};

const OfferTabs = ({
  pendingAcceptedOffers,
  pendingAcceptedOffersWithFomattedDates,
  declinedOffers,
  declinedOffersWithFormattedDates,
  userData,
  setCounterOffer,
  offerLoading,
  handleCounterOfferSubmit,
  offerError,
  currentUrl,
  setOfferLoading,
  fetchOffers,
  handleSort,
  activeTab,
  setActiveTab,
}) => {
  // const [activeTab, setActiveTab] = useState("active");
  const [expanded, setExpanded] = useState({}); // Track which card is expanded

  // handle accept, delete and decline of an offers
  const [pastError, setPastError] = useState("");
  const [pastSuccess, setPastSuccess] = useState("");
  const [pastLoading, setPastLoading] = useState(false);

  const handlePastOfferAcceptDelete = async (
    offer_id,
    type,
    counter_offer_id
  ) => {
    if (!type) {
      return;
    }
    try {
      setPastError("");
      setPastSuccess("");
      setPastLoading(true);
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
        // setCounterSuccess(data);
        setPastSuccess(data || "Offer Sent Successfully.");
        refreshOrderData();
      }
    } catch (error) {
      setPastError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setPastLoading(false);
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
  // Function to toggle the expanded state for each card
  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // Toggle visibility
    }));
  };

  return (
    <div className={styles.offer_tabs_wrapper}>
      {/* Nav tabs */}
      <div
        className={`${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between} ${styles.ph_30} ${styles.dashboard_small_margin}`}
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
        </ul>
        <div className={styles.offerSorts} onClick={handleSort}>
          {/* <img src={sort_icon}></img> */}
          <SortIcon />
          <label>Sort </label>
        </div>
      </div>

      {/* Tab content */}
      <div className={styles.tab_content}>
        {offerLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {pastLoading && (
          <div>
            <div className="loading_overlay">
              <FaSpinner className="loading" />
            </div>
          </div>
        )}
        {pastError && <div className="cancelled">{pastError}</div>}
        {pastSuccess && <div className="completed">{pastSuccess}</div>}
        {activeTab === "active" && (
          <div className={`${styles.ws_flex} ${styles.recent_offers_cols}`}>
            {pendingAcceptedOffers.length > 0 ? (
              pendingAcceptedOffersWithFomattedDates &&
              pendingAcceptedOffersWithFomattedDates.map((offer, index) => (
                <div
                  key={index}
                  className={`${styles.recentOffers_wrapper} myOffers_wrapper manageOffer_recents_wrap `}
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
                    <div
                      className={`${styles.recentOffers_card} myOffers_flex2`}
                    >
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
                          className={`${styles.offer_status} ${styles.offer.status}`}
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
                            <div
                              className={`${styles.extra_column} manageOffer_extra_col_wrap`}
                            >
                              <div
                                className={`${styles.recentOffers_card} manageOffer_extra_col_flex2`}
                              >
                                <div className={styles.recentOffers_card_image}>
                                  <img src={offer.domain_image}></img>
                                </div>
                                <div
                                  className={styles.recentOffers_card_titles}
                                >
                                  <p>Product</p>
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
                                  <h6 class="countered">
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
                                      <div
                                        className={`${styles.ws_flex} ${styles.gap_10}`}
                                      >
                                        <button
                                          type="button"
                                          className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "accept",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          className={`${styles.declineButton} ${styles.hover_white}`}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "decline",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          Decline
                                        </button>

                                        {/* Reset button with delete icon */}
                                        {/* <button
                                          type="button"
                                          className={styles.resetButton}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "delete",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </button> */}
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
                            <a
                              href={offer?.permalink ? offer.permalink : ""}
                              target="_blank"
                            >
                              <h5>{offer.domain_title}</h5>
                            </a>
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
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "accept"
                                  )
                                }
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className={`${styles.declineButton} ${styles.hover_white}`}
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "decline"
                                  )
                                }
                              >
                                Decline
                              </button>

                              {/* Reset button with delete icon */}
                              {/* <button
                                type="button"
                                className={styles.resetButton}
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "delete"
                                  )
                                }
                              >
                                <DeleteIcon />
                              </button> */}
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : offerLoading == false ? (
              <div className={styles.order_error_msg}>
                <div>No Offers at the Moment. </div>
              </div>
            ) : (
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
                          className={`${styles.offer_status} ${styles.declined}`}
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
                                  <h6 class="countered">
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
                                      <div
                                        className={`${styles.ws_flex} ${styles.gap_10}`}
                                      >
                                        <button
                                          type="button"
                                          className={`${styles.acceptButton} ${styles.hover_white_dark}`}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "accept",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          className={`${styles.declineButton} ${styles.hover_white}`}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "decline",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          Decline
                                        </button>

                                        {/* Reset button with delete icon */}
                                        {/* <button
                                          type="button"
                                          className={styles.resetButton}
                                          onClick={() =>
                                            handlePastOfferAcceptDelete(
                                              offer.offer_id,
                                              "delete",
                                              counter_offer.counter_offer_id
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </button> */}
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
                            <a
                              href={offer?.permalink ? offer.permalink : ""}
                              target="_blank"
                            >
                              <h5>{offer.domain_title}</h5>
                            </a>
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
                                onClick={() =>
                                  handleCounterOfferSubmit(offer.offer_id)
                                }
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
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "accept"
                                  )
                                }
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className={`${styles.declineButton} ${styles.hover_white}`}
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "decline"
                                  )
                                }
                              >
                                Decline
                              </button>

                              {/* Reset button with delete icon */}
                              {/* <button
                                type="button"
                                className={styles.resetButton}
                                onClick={() =>
                                  handlePastOfferAcceptDelete(
                                    offer.offer_id,
                                    "delete"
                                  )
                                }
                              >
                                <DeleteIcon />
                              </button> */}
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : offerLoading == false ? (
              <div className={styles.order_error_msg}>
                <div>No Offers at the Moment. </div>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferTabs;
