import { useState } from "react";

const currentUrl = window.location.origin;
export default function BecomeSeller({ userData, refreshTabs }) {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  console.log("become a seller", isChecked);
  async function handleSubmit(e) {
    e.preventDefault();
    refreshTabs();
    setError("");
    if (isChecked) {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/become-seller/${userData.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              check: "hello",
              become_seller: isChecked,
            }),
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();

        if (data) {
        }
        console.log("become-seller", data);
      } catch (err) {
        setError(err);
        console.log(err);
      }
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h5>Vendor Application</h5>
        <p>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            required
          />{" "}
          I have read and accepted the <a href="#"> terms and conditions.</a>
        </p>
        <input type="submit" value="Become a Seller" />
      </form>

      {error && <p> {error}</p>}
    </div>
  );
}
