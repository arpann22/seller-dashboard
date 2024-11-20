import { useEffect, useState } from "react";
import styles from "./Tabs.module.css"; // Import styles
// const currentUrl = "https://new-webstarter.codepixelz.tech/";
const currentUrl = window.location.origin;
const url = `${currentUrl}/wp-json/wp/v2/domain/`; // for getting domains

const extractDomainId = (serializedString) => {
  const match = serializedString.match(/s:\d+:"(\d+)";/);
  return match ? match[1] : null;
};

const parseSerializedArray = (serialized) => {
  const matches = serialized.match(/s:\d+:"(.*?)";/g);
  if (!matches) return [];
  return matches.map((match) => match.match(/"(.*?)"/)[1]);
};

export default function OrderDetails({
  order,
  isModalOpen,
  setIsModalOpen,
  orderTotal,
  subTotal,
}) {
  const domainIdString = order.meta._domain_ids[0];
  const domainId = extractDomainId(domainIdString);

  const domainIds = parseSerializedArray(domainIdString);
  console.log(domainIds);
  // if (domainIds && domainIds.length > 1) {
  //   console.log("multiple");
  // }

  const [domainDetails, setDomainDetails] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [domains, setDomains] = useState([]);

  useEffect(() => {
    async function fetchDomains() {
      try {
        const responses = await Promise.all(
          domainIds.map(async (domainId) => {
            const res = await fetch(`${url}${domainId}`);
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message);
            }
            const data = await res.json(); // Parse and return the response JSON
            return data;
          })
        );

        // Combine all domain details into one array or object
        // setDomainDetails(responses);
        setDomains(responses);
        // console.log(responses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (domainIds && domainIds.length > 0) {
      fetchDomains();
    }
  }, [domainId]);

  // Loading state handling
  if (loading) {
    return <div>Loading order details...</div>;
  }

  // Error state handling
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* {console.log(domains)} */}
      {/* Modal Structure */}
      {isModalOpen && (
        <div
          className={styles.my_orders_modal_overlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <span
              className={styles.modal_close}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <div className={styles.order_details_popup}>
              <p>
                Order #{order.id} was placed on{" "}
                {new Date(order.meta._date_created[0]).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}{" "}
                and is currently {order.meta._order_status[0]}.
              </p>
              <h2>Order details</h2>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => (
                      <tr>
                        <td>{domain?.title?.rendered || "N/A"}</td>
                        <td>
                          {order.meta._currency_symbol?.[0]}
                          {domain?.meta?._sale_price
                            ? domain.meta._sale_price[0]
                            : domain.meta._regular_price[0]}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Subtotal:</td>
                      <td>
                        {order.meta._currency_symbol?.[0]}
                        {order.meta._order_subtotal[0]}
                      </td>
                    </tr>
                    <tr>
                      <td>Total:</td>
                      <td>
                        {order.meta._currency_symbol?.[0]}
                        {order.meta._order_total[0]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h2>Billing address</h2>
              <div>
                <p>
                  {order.meta._billing_first_name[0]}{" "}
                  {order.meta._billing_last_name[0]}
                </p>
                <p>{order.meta._billing_city[0]}</p>
                <p>{order.meta._billing_address_1[0]}</p>
                <p>{order.meta._billing_address_2[0]}</p>
                <p>{order.meta._billing_phone[0]}</p>
                <p>{order.meta._billing_email[0]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
