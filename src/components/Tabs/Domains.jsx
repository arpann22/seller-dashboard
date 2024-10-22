import { useEffect, useState } from "react";
const currentUrl = window.location.origin;
// const domain_url =
export default function Domains({ userData }) {
  const [domains, setDomains] = useState();
  useEffect(() => {
    function fetchDomains() {}
  }, []);

  return <div>Domains...{userData.id}</div>;
}
