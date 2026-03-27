import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import eventBus from 'shared/eventBus';

const ProductGrid = lazy(() => import('mfeProduct/./ProductGrid'));
const Cart = lazy(() => import('mfeCart/./Lobby'));
const Recommendations = lazy(() =>
    import('mfeReco/./Recommendations').catch((err) => {
        console.error("MFE Recommendations indisponible:", err);
        return new Promise(() => {});
    })
);
function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.on('CART_UPDATED', (items) => {
      setCartCount(items.length);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          <Suspense fallback={<LoadingFallback name="Products" />}>
            <ProductGrid />
          </Suspense>
        </section>
        <aside className="cart-area">
          <Suspense fallback={<LoadingFallback name="Cart" />}>
            <Cart />
          </Suspense>
        </aside>
      </main>
      <section className="reco-area">
        <Suspense fallback={<LoadingFallback name="Recommendations" />}>
          <Recommendations />
        </Suspense>
      </section>
    </div>
  );
}

export default App;
