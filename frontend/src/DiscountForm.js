import React from 'react';
import './DiscountForm.css';

const DiscountForm = ({ discountBeforeSix, tuesdayDiscount, handleApplyDiscounts, setDiscountBeforeSix, setTuesdayDiscount }) => {
    return (
        <div className="section configure-discounts">
            <h2>Configure Discount Prices</h2>
            <form onSubmit={handleApplyDiscounts}>
                <div className="input-group">
                    <label>
                        Discount before 6 PM (%):
                        <input type="number" value={discountBeforeSix} onChange={(e) => setDiscountBeforeSix(e.target.value)} />
                    </label>
                </div>
                <div className="input-group">
                    <label>
                        Tuesday Discount (%):
                        <input type="number" value={tuesdayDiscount} onChange={(e) => setTuesdayDiscount(e.target.value)} />
                    </label>
                </div>
                <button type="submit">Apply Discounts</button>
            </form>
        </div>
    );
};

export default DiscountForm;
