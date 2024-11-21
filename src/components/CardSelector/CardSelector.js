// Components/CardSelector/CardSelector.js
import React, { useEffect, useState } from "react";
import styles from "./CardSelector.module.css"; // Create styles for the card selector
import tabstyles from "../Tabs/Tabs.module.css";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";

const CardSelector = ({ items, selectedItems, setSelectedItems }) => {
  // const [selectedItems, setSelectedItems] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const toggleSelect = (item) => {
    // if (selectedItems.includes(item)) {
    //   setSelectedItems(selectedItems.filter((i) => i !== item));
    // } else {
    //   setSelectedItems([...selectedItems, item]); // for passing whole item data
    //   // setSelectedItems([...selectedItems, item.id]); // for only
    // }
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]); // for passing whole item data
    }
    console.log(item);
    // console.log(selectedItems);
  };
  // const obj = {
  //   // coun: 94,
  //   // description: "",
  //   id: 59,
  //   // link: "http://webstarter.local/domain-cat/curated-names-for-startups/",
  //   // name: "Catchy Names",
  //   // parent: 0,
  //   // slug: "curated-names-for-startups",
  //   taxonomy: "domain_cat",
  // };

  // useEffect(() => {
  //   setSelectedItems((prevSelectedItems) => [...prevSelectedItems, obj]);
  // }, [setSelectedItems]);
  // // toggleSelect(obj);

  // setSelectedItems(obj);
  const fetchImageUrl = async (imageId) => {
    try {
      const response = await fetch(`/wp-json/wp/v2/media/${imageId}`);
      const data = await response.json();
      return data.source_url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    items.forEach(async (item) => {
      if (item.meta && item.meta.taxonomy_image_id) {
        const url = await fetchImageUrl(item.meta.taxonomy_image_id);
        setImageUrls((prevUrls) => ({
          ...prevUrls,
          [item.meta.taxonomy_image_id]: url,
        }));
      }
    });
  }, [items]);

  return (
    <div className={styles.cardSelectorWrapper}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.card} ${!item.meta?.taxonomy_image_id &&
              !imageUrls[item.meta?.taxonomy_image_id]
              ? styles.tagsItemsCards
              : ""
            }
          ${selectedItems.some((selectedItem) => selectedItem.id === item.id)
              ? styles.selected
              : ""
            }`}
          //  ${selectedItems.includes(item) ? styles.selected : ""}`}
          onClick={() => toggleSelect(item)}
        >
          <div className={` ${styles.cardContent} ${tabstyles.flex_column}`}>
            {/* Conditionally render for tagsItems */}
            {!item.meta?.taxonomy_image_id &&
              !imageUrls[item.meta?.taxonomy_image_id] ? (
              <>
                <div className={styles.cardSelector_aiPicks}>
                  <RxCross2 />
                  <GoPlus />
                </div>
                <h5>{item.name}</h5>
                <span>{item.subtitle}AI PICK</span>
              </>
            ) : (
              <>
                <h5>{item.name}</h5>
                <div className={styles.cardSelector_aiPicks}>
                  <span>{item.subtitle}</span>
                  <RxCross2 />
                  <GoPlus />
                </div>
              </>
            )}
          </div>

          {/* Conditionally render the icon only if item.icon exists */}
          {/* {item.icon && (
            <div className={styles.icon}>
              <img src={item.icon} alt={`${item.title} icon`} />
            </div>
          )} */}
          {item.meta?.taxonomy_image_id &&
            imageUrls[item.meta?.taxonomy_image_id] && (
              <div className={styles.icon}>
                <img
                  src={imageUrls[item.meta?.taxonomy_image_id]}
                  alt={`${item.name}`}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default CardSelector;
