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
export default function AddDomain({ styles, userData }) {
  const [isSalePriceEnabled, setIsSalePriceEnabled] = useState(false);
  const [isLeaseToOwnEnabled, setLeaseToOwnEnabled] = useState(false);
  const [isAcceptOffersEnabled, setAcceptOffersEnabled] = useState(false);
  // const [content, setContent] = useState("");

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
  // const handleEditorChange = (newContent) => {
  //   setContent(newContent);
  // };
  // progress scores
  const CircularProgressCard = ({
    title,
    value,
    onChange,
    strokeColor,
    label,
  }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = (value / 100) * circumference;
    const strokeDashoffset =
      value > 0 ? circumference - strokeDasharray : circumference;

    return (
      <div
        className={`${styles.domain_appraisal_body_card} ${styles.ws_flex} `}
      >
        <div>
          <h5>{title}</h5>
          <input
            type="number"
            value={value}
            onChange={(e) =>
              onChange(Math.max(0, Math.min(100, Number(e.target.value))))
            } // Clamp between 0 and 100
            className={styles.input_field}
          />
        </div>
        <div className="circular-progress">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background Circle - Light Gray */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#f3f5fa"
              strokeWidth="10"
            />
            {/* Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={strokeColor} // Dynamic color for each card
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            {/* Display Value with Label */}
            <text
              x="50%"
              y="50%"
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize="20"
              fill="#333"
            >
              {value} {label}
            </text>
          </svg>
        </div>
      </div>
    );
  };

  const [pageTrustScore, setPageTrustScore] = useState(0);
  const [domainAge, setDomainAge] = useState(0);
  const [domainTrustScore, setDomainTrustScore] = useState(0);
  const [domainLength, setDomainLength] = useState(0);
  const [da_pa, setDaPa] = useState();
  // progress scores end

  // upload logo handler

  // upload logo handler end
  const [apidata, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState("");

  // sunder jss
  function ageToDecimal(ageString) {
    if (!ageString) {
      return 0;
    }
    // Regular expression to match "X years Y days" with optional whitespace and pluralization
    const regex = /(\d+)\s*years?\s*(\d+)\s*days?/i;
    const match = ageString.match(regex);

    if (!match) {
      throw new Error("Invalid age format. Please use 'X years Y days'.");
    }

    const years = parseInt(match[1], 10);
    const days = parseInt(match[2], 10);

    // Assuming a year has 365 days
    const decimalAge = years + days / 365;

    // Optionally, round to two decimal places
    return Math.round(decimalAge * 100) / 100;
  }

  const [domainNameError, setDomainNameError] = useState("");
  // url validation
  function isValidDomain(domain) {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (isValidDomain(domainName) == false) {
      setDomainNameError("Invalid Domain Name");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/domain_fields?domain_name=${domainName}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();

      const da_pa = data[0].da_pa.split("/");
      const da = da_pa[0];
      const pa = da_pa[1];
      const age = ageToDecimal(data[0].age);

      setApiData(data);
      setDomainLength(data[0].length);
      da ? setDomainTrustScore(da) : setDomainTrustScore(0);
      pa ? setPageTrustScore(pa) : setPageTrustScore(0);
      setDomainAge(age);
    } catch (err) {
      console.log(err.msg);
    } finally {
      setIsLoading(false);
    }
  };

  // fetching category list for select option
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
        setCategory(data);
      } catch (err) {
        setCatError(err.message);
      } finally {
        setCatLoading(false);
      }
    }
    fetchCategory();
  }, []);

  // fetching industry
  const [industry, setIndustry] = useState();
  const [industryError, setIndustryError] = useState("");
  const [industryLoading, setIndustryLoading] = useState(true);
  useEffect(() => {
    async function fetchIndustry() {
      try {
        const res = await fetch(`${currentUrl}/wp-json/wp/v2/domain_industry/`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        setIndustry(data);
      } catch (err) {
        setIndustryError(err.message);
      } finally {
        setIndustryLoading(false);
      }
    }
    fetchIndustry();
  }, []);

  // fetching tags
  const [tags, setTags] = useState();
  const [tagError, setTagError] = useState("");
  const [tagLoading, setTagLoading] = useState(true);
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${currentUrl}/wp-json/wp/v2/domain_tag/`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        setTags(data);
      } catch (err) {
        setTagError(err.message);
      } finally {
        setTagLoading(false);
      }
    }
    fetchTags();
  }, []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [formData, setFormData] = useState({
    regular_price: "",
    sale_price: "",
    start_date: "",
    end_date: "",
  });

  // for image and audio
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // For the actual file object
  const [audioFile, setAudioFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file); // File object for API request
    }
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file); // Store audio file for API request
    }
  };
  // getting tld from domain name
  function getTLD(domain) {
    const parts = domain.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : null;
  }

  const [errorMessage, setErrorMessage] = useState("");

  // for getting selected category id so that can be send via post request
  async function handelFormSubmit(e) {
    e.preventDefault();
    if (!domainName) {
      setErrorMessage("Domain name is empty.");
      return;
    }
    if (isValidDomain(domainName) == false) {
      setErrorMessage("Invalid Domain Name");
      return;
    }
    if (parseInt(formData.regular_price) < parseInt(formData.sale_price)) {
      setErrorMessage("Sale price cannot be greater than regular price.");
      return;
    }
    if (selectedIndustries.length < 1) {
      setErrorMessage("Industries cannot be empty.");
      return;
    }
    setErrorMessage("");
    let categoryIds = [];
    if (selectedCategories) {
      categoryIds = selectedCategories.map((category) => {
        return category.id;
      });
    }
    let industryIds = [];
    if (selectedIndustries) {
      industryIds = selectedIndustries.map((industry) => {
        return industry.id;
      });
    }
    let tagIds = [];
    if (selectedTags) {
      tagIds = selectedTags.map((tag) => {
        return tag.id;
      });
    }

    const lease_to_own = isLeaseToOwnEnabled;
    const offer = isAcceptOffersEnabled ? "yes" : "no";
    const page_trust = pageTrustScore.toString();
    const domain_trust = domainTrustScore.toString();
    const da_pa = domain_trust.concat("/", page_trust);

    let imageId = null;
    let audioMediaId = null;
    let domainId = null;
    // Step 1: Upload the image to the media library if there's an image file
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const mediaResponse = await fetch(`${currentUrl}/wp-json/wp/v2/media`, {
          method: "POST",
          body: formData,
        });

        if (!mediaResponse.ok) {
          throw new Error("Image upload failed");
        }

        const mediaData = await mediaResponse.json();
        imageId = mediaData.id; // Get the media ID for the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    // Step 2: Upload audio file if it exists

    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);
      try {
        const audioResponse = await fetch(`${currentUrl}/wp-json/wp/v2/media`, {
          method: "POST",
          body: formData,
        });
        const audioData = await audioResponse.json();
        audioMediaId = audioData.id; // Get audio media ID
      } catch (error) {
        console.error("Audio upload failed:", error);
      }
    }

    const domainInfo = {
      title: domainName,
      status: postStatus,
      author: userData.id,
      domain_industry: industryIds,
      domain_cat: categoryIds,
      domain_tag: tagIds,
      featured_media: imageId,
    };

    try {
      const res = await fetch(`${currentUrl}/wp-json/wp/v2/domain`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(domainInfo),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("response data ", data);
      domainId = data.id;
    } catch (error) {
      console.log(error);
    }
    if (domainId) {
      const domaimMetaInfo = {
        _thumbnail_id: imageId,
        _age: domainAge,
        _length: domainLength,
        _da_pa: da_pa,
        _pronounce_audio: audioMediaId,
        _logo_image: imageId,
        _regular_price: formData.regular_price,
        _sale_price: formData.sale_price,
        _sale_start_date: formData.start_date,
        _sale_end_date: formData.end_date,
        _stock_status: "instock",
        _enable_offers: offer,
        _tld: getTLD(domainName),
        _lease_to_own: lease_to_own,
      };
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wstr/v1/domain_meta/${domainId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(domaimMetaInfo),
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("response data ", data);
      } catch (error) {
        console.log(error);
      }
    }
  }
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
        <div>{domainNameError && domainNameError}</div>
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
            <input
              type="submit"
              value="Generate"
              class="hover_white_dark"
            ></input>
          </form>
        </div>
      </div>
      <form onSubmit={handelFormSubmit}>
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
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                  />
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
                src={selectedImage || domain_img}
                alt="attach logo image"
                className={styles.media_image}
              />
              <div className={styles.media_setup_contents_footer}>
                <div className={styles.text_column}>
                  <h5>Show Off your Brand!</h5>
                  <p>Upload your Logo to Customize!</p>
                </div>

                <div className={styles.image_column}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
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
                  <h2>{domainName ? domainName : "example.com"}</h2>
                  <h5>Estimated Value</h5>
                  <h3>
                    $15,000 <span>USD</span>
                  </h3>
                  <p>
                    <span>Calculated By AI</span>Using hundreds of predictive
                    data points.
                  </p>
                </div>
                <div>
                  <img src={domainAppraisalHeadingImage}></img>
                </div>
              </div>
              <div className={styles.domain_appraisal_body_wrapper}>
                <div className={styles.domain_appraisal_body_cards}>
                  {/* Page Trust Score */}
                  <CircularProgressCard
                    title="Page Trust Score"
                    value={pageTrustScore}
                    onChange={setPageTrustScore}
                    strokeColor="#f5b903" // Yellow color for Page Trust Score
                    label="of 100"
                  />

                  {/* Domain Age */}
                  <CircularProgressCard
                    title="Domain Age"
                    value={domainAge}
                    onChange={setDomainAge}
                    strokeColor="#00cd97" // Green color for Domain Age
                    label="Years"
                  />

                  {/* Domain Trust Score */}
                  <CircularProgressCard
                    title="Domain Trust Score"
                    value={domainTrustScore}
                    onChange={setDomainTrustScore}
                    strokeColor="#00d9f5" // Blue color for Domain Trust Score
                    label="of 100"
                  />

                  {/* Domain Length */}
                  <CircularProgressCard
                    title="Domain Length"
                    value={domainLength}
                    onChange={setDomainLength}
                    strokeColor="#f00073" // Pink color for Domain Length
                    label="Letters"
                  />
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
                value={formData.regular_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regular_price: e.target.value,
                  })
                }
                placeholder="Enter regular price"
                min="0" // Prevent negative values
                required
              />
            </div>

            {/* Sale Price Input with Toggle */}
            <div
              className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column}`}
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
                  value={formData.sale_price}
                  onChange={(e) =>
                    setFormData({ ...formData, sale_price: e.target.value })
                  }
                  min="0"
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
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className={styles.input_field}
                    disabled={!isSalePriceEnabled} // Disable based on toggle
                  />
                </div>
                <div className={`${styles.date_field} ${styles.flex_column}`}>
                  <label htmlFor="endSale">End Sale</label>
                  <input
                    type="date"
                    id="endSale"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className={styles.input_field}
                    disabled={!isSalePriceEnabled} // Disable based on toggle
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
            <CardSelector
              items={category}
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
            />
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
            {/* <CardSelector items={tagsItems} /> */}
            {tagError ? (
              tagError
            ) : tagLoading ? (
              tagLoading
            ) : (
              <CardSelector
                items={tags}
                selectedItems={selectedTags}
                setSelectedItems={setSelectedTags}
              />
            )}
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

          {/* <CardSelector items={industryItems} /> */}
          {industryError ? (
            industryError
          ) : industryLoading ? (
            industryLoading
          ) : (
            <CardSelector
              items={industry}
              selectedItems={selectedIndustries}
              setSelectedItems={setSelectedIndustries}
            />
          )}
        </div>
        <div>{errorMessage && errorMessage}</div>
        <div className={styles.save_button_wrappers}>
          <button
            onClick={() => setPostStatus("publish")}
            className={`${styles.add_product_button} ${styles.hover_white_dark}`}
          >
            <span className={styles.icon}>
              <img src={add_product_icon} alt="Add Product Icon" />
            </span>
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setPostStatus("draft")}
            className={`${styles.save_draft_button} ${styles.hover_white}`}
          >
            <span className={styles.icon}>
              <img src={save_draft_icon} alt="Save Draft Icon" />
            </span>
            <span>Save Draft</span>
          </button>
        </div>
      </form>
    </>
  );
}
