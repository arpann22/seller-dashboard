import { useEffect, useState } from "react";
const url = "http://webstarter.local/wp-json/wp/v2/domain/";
const extractDomainId = (serializedString) => {
  const match = serializedString.match(/s:\d+:"(\d+)";/);
  return match ? match[1] : null;
};
export default function OrderDetails({ order }) {
  //   console.log(order);
  const domainIdString = order.meta._domain_ids[0];
  const domainId = extractDomainId(domainIdString);
  const [domainDetails, setDomainDetails] = useState({});
  //   console.log(domainTitle);
  useEffect(() => {
    async function get_domain() {
      const res = await fetch(`${url}` + domainId);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      } else {
        const data = await res.json(); // return the order data
        setDomainDetails(data);
      }
    }
    get_domain();
  }, [domainId]);

  return (
    <div>
      <div>
        {/* <div id="myModal" class="modal">
        <div class="modal-content"> */}
        <div>
          <p>
            Order #{order.id} was placed on
            {new Date(order.meta._date_created[0]).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            and is currently {order.meta._order_status[0]}
          </p>
          <h2>Order details</h2>
          <div>
            <table>
              <thead>
                <th>Product</th>
                <th>Total</th>
              </thead>
              <tbody>
                <tr>
                  <td>{domainDetails?.title?.rendered}</td>
                  <td>{order.meta._order_total[0]}</td>
                </tr>
                <tr>
                  <td>Subtotal:</td>
                  <td>{order.meta._order_subtotal[0]}</td>
                </tr>
                <tr>
                  <td>Total:</td>
                  <td>{order.meta._order_total[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>Billing address</h2>
          <div>
            <p>
              {order.meta._billing_first_name[0]}
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
  );
}
