import { useEffect, useState } from "react";

export default function LogoImage({
  logoImageId,
  domain_title,
  featuredImageUrl,
}) {
  // const currentUrl = "https://new-webstarter.codepixelz.tech";
  const currentUrl = window.location.origin;

  //const currentUrl = window.location.origin;

  const [logoUrl, setLogoUrl] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchLogoImageUrl() {
      if (logoImageId > 0) {
        try {
          const res = await fetch(
            `${currentUrl}/wp-json/wp/v2/media/${logoImageId}`
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
          }
          const data = await res.json();
          setLogoUrl(data);
        } catch (err) {
          setErrorMessage(err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // Set loading to false if logoImageId is invalid
      }
    }
    fetchLogoImageUrl();
  }, [logoImageId]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  if (isLoading) {
    return <div>Loading..</div>;
  }
  const imageUrl =
    logoUrl.media_details?.sizes?.thumbnail?.source_url || featuredImageUrl;
  return (
    <div>
      {imageUrl ? <img src={imageUrl} alt={domain_title || "Image"} /> : ""}
    </div>
  );
}
