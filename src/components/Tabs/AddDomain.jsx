import React, { useState, useRef, useEffect } from "react";

// ckeditors
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import addDomaintitleImage from "./images/add-domain-pre-image.png";
import attachAudioimg from "./images/attach_audio_img.png";
import starswhite from "./images/stars-white.png";
import profileImage from "./images/profile.jpg";
import { IoIosPause } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { FiPlusCircle } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import add_product_icon from "./images/add_product.png";
import save_draft_icon from "./images/save_draft.png";
import mediaSetupIcon from "./images/media_setup_icon.png";
import { RxCross2 } from "react-icons/rx";
import domain_img from "./images/chatseek.com.png";
import mobstyles from "./Tabs.module.mobile.css";
import { IoMdInformationCircle } from "react-icons/io";
import domainAppraisalHeadingImage from "./images/domain_appraisal_heading_image.png";
import { IoCheckmarkOutline } from "react-icons/io5";
import CardSelector from "../CardSelector/CardSelector.js";
import categories_icon from "./images/categories-icon.png";
import cardstyles from "../CardSelector/CardSelector.module.css";
import { Editor } from "@tinymce/tinymce-react";

import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import MarkdownIt from "markdown-it";
import { ReactComponent as DomainAppraisalIcon } from "./image/domain_appraisal.svg";
import { ReactComponent as PricingSetupIcon } from "./image/pricing_setup.svg";
import { ReactComponent as AddProductIcon } from "./image/add_product.svg";
import { ReactComponent as SaveDraftIcon } from "./image/save_draft.svg";
import { ReactComponent as MediaSetupIcon } from "./image/media_setup.svg";
import { ReactComponent as CategoriesIcon } from "./image/categories.svg";
import { ReactComponent as DomainDescIcon } from "./image/domain_desc.svg";
import { ReactComponent as TagsIcon } from "./image/tags.svg";
import { ReactComponent as IndustriesIcon } from "./image/industries.svg";
import { ReactComponent as GenerateStars } from "./image/cta.svg";

// ckeditor
// ck editor end
const md = new MarkdownIt();

