import { useEffect, useState } from "react";
import LogoImage from "./LogoImage";
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
    async function fetchDomains() {
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
      fetchDomains();
    }
  }, [userData.id]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  if (isLoading) {
    return <div>Loading Domains...</div>;
  }
  return (
    <div>
      <div>
        <h4>Active Domains</h4>
        {domains.map((domain) => {
          const regularPrice = parseFloat(domain.meta._regular_price?.[0]) || 0;
          const salePrice = parseFloat(domain.meta._sale_price?.[0]) || 0;
          const discountPercentage =
            regularPrice && salePrice
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;

          const favouriteCout =
            domain.meta._favourite_count?.[0].source_url || "";

          const logoImageId = domain.meta?._logo_image?.[0] || null;
          // Extract the featured image URL
          const featuredImageUrl =
            domain._embedded && domain._embedded["wp:featuredmedia"]
              ? domain._embedded["wp:featuredmedia"][0].source_url
              : null;

          return (
            <div>
              title: {domain.title.rendered}
              sale price : {salePrice}
              regular price : {regularPrice}
              discount : {discountPercentage}
              <p>
                Featured Image:
                {featuredImageUrl ? (
                  <img src={featuredImageUrl} alt={domain.title.rendered} />
                ) : (
                  "No image"
                )}
              </p>
              logurl :
              <LogoImage
                logoImageId={logoImageId}
                domain_title={domain.title.rendered}
                featuredImageUrl={featuredImageUrl}
              />
              favourite count: {favouriteCout}
              {/* {console.log(domain._embedded.wp.featuredmedia)} */}
            </div>
          );
        })}
      </div>
      <div>
        <h2>Draft Domains</h2>
        {draftDomains.map((domain) => {
          const regularPrice = parseFloat(domain.meta._regular_price?.[0]) || 0;
          const salePrice = parseFloat(domain.meta._sale_price?.[0]) || 0;
          const discountPercentage =
            regularPrice && salePrice
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;

          const favouriteCout =
            domain.meta._favourite_count?.[0].source_url || "";

          const logoImageId = domain.meta?._logo_image?.[0] || null;
          // Extract the featured image URL
          const featuredImageUrl =
            domain._embedded && domain._embedded["wp:featuredmedia"]
              ? domain._embedded["wp:featuredmedia"][0].source_url
              : null;

          return (
            <div>
              title: {domain.title.rendered}
              sale price : {salePrice}
              regular price : {regularPrice}
              discount : {discountPercentage}
              <p>
                Featured Image:
                {featuredImageUrl ? (
                  <img src={featuredImageUrl} alt={domain.title.rendered} />
                ) : (
                  "No image"
                )}
              </p>
              logurl :
              <LogoImage
                logoImageId={logoImageId}
                domain_title={domain.title.rendered}
                featuredImageUrl={featuredImageUrl}
              />
              favourite count: {favouriteCout}
              {/* {console.log(domain._embedded.wp.featuredmedia)} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
