import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
    const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const handleProductAdded = (product) => {
            setCartItems((prev) => {
                if (prev.find((p) => p.id === product.id)) return prev;
                return [...prev, product];
            });
        };

        eventBus.on('PRODUCT_ADDED', handleProductAdded);
        return () => eventBus.off('PRODUCT_ADDED', handleProductAdded);
    }, []);

    useEffect(() => {
        if (cartItems.length === 0) {
            setRecos(PRODUCTS.slice(0, 3));
            return;
        }

        const cartIds = new Set(cartItems.map((p) => p.id));
        const cartCategories = new Set(cartItems.map((p) => p.category));

        const available = PRODUCTS.filter((p) => !cartIds.has(p.id));

        const complementary = available.filter((p) => cartCategories.has(p.category));
        const others = available.filter((p) => !cartCategories.has(p.category));

        setRecos([...complementary, ...others].slice(0, 3));
    }, [cartItems]);

    const handleAddReco = (product) => {
        eventBus.emit('PRODUCT_ADDED', product);
    };

    return (
        <div className="recommendations">
            <h2>Les joueurs achetent aussi</h2>
            <div className="reco-list">
                {recos.map((p) => (
                    <div key={p.id} className="reco-card" onClick={() => handleAddReco(p)}>
                        <div className="reco-image" data-category={p.category}>{p.category}</div>
                        <span className="reco-name">{p.name}</span>
                        <span className="reco-price">{p.price} EUR</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recommendations;
