// Components/CardSelector/CardSelector.js
import React, { useEffect, useState } from "react";
import styles from "./CardSelector.module.css"; // Create styles for the card selector
import tabstyles from "../Tabs/Tabs.module.css";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";

const CardSelector = ({
  items,
  selectedItems,
  setSelectedItems,
  generateTaxonomies,
  type,
}) => {
  const [imageUrls, setImageUrls] = useState({});

  const toggleSelect = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]); // for passing whole item data
    }
  };

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
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className={`${styles.card} ${
              !item.meta?.taxonomy_image_id &&
              !imageUrls[item.meta?.taxonomy_image_id]
                ? styles.tagsItemsCards
                : ""
            }
          ${
            selectedItems.some((selectedItem) => selectedItem.id === item.id)
              ? styles.selected
              : ""
          }`}
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
                  <h5>{item.name.replace("&amp;", "&")}</h5>
                  {generateTaxonomies &&
                    generateTaxonomies.includes(item.id) &&
                    selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    ) && <span>Ai-Pick</span>}
                </>
              ) : (
                <>
                  <h5>{item.name.replace("&amp;", "&")}</h5>
                  <div className={styles.cardSelector_aiPicks}>
                    {generateTaxonomies &&
                      generateTaxonomies.includes(item.id) &&
                      selectedItems.some(
                        (selectedItem) => selectedItem.id === item.id
                      ) && <span>Ai-Pick</span>}

                    <RxCross2 />
                    <GoPlus />
                  </div>
                </>
              )}
            </div>

            {/* Conditionally render the icon only if item.icon exists */}
            {/* {item.meta?.taxonomy_image_id &&
              imageUrls[item.meta?.taxonomy_image_id] && (
                <div className={styles.icon}>
                  <img
                    src={imageUrls[item.meta?.taxonomy_image_id]}
                    alt={`${item.name}`}
                  />
                </div>
              )} */}
          </div>
        );
      })}
    </div>
  );
};

export default CardSelector;
