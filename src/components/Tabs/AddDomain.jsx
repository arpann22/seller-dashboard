import React, { useState, useRef, useEffect } from "react";
import addDomaintitleImage from "./images/add-domain-pre-image.png";
import attachAudioimg from "./images/attach_audio_img.png";
import profileImage from "./images/profile.jpg";
import { IoIosPause } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { FiPlusCircle } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

import add_product_icon from "./images/add_product.png";
import save_draft_icon from "./images/save_draft.png";
import mediaSetupIcon from "./images/media_setup_icon.png";

import domain_img from "./images/chatseek.com.png";

import { IoMdInformationCircle } from "react-icons/io";
import domainAppraisalHeadingImage from "./images/domain_appraisal_heading_image.png";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import CardSelector from "../CardSelector/CardSelector.js";
import categories_icon from "./images/categories-icon.png";
import cardstyles from "../CardSelector/CardSelector.module.css";

const currentUrl = window.location.origin;

export default function AddDomain({ styles }) {
  const cardItems = [
    { title: "Card 1", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 2", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Card 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
  ];
  const industryItems = [
    { title: "Industry 1", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 2", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 3", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
    { title: "Industry 4", subtitle: "AI-PICK", icon: addDomaintitleImage },
  ];
  const tagsItems = [
    { title: "Modern", subtitle: "AI-PICK" },
    { title: "Online Marketplace", subtitle: "AI-PICK" },
    { title: "Marketing", subtitle: "AI-PICK" },
    { title: "Community", subtitle: "AI-PICK" },
    { title: "Online Marketplace", subtitle: "AI-PICK" },
    { title: "Marketing", subtitle: "AI-PICK" },
    { title: "Community", subtitle: "AI-PICK" },
  ];
  const [isSalePriceEnabled, setIsSalePriceEnabled] = useState(false);
  const [isLeaseToOwnEnabled, setLeaseToOwnEnabled] = useState(false);
  const [isAcceptOffersEnabled, setAcceptOffersEnabled] = useState(false);
  const [content, setContent] = useState("");

  const [domainName, setDomainName] = useState("");

  const handleToggle = () => {
    setIsSalePriceEnabled(!isSalePriceEnabled);
  };
  const handleLeaseToOwnToggle = () => {
    setLeaseToOwnEnabled((prevState) => !prevState);
  };

  const handleAcceptOffersToggle = () => {
    setAcceptOffersEnabled((prevState) => !prevState);
  };
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const [apidata, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // sunder jss
  const handleGenerate = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/domain_fields?domain_name=${domainName}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err.msg);
    } finally {
      setIsLoading(false);
    }
  };

  // fetching category
  const [category, setCategory] = useState();
  const [catError, setCatError] = useState("");
  const [catLoading, setCatLoading] = useState(true);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`${currentUrl}/wp-json/wp/v2/domain_cat/`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        console.log(data);
        setCategory(data);
      } catch (err) {
        setCatError(err.message);
      } finally {
        setCatLoading(false);
      }
    }
    fetchCategory();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={`${styles.add_domain_wrapper} ${styles.dashboard_section_margin}`}
      >
        <img src={addDomaintitleImage} alt="stars" />
        <h2>
          {" "}
          Add New <span>Domain</span>
        </h2>
        <p>
          Get a detailed domain breakdown, ranking insights, estimate, and even
          audio pronunciations – all in one go!
        </p>
        <div
          className={`${styles.add_domain_generate_field} ${styles.p_relative}`}
        >
          <form onSubmit={handleGenerate}>
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              required
            />
            <input type="submit" value="Generate"></input>
          </form>
        </div>
      </div>
      <div
        className={`${styles.add_domain_media_setup_wrapper} ${styles.dashboard_small_margin}`}
      >
        <div
          className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Media Setup</h4>
        </div>
        <div className={`${styles.mediaSetupCardsWrapper} ${styles.ws_flex}`}>
          {/* first card */}
          <div className={styles.media_content_wrapper}>
            <img
              src={attachAudioimg}
              alt="attach audio image"
              className={styles.media_image}
            />
            <div className={styles.media_setup_contents_footer}>
              <div className={styles.text_column}>
                <h5>Your Heading Here</h5>
                <p>Your paragraph content here.</p>
              </div>

              <div className={styles.audio_column}>
                <input type="file" accept="audio/*" />
              </div>
            </div>
          </div>
          {/* second card */}
          <div
            className={`${styles.media_content_wrapper} ${styles.media_setup_second_card}`}
          >
            <div className={`${styles.pronounc_add} ${styles.active}`}>
              <FaPlay />
              <div>
                <h5>James</h5>
                <p>0.01</p>
              </div>
              <span>AI-PICK</span>
              <img src={profileImage}></img>
              <RxCrossCircled />
            </div>
            <div className={styles.pronounc_add}>
              <IoIosPause />
              <div>
                <h5>James</h5>
                <p>0.01</p>
              </div>
              <span>AI-PICK</span>
              <img src={profileImage}></img>
              <FiPlusCircle />
            </div>
            <div className={styles.media_setup_contents_footer}>
              <div className={styles.text_column}>
                <h5>Your Heading Here</h5>
                <p>Your paragraph content here.</p>
              </div>

              <div className={styles.audio_column}>
                <input type="file" accept="audio/*" />
              </div>
            </div>
          </div>
          {/* third card */}
          <div
            className={`${styles.media_content_wrapper} ${styles.media_card_no_padding}`}
          >
            <img
              src={domain_img}
              alt="attach audio image"
              className={styles.media_image}
            />
            <div className={styles.media_setup_contents_footer}>
              <div className={styles.text_column}>
                <h5>Your Heading Here</h5>
                <p>Your paragraph content here.</p>
              </div>

              <div className={styles.audio_column}>
                <input type="file" accept="audio/*" />
              </div>
            </div>
          </div>
          {/* fourth card */}
          <div
            className={`${styles.media_content_wrapper} ${styles.media_card_no_padding} ${styles.media_setup_last_card}`}
          >
            {/* <img src={media_setup_last_card} alt="attach audio image" className={styles.media_image} /> */}
            <div className={styles.media_setup_contents_footer}>
              <h5>
                Get Your <span>FREE </span> Custom Logo in Just 72 Hours!
              </h5>

              <a href="#">Get Started</a>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Appraisal */}
      <div
        className={`${styles.dashboard_domain_setup_wrapper} ${styles.ws_flex}`}
      >
        <div className={styles.domain_appraisal_wrapper}>
          <div
            className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={mediaSetupIcon} alt="Media Setup Icon" />
            <h4>Domain Appraisal</h4>
            <IoMdInformationCircle />
          </div>
          <div className={styles.domain_appraisal_inner_wrapper}>
            <div
              className={`${styles.domain_appraisal_inner_wrapper_heading} ${styles.ws_flex}`}
            >
              <div>
                <h2>petrunner.com</h2>
                <h5>Estimated Value</h5>
                <h3>
                  $15,000 <span>USD</span>
                </h3>
                <p>
                  <span>Calculated By AI</span>Using hundreds of predictive data
                  points.
                </p>
              </div>
              <div>
                <img src={domainAppraisalHeadingImage}></img>
              </div>
            </div>
            <div className={styles.domain_appraisal_body_wrapper}>
              <div className={styles.domain_appraisal_body_cards}>
                <div className={styles.domain_appraisal_body_card}>
                  <h5>Page Trust Score</h5>
                  <p>64</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* pricing setup */}
        {/* Pricing Setup Section */}
        <div className={styles.pricing_setup_wrapper}>
          <div
            className={`${styles.price_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <img src={mediaSetupIcon} alt="Media Setup Icon" />
            <h4>Pricing Setup</h4>
            <IoMdInformationCircle />
          </div>

          {/* Regular Price Input */}
          <div
            className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column} ${styles.gap_10}`}
          >
            <label htmlFor="regularPrice">Regular Price*</label>
            <input
              type="number"
              id="regularPrice"
              className={styles.input_field}
              placeholder="Enter regular price"
              min="0" // Prevent negative values
            />
          </div>

          {/* Sale Price Input with Toggle */}
          <div
            className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column} `}
          >
            <div
              className={`${styles.ws_flex} ${styles.salePrice_heading_wrapper}`}
            >
              <div>
                <label htmlFor="salePrice">Sale Price</label>
                <p className={styles.subtitle}>
                  Set your Sale Price for a Limited Time
                </p>
              </div>
              <div className={styles.toggle_button} onClick={handleToggle}>
                <div
                  className={`${styles.toggle_switch} ${
                    isSalePriceEnabled ? styles.on : styles.off
                  }`}
                >
                  <div className={styles.toggle_indicator}>
                    <RxCross2 />
                    <IoCheckmarkOutline />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${styles.sale_price_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              <input
                type="number"
                id="salePrice"
                className={styles.input_field}
                placeholder="Enter sale price"
                min="0" // Prevent negative values
                disabled={!isSalePriceEnabled}
              />
            </div>
            {/* Date Input Fields */}
            <div
              className={`${styles.date_fields_wrapper} ${styles.ws_flex} ${styles.gap_10}`}
            >
              <div className={`${styles.date_field} ${styles.flex_column}`}>
                <label htmlFor="startSale">Start Sale</label>
                <input
                  type="date"
                  id="startSale"
                  className={styles.input_field}
                />
              </div>
              <div className={`${styles.date_field} ${styles.flex_column}`}>
                <label htmlFor="endSale">End Sale</label>
                <input
                  type="date"
                  id="endSale"
                  className={styles.input_field}
                />
              </div>
            </div>
          </div>
          {/* Lease-To-Own Section */}
          <div
            className={`${styles.toggle_section} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <div>
              <h4>Lease-To-Own</h4>
              <p className={styles.subtitle}>
                Flexible Payment Option to Attract Buyers.
              </p>
            </div>
            <div
              className={styles.toggle_button}
              onClick={handleLeaseToOwnToggle}
            >
              <div
                className={`${styles.toggle_switch} ${
                  isLeaseToOwnEnabled ? styles.on : styles.off
                }`}
              >
                <div className={styles.toggle_indicator}>
                  <RxCross2 />
                  <IoCheckmarkOutline />
                </div>
              </div>
            </div>
          </div>

          {/* Flexible Payment Section */}
          <div
            className={`${styles.toggle_section} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
          >
            <div>
              <h4>Accept Offers</h4>
              <p className={styles.subtitle}>Let Buyers Name Their</p>
            </div>
            <div
              className={styles.toggle_button}
              onClick={handleAcceptOffersToggle}
            >
              <div
                className={`${styles.toggle_switch} ${
                  isAcceptOffersEnabled ? styles.on : styles.off
                }`}
              >
                <div className={styles.toggle_indicator}>
                  <RxCross2 />
                  <IoCheckmarkOutline />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* categories */}
      <div
        className={`${styles.cardSelectorWrapper} ${styles.dashboard_small_margin}`}
      >
        <div
          className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Categories</h4>
        </div>
        {catError ? (
          catError
        ) : catLoading ? (
          catLoading
        ) : (
          <CardSelector items={category} />
        )}
      </div>

      {/* domain description */}
      <div
        className={`${styles.cardSelectorWrapper} ${styles.dashboard_small_margin}`}
      >
        <h3>Domain Description</h3>
        <div
          className={`${cardstyles.tags_card_title_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Tags</h4>
        </div>
        <div className={cardstyles.description_tags_wrapper}>
          <CardSelector items={tagsItems} />
        </div>
      </div>

      {/* industries */}
      <div className={`${styles.cardSelectorWrapper}`}>
        <div
          className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
        >
          <img src={mediaSetupIcon} alt="Media Setup Icon" />
          <h4>Industries</h4>
        </div>

        <CardSelector items={industryItems} />
      </div>

      <div className={styles.save_button_wrappers}>
        <button
          className={`${styles.add_product_button} ${styles.hover_white_dark}`}
        >
          <span className={styles.icon}>
            <img src={add_product_icon} alt="Add Product Icon" />
          </span>
          <span>Add Product</span>
        </button>

        <button className={`${styles.save_draft_button} ${styles.hover_white}`}>
          <span className={styles.icon}>
            <img src={save_draft_icon} alt="Save Draft Icon" />
          </span>
          <span>Save Draft</span>
        </button>
      </div>
    </>
  );
}
