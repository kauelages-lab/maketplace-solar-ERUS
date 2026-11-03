import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import QuoteModal from './components/QuoteModal';
import QuotesDrawer from './components/QuotesDrawer';
import SuppliersModal from './components/SuppliersModal';
import Footer from './components/Footer';
import { PackageSearch, Filter } from 'lucide-react';
import { fetchSubsystems, fetchSuppliers, fetchProducts, getStoredQuotes } from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('Todos');

  const [quoteModalProduct, setQuoteModalProduct] = useState(null);
  const [isQuotesDrawerOpen, setIsQuotesDrawerOpen] = useState(false);
  const [isSuppliersModalOpen, setIsSuppliersModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Initial data load
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [subsData, supsData] = await Promise.all([
          fetchSubsystems(),
          fetchSuppliers()
        ]);

        setCategories(subsData || []);
        setSuppliers(supsData || []);
        setQuotes(getStoredQuotes());
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Fetch / filter products
  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        const list = await fetchProducts({
          search: searchTerm,
          subsystem: selectedCategory,
          supplier: selectedSupplier
        });
        setProducts(list || []);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    }

    loadFilteredProducts();
  }, [searchTerm, selectedCategory, selectedSupplier]);

  const handleQuoteSuccess = (newQuote) => {
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const handleOpenGeneralQuote = () => {
    setQuoteModalProduct({
      id: null,
      name: 'Kit Completo Solar Tracker 10kW (BOM)',
      subsystem: 'Estrutura Completa',
      technicalName: 'Bill of Materials / Turnkey Kit',
      specification: 'Conjunto completo de mecânica, atuadores, TCU e módulos para arranjo 10kW',
      estimatedQty: '1 usina / arranjo',
      suppliers: ['PLP do Brasil', 'WEG Equipamentos Elétricos', 'Sou Energy', 'Array Technologies Brasil']
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedSupplier('Todos');
  };

  return (
    <div className="app-container">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenSuppliers={() => setIsSuppliersModalOpen(true)}
        onOpenQuotes={() => setIsQuotesDrawerOpen(true)}
        quotesCount={quotes.length}
      />

      <HeroBanner onQuickQuote={handleOpenGeneralQuote} />

      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalItems={19}
      />

      <main className="main-content">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">
              {selectedCategory === 'Todos' ? 'Catálogo de Peças Homologadas' : selectedCategory}
            </h2>
            <span className="section-counter">
              {products.length} {products.length === 1 ? 'componente disponível' : 'componentes disponíveis'}
            </span>
          </div>

          <div className="filter-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748B' }}>
              <Filter size={15} />
              <span>Fabricante:</span>
            </div>
            <select
              className="custom-select"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="Todos">Todos os Fabricantes</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <PackageSearch className="empty-state-icon" />
            <h3>Nenhum componente encontrado</h3>
            <p>
              Não localizamos nenhuma peça correspondente aos filtros ou ao termo "{searchTerm}".
            </p>
            <button className="empty-reset-btn" onClick={handleResetFilters}>
              Limpar Filtros e Ver Todos
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRequestQuote={(prod) => setQuoteModalProduct(prod)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Modals & Drawers */}
      {quoteModalProduct && (
        <QuoteModal
          product={quoteModalProduct}
          onClose={() => setQuoteModalProduct(null)}
          onQuoteSuccess={handleQuoteSuccess}
        />
      )}

      <QuotesDrawer
        isOpen={isQuotesDrawerOpen}
        onClose={() => setIsQuotesDrawerOpen(false)}
        quotes={quotes}
        onNewQuoteClick={handleOpenGeneralQuote}
      />

      <SuppliersModal
        isOpen={isSuppliersModalOpen}
        onClose={() => setIsSuppliersModalOpen(false)}
        suppliers={suppliers}
      />
    </div>
  );
}