//const currentUrl = window.location.origin;
const currentUrl = window.location.origin;
export default function AddDomain({ styles, userData }) {
  const [isSalePriceEnabled, setIsSalePriceEnabled] = useState(false);
  const [isLeaseToOwnEnabled, setLeaseToOwnEnabled] = useState(false);
  const [isAcceptOffersEnabled, setAcceptOffersEnabled] = useState(false);
  const [generateTaxonomies, setIsGenerated] = useState([]);
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

  // tinymce editor
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };
  // upload image
  const handleImageUpload = (blobInfo, progress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      fetch(`${currentUrl}/my-account/?tab=sellers-central/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // Resolve the URL of the uploaded image
          resolve(result.imageUrl);
        })
        .catch((error) => {
          console.error("Image upload failed:", error);
          reject("Image upload failed");
        });
    });
  };
  // tinymce editor end

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
        className={`${styles.domain_appraisal_body_card} ${styles.ws_flex} ${styles.mob_card_padding_30} `}
      >
        <div>
          <h5>{title}</h5>
          <input
            type="text"
            value={value}
            onChange={(e) =>
              onChange(Math.max(0, Math.min(100, Number(e.target.value))))
            } // Clamp between 0 and 100
            className={styles.input_field}
            readOnly
          />
        </div>
        <div className={`${styles.progress_card_add_domain} circular-progress`}>
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
              {/* {value} {label} */}
              <tspan x="50%" dy="0em" className={styles.value_style}>
                {value}
              </tspan>
              <tspan x="50%" dy="1.5em" className={styles.label_style}>
                {label}
              </tspan>
            </text>
          </svg>
        </div>
      </div>
    );
  };

  const [pageTrustScore, setPageTrustScore] = useState(0);
  const [domainAge, setDomainAge] = useState(0);
  const [saveDomainAge, setSaveDomainAge] = useState("");
  const [domainTrustScore, setDomainTrustScore] = useState(0);
  const [domainLength, setDomainLength] = useState(0);
  const [da_pa, setDaPa] = useState();
  const [estimated_value, setEstimatedValue] = useState("00000");

  // progress scores end

  // upload logo handler

  // upload logo handler end
  const [apidata, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState("");

  // select audion form handle

  const [selected, setSelected] = useState("play"); // Default selected value
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };
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
  const [showAddDomain, setShowAddDomain] = useState(false);

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
      setShowAddDomain(true);
      const data = await res.json();
      const da_pa = data[0].da_pa.split("/");
      const da = da_pa[0];
      const pa = da_pa[1];
      const age = ageToDecimal(data[0].age);

      setApiData(data);

      const value_estimated = data[0]?.estimated_value
        ? parseInt(data[0].estimated_value)
        : "00000";

      setEstimatedValue(value_estimated.toLocaleString());

      setDomainLength(data[0].length);

      da ? setDomainTrustScore(da) : setDomainTrustScore(0);
      pa ? setPageTrustScore(pa) : setPageTrustScore(0);

      setDomainAge(age);
      setSaveDomainAge(data[0].age); // for saving years and days in string

      let cat_array = [];
      let tag_array = [
        {
          id: 49,
          taxonomy: "domain_tag",
        },
      ];

      if (data[0].length <= 5) {
        cat_array.push({
          id: 67,
          taxonomy: "domain_cat",
        });

        tag_array.push({
          id: 66,
          taxonomy: "domain_tag",
        });
      } else {
        // Remove the category with id: 67 if it exists
        setSelectedCategories((prevObj) =>
          prevObj.filter((cat) => cat.id !== 67)
        );

        setSelectedTags((prevObj) => prevObj.filter((cat) => cat.id !== 66));
      }

      if (da > 70) {
        cat_array.push({
          id: 84,
          taxonomy: "domain_cat",
        });
      } else {
        setSelectedCategories((prevObj) =>
          prevObj.filter((cat) => cat.id !== 67)
        );
      }

      if (age > 5) {
        cat_array.push({
          id: 78,
          taxonomy: "domain_cat",
        });
      } else {
        setSelectedCategories((prevObj) =>
          prevObj.filter((cat) => cat.id !== 78)
        );
      }

      setSelectedCategories((prevObj) => [...prevObj, ...cat_array]); // handeling category

      setSelectedTags((prevObj) => [...prevObj, ...tag_array]); // handeling tags
      // Set the generated flag to true

      const generate_taxonomy_id = [
        ...new Set([
          ...tag_array.map((item) => item.id),
          ...cat_array.map((item) => item.id),
        ]),
      ];
      setIsGenerated(generate_taxonomy_id);
    } catch (err) {
      console.log(err);
      setDomainNameError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [descLoading, setDescLoading] = useState(false);
  async function handelDomainDesc(e) {
    e.preventDefault();
    setDescLoading(true);
    try {
      const res = await fetch(
        `${currentUrl}/wp-json/wstr/v1/domain_description?domain_name=${domainName}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();

      const htmlContent = md.render(data); // converting markdown to markup language
      setContent(htmlContent); // Set
    } catch (err) {
      console.log(err);
    } finally {
      setDescLoading(false);
    }
  }

  // fetching category list for select option
  const [category, setCategory] = useState();
  const [catError, setCatError] = useState("");
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain_cat/?per_page=99&hide_empty=1`
        );
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
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain_industry/?per_page=99`
        );
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
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain_tag/?per_page=99`
        );
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
  const [audioURL, setAudioURL] = useState(null); // Holds the audio URL for display
  const audioInputRef = useRef(null); // Reference to the file input element
  const [thumbnailId, setThumbnailId] = useState(null); // For existing thumbnail ID
  const [audioId, setAudioId] = useState(null); // For existing audio ID

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
      setAudioURL(URL.createObjectURL(file)); // Generate and store audio URL
    }
  };
  const handleRemoveAudio = () => {
    setAudioFile(null); // Clear audio file
    setAudioURL(null); // Clear audio URL
    if (audioInputRef.current) {
      audioInputRef.current.value = ""; // Reset file input value
    }
  };
  // getting tld from domain name
  function getTLD(domain) {
    const parts = domain.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : null;
  }

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleImageAudioUpload(mediaFile) {
    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile);

      try {
        const mediaResponse = await fetch(`${currentUrl}/wp-json/wp/v2/media`, {
          method: "POST",
          body: formData,
        });

        if (!mediaResponse.ok) {
          throw new Error("Media upload failed");
        }

        const mediaData = await mediaResponse.json();
        return mediaData.id; // Get the media ID for the uploaded image
      } catch (error) {
        console.error("Error uploading media:", error);
        // return;
      }
    }
  }

  const [domain_id, setDomainId] = useState();
  useEffect(() => {
    const getDomainId = localStorage.getItem("editable_domain_id");
    if (getDomainId) {
      setDomainId(getDomainId);
    }
  }, []);

  // converting decimal domain age to string format with years and days
  function convertDecimalToYearsAndDays(decimalYears) {
    // Separate the integer and fractional parts
    if (!decimalYears) {
      return;
    }
    const years = Math.floor(decimalYears);
    const fractionalPart = decimalYears - years;

    // Calculate the number of days (approximate using 365 days in a year)
    const days = Math.round(fractionalPart * 365);

    return `${years} years ${days} days`;
  }

  useEffect(() => {
    // handelAgeChange(domainAge);
    setSaveDomainAge(convertDecimalToYearsAndDays(domainAge));
  }, [domainAge]);

  const [submitLoading, setSubmitLoading] = useState(false);
  // for getting selected category id so that can be send via post request
  async function handelFormSubmit(e) {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error
    setSuccessMessage(""); // Clear previous success

    setSubmitLoading(true);
    if (!domainName) {
      setSubmitLoading(false);
      setErrorMessage("Domain name is empty.");

      return;
    }
    if (isValidDomain(domainName) == false) {
      setSubmitLoading(false);
      setErrorMessage("Invalid Domain Name");

      return;
    }
    if (parseInt(formData.regular_price) < parseInt(formData.sale_price)) {
      setSubmitLoading(false);
      setErrorMessage("Sale price cannot be greater than regular price.");

      return;
    }
    if (!content) {
      setSubmitLoading(false);
      setErrorMessage("Required domain description.");
    }
    if (selectedIndustries.length < 1) {
      setSubmitLoading(false);
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

    let imageId = thumbnailId; // Default to existing thumbnail ID
    let audioMediaId = audioId; // Default to existing audio ID
    let domainId = null;
    // Step 1: Upload the image to the media library if there's an image file
    if (imageFile) {
      imageId = await handleImageAudioUpload(imageFile);
    }

    // Step 2: Upload audio file if it exists
    if (audioFile) {
      audioMediaId = await handleImageAudioUpload(audioFile);
    }

    const estimatedValue = parseInt(estimated_value.replace(/,/g, ""), 10);

    const domainInfo = {
      title: domainName,
      content: content,
      status: postStatus,
      author: userData.id,
      domain_industry: industryIds,
      domain_cat: categoryIds,
      domain_tag: tagIds,
      featured_media: parseInt(imageId),
    };
    const domaimMetaInfo = {
      _thumbnail_id: imageId,
      _age: saveDomainAge ? saveDomainAge : "",
      _length: domainLength,
      _da_pa: da_pa,
      _pronounce_audio: audioMediaId,
      _logo_image: imageId,
      _regular_price: formData.regular_price,
      _sale_price: formData.sale_price,
      _sale_price_dates_from: formData.start_date,
      _sale_price_dates_to: formData.end_date,
      _stock_status: "instock",
      _enable_offers: offer,
      _tld: getTLD(domainName),
      _lease_to_own: lease_to_own,
      _estimated_value: estimatedValue,
    };

    if (domain_id) {
      try {
        const res = await fetch(
          `${currentUrl}/wp-json/wp/v2/domain/${domain_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(domainInfo),
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        domainId = data.id;
      } catch (error) {
        setErrorMessage(error);
      }
      if (domainId) {
        try {
          const res = await fetch(
            `${currentUrl}/wp-json/wstr/v1/domain_meta/${domain_id}`,
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
          setSubmitLoading(false);
          setSuccessMessage("Domain Updated Successfully.");
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (!domain_id) {
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
        domainId = data.id;
        setDomainId(domainId);
      } catch (error) {
        setErrorMessage(error);
      }
      if (domainId) {
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
          setSubmitLoading(false);
          setSuccessMessage("Domain Added Successfully.");
        } catch (error) {
          console.log(error);
        }
      }
    }
    // if (postStatus == "edit_publish" || postStatus == "edit_draft") {
  }

  // ------------------------edit section starts

  useEffect(() => {
    if (domain_id) {
      setShowAddDomain(true);
      try {
        async function fetchDomainDetails() {
          const res = await fetch(
            `${currentUrl}/wp-json/wp/v2/domain/${domain_id}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setDomainName(data.title?.rendered);

          if (data?.meta?._sale_price[0]) {
            setIsSalePriceEnabled(!isSalePriceEnabled);
          }
          const lease_to_own = data?.meta?._lease_to_own
            ? data.meta._lease_to_own[0]
            : "";
          if (lease_to_own == 1) {
            setLeaseToOwnEnabled((prevState) => !prevState);
          }

          const _enable_offers = data?.meta?._enable_offers
            ? data.meta._enable_offers[0]
            : "";
          if (_enable_offers == "yes") {
            setAcceptOffersEnabled((prevState) => !prevState);
          }
          setFormData((prevFormData) => ({
            ...prevFormData,
            regular_price: data?.meta?._regular_price?.[0] || "",
            sale_price: data?.meta?._sale_price[0] || "",
            start_date: data?.meta?._sale_price_dates_from
              ? data.meta._sale_price_dates_from[0]
              : "",
            end_date: data?.meta?._sale_price_dates_to
              ? data.meta._sale_price_dates_to[0]
              : "",
          }));

          setDomainAge(ageToDecimal(data?.meta?._age ? data.meta._age[0] : ""));
          setSaveDomainAge(data?.meta?._age ? data.meta._age[0] : "");
          const da_pa = data?.meta?._da_pa ? data.meta._da_pa[0] : "";
          const da_pa_split = da_pa.toString().split("/");
          const da = parseInt(da_pa_split[0]);
          const pa = parseInt(da_pa_split[1]);
          setPageTrustScore(pa);
          setDomainTrustScore(da);

          const domain_length = data?.meta?._length ? data.meta._length[0] : "";
          setDomainLength(domain_length);

          const domain_description = data?.content?.rendered
            ? data.content.rendered
            : "";

          setContent(domain_description);

          const categories_array = [];
          const categories = data?.domain_cat ? data.domain_cat : "";
          categories.map((cat_id) => {
            return categories_array.push({
              id: cat_id,
              taxonomy: "domain_cat",
            });
          });

          setSelectedCategories(categories_array); // Set selected categories

          const industries_array = [];
          const industries = data?.domain_industry ? data.domain_industry : "";
          industries.map((ind_id) => {
            return industries_array.push({
              id: ind_id,
              taxonomy: "domain_industry",
            });
          });

          setSelectedIndustries(industries_array); // Set selected categories

          const tags_array = [];
          const tags = data?.domain_tag ? data.domain_tag : "";
          tags.map((tag_id) => {
            return tags_array.push({
              id: tag_id,
              taxonomy: "domain_industry",
            });
          });

          setSelectedTags(tags_array); // Set selected categories

          const audio_id = data?.meta?._pronounce_audio
            ? data.meta._pronounce_audio[0]
            : "";
          const thumbnail_id = data?.meta?._thumbnail_id
            ? data.meta._thumbnail_id[0]
            : "";
          setThumbnailId(thumbnail_id);
          setAudioId(audio_id);
          if (thumbnail_id) {
            // Set initial data including thumbnail and audio IDs

            try {
              const img_res = await fetch(
                `${currentUrl}/wp-json/wp/v2/media/${thumbnail_id}`
              );
              if (!img_res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              const img_data = await img_res.json();
              setSelectedImage(img_data.source_url);
            } catch (err) {
              console.log(err);
            }
          }
          if (audio_id) {
            try {
              const audio_res = await fetch(
                `${currentUrl}/wp-json/wp/v2/media/${audio_id}`
              );
              if (!audio_res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              const audio_data = await audio_res.json();

              // setAudioFile(audio_data.source_url);
            } catch (err) {
              console.log(err);
            }
          }

          const value_estimated = data?.meta?._estimated_value
            ? data.meta._estimated_value[0]
            : "";
          setEstimatedValue(value_estimated.toLocaleString());
        }
        fetchDomainDetails();
      } catch (error) {
        console.log(error);
      }
    }
  }, [domain_id]);

  let button_label = "Add Product";
  if (domain_id) {
    button_label = "Update Product";
  }
  //-------------------------edit section ends

  return (
    <>
      <div className={styles.add_domain_background_wrapper}>
        <div
          className={`${styles.add_domain_wrapper} ${styles.dashboard_section_margin}`}
        >
          <img src={addDomaintitleImage} alt="stars" />
          <h2>
            {" "}
            Add New <span>Domain</span>
          </h2>
          <p>
            Get a detailed domain breakdown, ranking insights, estimate, and
            even audio pronunciations – all in one go!
          </p>
          <div>{domainNameError && domainNameError}</div>
          <div
            className={`${styles.add_domain_generate_field} ${styles.p_relative}`}
          >
            <form onSubmit={handleGenerate} class="add_domain_form">
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                required
              />
              {/* <input type="submit" value="Generate" class="hover_white_dark">
              </input> */}
              <div
                className={`${styles.submit_container} ${styles.hover_white_dark} ${styles.animatedButton}`}
              >
                <input type="submit" value="Generate" />
                <GenerateStars />
              </div>
            </form>
          </div>
        </div>
      </div>
      {isLoading && (
        <div>
          <div className="loading_overlay">
            <FaSpinner className="loading" />
          </div>
        </div>
      )}
      {showAddDomain && (
        <form onSubmit={handelFormSubmit}>
          <div
            className={`${styles.add_domain_media_setup_wrapper} ${styles.dashboard_small_margin}`}
          >
            <div
              className={`${styles.add_domain_media_setup_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
              <MediaSetupIcon />
              <h4>Media Setup</h4>
            </div>
            <div
              className={`${styles.mediaSetupCardsWrapper} ${styles.ws_flex} ${styles.mob_fd_col}`}
            >
              {/* first card */}
              <div className={styles.media_content_wrapper}>
                {/* Conditionally render audio player or initial image */}
                {audioURL ? (
                  <div className={styles.audioWrapper}>
                    <audio
                      controls
                      className={styles.media_audio}
                      style={{
                        width: "100%",
                        height: "40px",
                      }}
                    >
                      <source
                        src={audioURL}
                        type={audioFile?.type || "audio/mpeg"}
                      />
                      Your browser does not support the audio element.
                    </audio>
                    {/* Remove Button */}
                    <button
                      onClick={handleRemoveAudio}
                      className={styles.removeAudioButton}
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        background: "#00d9f5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        padding: "3px",
                      }}
                    >
                      <RxCross2 />
                    </button>
                  </div>
                ) : (
                  <div className={styles.initial_image_wrapper}>
                    <img
                      src={attachAudioimg}
                      alt="attach audio"
                      className={styles.media_image}
                    />
                  </div>
                )}

                <div className={styles.media_setup_contents_footer}>
                  <div className={styles.text_column}>
                    <h5>{audioURL ? "Audio Uploaded" : "Attach My Audio"}</h5>
                    <p>
                      {audioURL
                        ? "Your uploaded audio is ready to play."
                        : "Let Your Voice Do The Talking!"}
                    </p>
                  </div>

                  <div className={styles.audio_column}>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioChange}
                      ref={audioInputRef} // Attach reference to input
                      className={styles.audio_input}
                    />
                  </div>
                </div>
              </div>
              {/* second card */}
              <div
                className={`${styles.media_content_wrapper} ${styles.media_setup_second_card}`}
              >
                {/* <div className={`${styles.pronounc_add} ${styles.active}`}>
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
                </div> */}

                <form className={styles.pronounce_add_form}>
                  {/* First Option */}
                  <div
                    className={`${styles.pronounc_add} ${
                      selected === "play" ? styles.active : ""
                    }`}
                    onClick={() => setSelected("play")}
                  >
                    <input
                      type="radio"
                      id="play"
                      name="selection"
                      value="play"
                      checked={selected === "play"}
                      onChange={() => setSelected("play")}
                      className={styles.hidden_radio} // Hidden using CSS
                    />
                    <label htmlFor="play">
                      <FaPlay />
                      <div>
                        <h5>James</h5>
                        <p>0.01</p>
                      </div>
                      <span>AI-PICK</span>
                      <img src={profileImage} alt="Profile" />
                      <RxCrossCircled />
                    </label>
                  </div>

                  {/* Second Option */}
                  <div
                    className={`${styles.pronounc_add} ${
                      selected === "pause" ? styles.active : ""
                    }`}
                    onClick={() => setSelected("pause")}
                  >
                    <input
                      type="radio"
                      id="pause"
                      name="selection"
                      value="pause"
                      checked={selected === "pause"}
                      onChange={() => setSelected("pause")}
                      className={styles.hidden_radio} // Hidden using CSS
                    />
                    <label htmlFor="pause">
                      <IoIosPause />
                      <div>
                        <h5>James</h5>
                        <p>0.01</p>
                      </div>
                      <span>AI-PICK</span>
                      <img src={profileImage} alt="Profile" />
                      <FiPlusCircle />
                    </label>
                  </div>
                </form>
                <div className={styles.media_setup_contents_footer}>
                  <div className={styles.text_column}>
                    <h5>Add Pronouniciation</h5>
                    <p>AI will Perfect it!</p>
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
                <div className={styles.renderedDomainText}>
                  {/* <h4>Arpan.com</h4> */}
                  <h4>{domainName}</h4>
                </div>
                {/* <img
                  src={selectedImage || domain_img}
                  alt="attach logo image"
                  className={styles.media_image}
                /> */}
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

                  <a href="/services">Get Started</a>
                </div>
              </div>
            </div>
          </div>
          {/* Domain Appraisal */}
          <div
            className={`${styles.dashboard_domain_setup_wrapper} ${styles.ws_flex} ${styles.mob_fd_col}`}
          >
            <div className={styles.domain_appraisal_wrapper}>
              <div
                className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
              >
                {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
                <div className={styles.small_svg}>
                  <DomainAppraisalIcon />
                </div>
                <h4>Domain Appraisal</h4>
                <IoMdInformationCircle />
              </div>
              <div className={styles.domain_appraisal_inner_wrapper}>
                <div
                  className={`${styles.domain_appraisal_inner_wrapper_heading} ${styles.ws_flex} ${styles.mob_fd_col} ${styles.mob_card_padding_30}`}
                >
                  <div>
                    <h2>{domainName ? domainName : "example.com"}</h2>
                    <h5>Estimated Value</h5>
                    <h3>
                      ${estimated_value && estimated_value}
                      &nbsp;
                      <span>USD</span>
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
                <div
                  className={`${styles.domain_appraisal_body_wrapper} ${styles.mob_card_padding_20}`}
                >
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
                className={`${styles.price_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10} ${styles.add_domain_domain_appraisal_tile_wrapper}`}
              >
                {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
                <div className={styles.small_svg}>
                  <PricingSetupIcon />
                </div>
                <h4>Pricing Setup</h4>
                <IoMdInformationCircle />
              </div>

              {/* Regular Price Input */}
              <div
                className={`${styles.input_group} ${styles.ws_flex} ${styles.flex_column} ${styles.gap_10}`}
              >
                <label htmlFor="regularPrice">
                  Regular Price<sup className="required">*</sup>
                </label>
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
                        setFormData({
                          ...formData,
                          start_date: e.target.value,
                        })
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
                  <h5>Lease-To-Own</h5>
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
                  <h5>Accept Offers</h5>
                  <p className={styles.subtitle}>Let Buyers Name Their Price</p>
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
            className={`${styles.cardSelectorWrapper} ${styles.dashboard_small_margin} ${styles.mob_card_padding_30}`}
          >
            <div
              className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
              <CategoriesIcon />
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
                generateTaxonomies={generateTaxonomies}
              />
            )}
          </div>
          {/* domain description */}
          <div
            className={`${styles.cardSelectorWrapper} ${styles.dashboard_small_margin} ${styles.domain_description_wrapper} domain_description_wrapper`}
          >
            <div
              className={`${styles.ws_flex} ${styles.justify_space_between} ${styles.ai_cente} ${styles.domain_description_titles} ${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.f_wrap}`}
            >
              <h4
                className={`${styles.ws_flex} ${styles.gap_10} ${styles.ai_center} ${styles.domain_description_titles} ${styles.add_domain_domain_appraisal_tile_wrapper}`}
              >
                <DomainDescIcon />
                Domain Description <sup className="required">*</sup>
              </h4>
              <a
                href=""
                className={`${styles.starsWhite} ${styles.gradient_hover} ${styles.animatedButton}`}
                onClick={(e) => handelDomainDesc(e)}
              >
                <img
                  src={starswhite}
                  alt="Star Icon"
                  className={styles.starsWhiteIcon}
                />
                Ask AI
              </a>
            </div>
            {descLoading && (
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>
            )}

            <div className={styles.dashboard_small_margin}>
              {/* <CKEditor
                editor={ClassicEditor}
                // Log or handle the editor dat
              /> */}
              <CKEditor
                editor={ClassicEditor}
                data={content ? content : ""}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline", // Underline
                    "|",
                    "alignment", // Text alignment
                    "bulletedList",
                    "numberedList",
                    "|",
                    "link",
                    "imageUpload", // Image upload
                    "blockQuote",
                    "insertTable",
                    "|",
                    "undo",
                    "redo",
                  ],
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                    ],
                  },
                  alignment: {
                    options: ["left", "center", "right", "justify"], // Alignment options
                  },
                  image: {
                    toolbar: [
                      "imageTextAlternative",
                      "imageStyle:full",
                      "imageStyle:side",
                    ],
                  },
                  ckfinder: {
                    // Image upload backend endpoint
                    uploadUrl: "/your-upload-endpoint", // Replace with your server URL
                  },
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                }}
              />
            </div>
            <div
              className={`${cardstyles.tags_card_title_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
              <TagsIcon />
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
                  generateTaxonomies={generateTaxonomies}
                />
              )}
            </div>
          </div>
          {/* industries */}
          <div
            className={`${styles.cardSelectorWrapper} ${cardstyles.cardSelectorIndustriesWrapper}`}
          >
            <div
              className={`${styles.add_domain_domain_appraisal_tile_wrapper} ${styles.ws_flex} ${styles.ai_center} ${styles.gap_10}`}
            >
              {/* <img src={mediaSetupIcon} alt="Media Setup Icon" /> */}
              <IndustriesIcon />
              <h4>
                Industries<sup className="required">*</sup>
              </h4>
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
                generateTaxonomies={generateTaxonomies}
                type="industry"
              />
            )}
          </div>
          {errorMessage && (
            <div className={styles.error_message}>{errorMessage}</div>
          )}
          {successMessage && (
            <div className={styles.success_message}>{successMessage}</div>
          )}
          {submitLoading && (
            <div className={styles.loading_message}>
              {/* Saving...</div> */}
              <div className="loading_overlay">
                <FaSpinner className="loading" />
              </div>{" "}
            </div>
          )}
          <div className={styles.save_button_wrappers}>
            <button
              onClick={() => setPostStatus("publish")}
              className={`${styles.add_product_button} ${styles.hover_white_dark} ${styles.animatedButton}`}
            >
              <span className={styles.icon}>
                {/* <img src={add_product_icon} alt="Add Product Icon" /> */}
                <AddProductIcon />
              </span>
              <span>{button_label}</span>
            </button>

            <button
              onClick={() => setPostStatus("draft")}
              className={`${styles.save_draft_button} ${styles.hover_white} ${styles.animatedButton}`}
            >
              <span className={styles.icon}>
                {/* <img src={save_draft_icon} alt="Save Draft Icon" /> */}
                <SaveDraftIcon />
              </span>
              <span>Save Draft</span>
            </button>
          </div>
        </form>
      )}
    </>
  );
}
