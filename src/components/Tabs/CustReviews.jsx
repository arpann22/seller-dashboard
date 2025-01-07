import React from "react";
import styles from "./Tabs.module.css"; // Import styles
import "./Dashboard.css";
import { ReactComponent as ReviewsIcon } from "./image/reviews.svg"; // Renamed to avoid conflicts
import cust_img from "./images/cust_image.png"; // Correctly import image

const CustReviews = () => {
  // Sample data for reviews
  const reviewData = [
    {
      id: 1,
      text: "“Excellent experience! The domain transfer was smooth and quick. The seller was professional and provided great communication throughout the process. Highly recommend!”",
      customerName: "Micheal Jackson",
      rating: 5.0,
      customerImage: cust_img,
    },
    {
      id: 2,
      text: "“Great service! Quick response time and seamless transaction. Highly recommended!”",
      customerName: "John Doe",
      rating: 4.8,
      customerImage: cust_img,
    },
    // Add more reviews as needed
  ];

  return (
    <div
      className={`${styles.wallet_available_balance} dashboard_cust_reviews_wrapper`}
    >
      <div
        className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.justify_space_between}`}
      >
        <h4>Latest Reviews</h4>
      </div>
      <div className="dashboard_reviews">
        {reviewData.map((review) => (
          <div className="dashboard_review_card" key={review.id}>
            <p>{review.text}</p>
            <div className="review_cust_detail ws_dashboard_flex">
              <img src={review.customerImage} alt={review.customerName} />
              <div>
                <span className="cust_review_point">
                  {review.rating}
                  <ReviewsIcon />
                </span>
                <h5>{review.customerName}</h5>
              </div>
              <a href="#" className="ml_auto">
                <span>Reply</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustReviews;
