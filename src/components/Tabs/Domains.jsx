import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import styles from "./Tabs.module.css"; // Import styles
import "./Domains.css";
import active_domains_icon from "./images/active-domains-icon.png";
import domain_drafts_icon from "./images/domain_drafts_icon.png";
import plus_bg_icon from "./images/plus-bg-icon.png";
import domains_add_domain_img from "./images/domains_add_domain_img.png";
import { ReactComponent as DeleteIcon } from "./image/delete.svg";
import { ReactComponent as AddProductIcon } from "./image/add_product.svg";
import { ReactComponent as SaveDraftIcon } from "./image/save_draft.svg";
import { ReactComponent as ActiveDomainsIcon } from "./image/active_domains.svg";
import { ReactComponent as DraftsDomainsIcon } from "./image/domain_drafts.svg";
import { FaSpinner } from "react-icons/fa";
//const currentUrl = window.location.origin;
const currentUrl = window.location.origin;
const domain_url = `${currentUrl}/wp-json/wp/v2/domain/`; // for getting domains
const draft_domain_url = `${currentUrl}/wp-json/wp/v2/domain/`;

export default function Domains({
  userData,
  setSellerCentralTab,
  activeInnerTab,
}) {
  const [domains, setDomains] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [draftDomains, setDraftDomains] = useState([]);

  //scroll to draft domain at the ends
  const draftRef = useRef(null);
  useEffect(() => {
    if (activeInnerTab == "Domains") {
      draftRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [activeInnerTab, domains]);

  // fetching active domains

  // show on mobile on click edit buttons
  const [showButtons, setShowButtons] = useState(false);

  // Long press detection
  let pressTimer = null;

  const handleTouchStart = () => {
    pressTimer = setTimeout(() => setShowButtons(true), 500); // Long press (500ms)
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  async function fetchActiveDomains() {
    try {
      const res = await fetch(
        `${domain_url}?author=${userData.id}&per_page=999&_embed`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();
      setDomains(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userData.id) {
      fetchActiveDomains();
    }
  }, [userData.id]);

  // fetching drafts domains

  async function fetchDraftDomains() {
    try {
      const res = await fetch(
        `${draft_domain_url}?author=${userData.id}&per_page=999&_embed&status=draft`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();
      setDraftDomains(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userData.id) {
      fetchDraftDomains();
    }
  }, [userData.id]);

  // handling domain delete starts
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const [deletingDomainId, setDeletingDomainId] = useState();

  // function for handling delete operation
  async function handleDeleteConfirm() {
    setAllowDelete(false);
    setDeleteLoading(true);
    if (deletingDomainId) {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain/${deletingDomainId}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();

        // Refresh active and draft domains
        await fetchActiveDomains();
        await fetchDraftDomains();
      } catch (err) {
        console.log(err);
      } finally {
        setDeleteLoading(false);
      }
    }
  }

  function handleDeleteCancel() {
    setAllowDelete(false);
  }

  const DeleteConfirm = () => {
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
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.popupMessage}>
            <DeleteIcon />
            <p>Are you sure you want to delete?</p>
          </div>
          <div className={styles.popupActions}>
            <input
              type="submit"
              value="Delete"
              onClick={handleDeleteConfirm}
              className={styles.deleteButton}
            />
            <input
              type="submit"
              value="Cancel"
              onClick={handleDeleteCancel}
              className={styles.cancelButton}
            />
          </div>
        </div>
      </div>
    );
  };

  function handleDelete(domain_id) {
    setDeletingDomainId(domain_id);
    setAllowDelete(true);
    return;
  }

  if (deleteLoading) {
    return <div>Loading...</div>;
  }
  // handling domain delete ends
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  if (isLoading) {
    return (
      <div className="loading_overlay">
        <FaSpinner className="loading" />
      </div>
    );
  }

  // Render each domain card
  const renderDomainCard = (domain) => {
    const regularPrice = parseFloat(domain.meta._regular_price?.[0]) || 0;
    const salePrice = parseFloat(domain.meta._sale_price?.[0]) || 0;
    const discountPercentage =
      regularPrice && salePrice
        ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
        : 0;

    // const favouriteCount = domain.meta._favourite_count?.[0] || "0";
    const favouriteCount = domain.meta.ws_product_view_count?.[0] || "0";
    const formattedFavouriteCount =
      favouriteCount >= 1000 ? (favouriteCount / 1000).toFixed(1) + "k" : 0;
    const logoImageId = domain.meta?._logo_image?.[0] || null;
    const featuredImageUrl =
      domain._embedded && domain._embedded["wp:featuredmedia"]
        ? domain._embedded["wp:featuredmedia"][0].source_url
        : null;
    const da_pa = domain.meta._da_pa?.[0] || 0;
    let da = 0;
    let pa = 0;
    if (da_pa) {
      const splitDaPa = da_pa.split("/");
      da = parseInt(splitDaPa[0]);
      pa = parseInt(splitDaPa[1]);
    }

    return (
      <>
        <div
          className="swiper-slide ws-cards-container-noHover p_relative ws_cards_domains_active_draft"
          key={domain.id}
        >
          {/* Premium Icon */}
          <div className="premium_icon">
            <img
              src="/wp-content/plugins/cpm-card-block/images/diamond.png"
              alt="Diamond Icon"
            />
          </div>

          {/* Hover buttons */}
          {/* <div class="domains_hover_buttons">
            <div
              id={domain.id}
              className="domianEditIcon"
              onClick={() => handleIconClick(domain.id)}
            >
              <SaveDraftIcon />
            </div>
            <div>
              <AddProductIcon />
            </div>
            <div onClick={() => handleDelete(domain.id)}>
              <DeleteIcon />
            </div>
          </div> */}
          <div
            className="ws-cards-container-noHover"
            onClick={() => setShowButtons((prev) => !prev)} // Toggle visibility on click
            onTouchStart={handleTouchStart} // Detect long press
            onTouchEnd={handleTouchEnd} // Reset on touch release
          >
            <div
              className={`domains_hover_buttons ${showButtons ? "show" : ""}`}
            >
              <div
                id={domain.id}
                className="domainEditIcon"
                onClick={() => handleIconClick(domain.id)}
              >
                <SaveDraftIcon />
              </div>
              {/* <div>
                <AddProductIcon />
              </div> */}
              <div onClick={() => handleDelete(domain.id)}>
                <DeleteIcon />
              </div>
            </div>
            {/* Card Content */}
          </div>

          {/* Card Image */}
          <div className="ws-card-img">
            <img
              src={featuredImageUrl || "default-image.png"}
              alt={domain.title.rendered}
            />
          </div>
          {/* Card Contents */}
          <div className="ws-card-contents ws-flex">
            <Logo
              logoImageId={logoImageId}
              domain_title={domain.title.rendered}
              featuredImageUrl={featuredImageUrl}
            />
            <span className="ws-card-inner-contents">
              <h5>
                <a href={`${currentUrl}/domain/${domain.slug}`}>
                  {domain.title.rendered}
                </a>
              </h5>
              {/* <div className="ws_card_price_wrapper ws_flex gap_10">
                <p className="regular_price">${regularPrice.toFixed(2)}</p>
                {salePrice > 0 && (
                  <p className="sale_price">${salePrice.toFixed(2)}</p>
                )}
              </div> */}
              <div className="ws_card_price_wrapper ws_flex gap_10">
                <p className={`${salePrice > 0 ? "on_sale" : ""}`}>
                  ${regularPrice.toFixed(2)}
                </p>
                {salePrice > 0 && (
                  <p className="sale_price">${salePrice.toFixed(2)}</p>
                )}
              </div>
            </span>
            <div className="ws-card-likes disable-favourite">
              <h6>
                <span>{formattedFavouriteCount}</span>
                <i className="fa-solid fa-heart"></i>
              </h6>
            </div>
          </div>
        </div>
      </>
    );
  };

  // handeling edit icon click
  function handleIconClick(domain_id) {
    setSellerCentralTab("Add New Domain");
    localStorage.setItem("editable_domain_id", domain_id);
  }

  // handeling add domain icon click
  function handelAddDomain() {
    setSellerCentralTab("Add New Domain");
  }

  return (
    <div class="dashboard_domains_wrapper">
      {allowDelete && <DeleteConfirm />}
      {/* Active Domains Section */}
      <div class="dashboard_active_domain_wrapper">
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          {/* <img src={active_domains_icon}></img> */}
          <ActiveDomainsIcon />
          <h4>Active Domains</h4>
        </div>
        <div
          className={`${styles.dashboard_small_margin} dashboard_domains_cards_wrapper`}
        >
          {domains.map(renderDomainCard)}
          {/* stataic add domain  */}
          <div className="ws-cards-container-noHover swiper-slide dashboard_domain_cards ws-cards-container-add-domain">
            {/* Card Image */}
            <div className="ws-card-img">
              <img src={domains_add_domain_img} />
            </div>
            <div className="ws-card-contents ws-flex" onClick={handelAddDomain}>
              <div>
                <img src={plus_bg_icon} />
              </div>
              <span className="ws-card-inner-contents">
                <h5>
                  <h5>Add new Domain !</h5>
                </h5>
                <div className="ws_card_price_wrapper ws_flex gap_10">
                  <p>Start Earning</p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Domains Section */}
      <div class="dashboard_draft_domain_wrapper dashboard_small_margin">
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          {/* <img src={domain_drafts_icon}></img> */}
          <DraftsDomainsIcon />
          <h4 ref={draftRef}>Draft Domains</h4>
        </div>
        <div
          className={`${styles.dashboard_small_margin} dashboard_domains_cards_wrapper`}
        >
          {draftDomains.map(renderDomainCard)}
          {/* static card */}
          <div
            className={`${styles.media_content_wrapper} ${styles.media_card_no_padding} ${styles.media_setup_last_card} draft_domain_last_card ws-cards-container-noHover`}
          >
            {/* <img src={media_setup_last_card} alt="attach audio image" className={styles.media_image} /> */}
            <div className={styles.media_setup_contents_footer}>
              <h5>
                Get Your <span>FREE </span> Custom Logo in Just 72 Hours!
              </h5>

              <a href="#" class="hover_white">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
