import { useEffect, useState } from "react";
import Logo from "./Logo";
import styles from "./Tabs.module.css"; // Import styles
import "./Domains.css";
import active_domains_icon from "./images/active-domains-icon.png";
import domain_drafts_icon from "./images/domain_drafts_icon.png";
import plus_bg_icon from "./images/plus-bg-icon.png";
import domains_add_domain_img from "./images/domains_add_domain_img.png";
import add_product_icon from "./images/add_product.png";
import save_draft_icon from "./images/save_draft.png";
import delete_reset_icon from "./images/delete-reset-icon.png";
// const currentUrl = "https://new-webstarter.codepixelz.tech";
const currentUrl = window.location.origin;
const domain_url = `${currentUrl}/wp-json/wp/v2/domain/`; // for getting domains
const draft_domain_url = `${currentUrl}/wp-json/wp/v2/domain/`;

export default function Domains({ userData, setSellerCentralTab }) {
  const [domains, setDomains] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [draftDomains, setDraftDomains] = useState([]);

  // fetching active domains

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
        console.log(data);

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
      <div>
        <div>
          <p>Are you sure want to delete?</p>
        </div>
        <div>
          <input type="submit" value="Delete" onClick={handleDeleteConfirm} />
          <input type="submit" value="Cancel" onClick={handleDeleteCancel} />
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
    return <div>Loading Domains...</div>;
  }

  // Render each domain card
  const renderDomainCard = (domain) => {
    const regularPrice = parseFloat(domain.meta._regular_price?.[0]) || 0;
    const salePrice = parseFloat(domain.meta._sale_price?.[0]) || 0;
    const discountPercentage =
      regularPrice && salePrice
        ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
        : 0;

    const favouriteCount = domain.meta._favourite_count?.[0] || "0";
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
              src="/wp-content/plugins/card-block/images/diamond.png"
              alt="Diamond Icon"
            />
          </div>

          {/* Hover buttons */}
          <div class="domains_hover_buttons">
            <div
              id={domain.id}
              className="domianEditIcon"
              onClick={() => handleIconClick(domain.id)}
            >
              <img src={save_draft_icon} />
            </div>
            <div>
              <img src={add_product_icon} />
            </div>
            <div onClick={() => handleDelete(domain.id)}>
              <img src={delete_reset_icon} />
            </div>
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
              <div className="ws_card_price_wrapper ws_flex gap_10">
                <p className="regular_price">${regularPrice.toFixed(2)}</p>
                <p className="sale_price">${salePrice.toFixed(2)}</p>
              </div>
            </span>
            <div className="ws-card-likes">
              <h6>
                <span>{favouriteCount}</span>
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
    // window.open('http://stackoverflow.com', '_blank');
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
          <img src={active_domains_icon}></img>
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
          <img src={domain_drafts_icon}></img>
          <h4>Draft Domains</h4>
        </div>
        <div
          className={`${styles.dashboard_small_margin} dashboard_domains_cards_wrapper`}
        >
          {draftDomains.map(renderDomainCard)}
          {/* static card */}
          <div
            className={`${styles.media_content_wrapper} ${styles.media_card_no_padding} ${styles.media_setup_last_card}`}
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
