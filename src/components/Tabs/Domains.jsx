import { useEffect, useState } from "react";
import LogoImage from "./LogoImage";
import styles from "./Tabs.module.css"; // Import styles
import "./Domains.css";
import active_domains_icon from "./images/active-domains-icon.png";
const currentUrl = window.location.origin;
const domain_url = `${currentUrl}/wp-json/wp/v2/domain/`; // for getting domains
const draft_domain_url = `${currentUrl}/wp-json/wp/v2/domain/`;

export default function Domains({ userData }) {
  const [domains, setDomains] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [draftDomains, setDraftDomains] = useState([]);

  useEffect(() => {
    async function fetchDomains() {
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
    if (userData.id) {
      fetchDomains();
    }
  }, [userData.id]);

  useEffect(() => {
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
    if (userData.id) {
      fetchDraftDomains();
    }
  }, [userData.id]);

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

    return (
      <div
        className="ws-cards-container swiper-slide dashboard_domain_cards"
        key={domain.id}
      >
        {/* Premium Icon */}
        <div className="premium_icon">
          <img
            src="/wp-content/plugins/card-block/images/diamond.png"
            alt="Diamond Icon"
          />
        </div>

        {/* Hover Charts */}
        <div className="ws_card_hover_charts ws_flex">
          <div className="circular-progress page-trust">
            <div className="progress-text">
              <div
                role="progressbar"
                aria-valuenow="1"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ "--value": 1 }}
              ></div>
            </div>
            <div className="progress-title">
              <h6>Page Trust</h6>
            </div>
          </div>
          <div className="circular-progress domain-trust">
            <div className="progress-text">
              <div
                role="progressbar"
                aria-valuenow="1"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ "--value": 1 }}
              ></div>
            </div>
            <div className="progress-title">
              <h6>Domain Trust</h6>
            </div>
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
          <LogoImage
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
    );
  };

  return (
    <div class="dashboard_domains_wrapper">
      {/* Active Domains Section */}
      <div class="dashboard_active_domain_wrapper">
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={active_domains_icon}></img>
          <h4>Active Domains</h4>
        </div>
        <div className={styles.dashboard_small_margin}>
          {domains.map(renderDomainCard)}
        </div>
      </div>

      {/* Draft Domains Section */}
      <div class="dashboard_draft_domain_wrapper dashboard_small_margin">
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={active_domains_icon}></img>
          <h4>Draft Domains</h4>
        </div>
        <div className={styles.dashboard_small_margin}>
          {draftDomains.map(renderDomainCard)}
        </div>
      </div>
    </div>
  );
}
