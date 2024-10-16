// Components/CardSelector/CardSelector.js
import React, { useState } from 'react';
import styles from './CardSelector.module.css'; // Create styles for the card selector
import tabstyles from '../Tabs/Tabs.module.css';
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";

const CardSelector = ({ items }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelect = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <div className={styles.cardSelectorWrapper}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${selectedItems.includes(item) ? styles.selected : ''}`}
                    onClick={() => toggleSelect(item)}
                >
                    <div className={` ${styles.cardContent} ${tabstyles.flex_column}`}>
                        <h5>{item.title}</h5>
                        <div className={styles.cardSelector_aiPicks}>
                            <span>{item.subtitle}</span>
                            <RxCross2 />
                            <GoPlus />

                        </div>
                    </div>
                    <div className={styles.icon}>
                        <img src={item.icon} alt={`${item.title} icon`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardSelector;
