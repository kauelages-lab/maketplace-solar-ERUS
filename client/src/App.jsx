import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductSuppliersModal from './components/ProductSuppliersModal';
import QuoteModal from './components/QuoteModal';
import QuotesDrawer from './components/QuotesDrawer';
import SuppliersModal from './components/SuppliersModal';
import Footer from './components/Footer';
import { PackageSearch, Filter, Building2, Package, MapPin, MessageSquare, Phone, Globe, Send, ShieldCheck } from 'lucide-react';
import {
  fetchSubsystems,
  fetchSuppliers,
  fetchProducts,
  getStoredQuotes,
  cancelStoredQuote,
  deleteStoredQuote,
  findSuppliersBySearch
} from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('Todos');

  // View mode: 'products' | 'suppliers'
  const [viewMode, setViewMode] = useState('products');

  // Modals & Drawers state
  const [quoteModalProduct, setQuoteModalProduct] = useState(null);
  const [suppliersModalProduct, setSuppliersModalProduct] = useState(null);
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

  // Compute matched suppliers based on current search and products
  const matchedSuppliers = findSuppliersBySearch(searchTerm, products);

  const handleQuoteSuccess = (newQuote) => {
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const handleCancelQuote = (protocol) => {
    const updated = cancelStoredQuote(protocol);
    setQuotes(updated);
  };

  const handleDeleteQuote = (protocol) => {
    const updated = deleteStoredQuote(protocol);
    setQuotes(updated);
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

  const handleOpenSupplierQuote = (supplierName) => {
    setQuoteModalProduct({
      id: null,
      name: searchTerm ? `Itens de ${searchTerm} (${supplierName})` : `Cotação c/ ${supplierName}`,
      subsystem: 'Múltiplos Componentes',
      technicalName: 'Cotação Direta com Fornecedor',
      specification: 'Demanda de componentes e suprimentos para rastreador solar',
      estimatedQty: 'Conforme projeto',
      suppliers: [supplierName]
    });
  };

  const handleSelectSupplierForProduct = (product, supplierName) => {
    setQuoteModalProduct({
      ...product,
      suppliers: [supplierName, ...product.suppliers.filter(s => s !== supplierName)]
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedSupplier('Todos');
    setViewMode('products');
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
              {searchTerm ? `Resultados para "${searchTerm}"` : (selectedCategory === 'Todos' ? 'Catálogo de Suprimentos Tracker' : selectedCategory)}
            </h2>

            {/* Toggle view tabs */}
            <div className="view-mode-tabs">
              <button
                className={`view-mode-tab ${viewMode === 'products' ? 'active' : ''}`}
                onClick={() => setViewMode('products')}
              >
                <Package size={15} />
                <span>Peças ({products.length})</span>
              </button>

              <button
                className={`view-mode-tab ${viewMode === 'suppliers' ? 'active' : ''}`}
                onClick={() => setViewMode('suppliers')}
              >
                <Building2 size={15} />
                <span>Fornecedores Disponíveis ({matchedSuppliers.length})</span>
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748B' }}>
              <Filter size={15} />
              <span>Filtrar por Empresa:</span>
            </div>
            <select
              className="custom-select"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="Todos">Todas as Empresas</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display based on viewMode */}
        {viewMode === 'products' ? (
          products.length === 0 ? (
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
                  onViewSuppliers={(prod) => setSuppliersModalProduct(prod)}
                />
              ))}
            </div>
          )
        ) : (
          matchedSuppliers.length === 0 ? (
            <div className="empty-state">
              <Building2 className="empty-state-icon" />
              <h3>Nenhum fornecedor encontrado</h3>
              <p>Não há empresas cadastradas que correspondam ao termo "{searchTerm}".</p>
              <button className="empty-reset-btn" onClick={handleResetFilters}>
                Ver Todos os Fornecedores
              </button>
            </div>
          ) : (
            <div className="suppliers-search-grid">
              {matchedSuppliers.map((sup) => {
                const whatsappMsg = encodeURIComponent(
                  `Olá, ${sup.name}! Vi seu catálogo no marketplace ERUS Solar${searchTerm ? ` buscando por "${searchTerm}"` : ''} e gostaria de cotar componentes para Solar Tracker.`
                );

                return (
                  <div key={sup.id} className="supplier-search-card">
                    <div className="supplier-search-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 className="supplier-search-name">{sup.name}</h3>
                          <span className="badge-verified">
                            <ShieldCheck size={14} /> Homologado
                          </span>
                        </div>
                        <div className="supplier-search-location">
                          <MapPin size={13} color="#F97316" />
                          <span>{sup.location}</span>
                        </div>
                      </div>
                      <span className="supplier-region-badge">{sup.region}</span>
                    </div>

                    <div className="supplier-search-categories">
                      <div className="cat-label">Linhas Fornecidas:</div>
                      <div className="supplier-tags-list">
                        {sup.categories.map((c, i) => (
                          <span key={i} className="supplier-tag">{c}</span>
                        ))}
                      </div>
                    </div>

                    <div className="supplier-contact-row">
                      {sup.whatsapp && (
                        <a
                          href={`https://wa.me/${sup.whatsapp.replace(/\D/g, '')}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link whatsapp-link"
                        >
                          <MessageSquare size={15} />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {sup.phone && (
                        <a href={`tel:${sup.phone}`} className="contact-link">
                          <Phone size={14} color="#0284C7" />
                          <span>{sup.phone}</span>
                        </a>
                      )}

                      {sup.website && (
                        <a
                          href={sup.website.startsWith('http') ? sup.website : `https://${sup.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link"
                        >
                          <Globe size={14} />
                          <span>Site Oficial</span>
                        </a>
                      )}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <button
                        className="card-action-btn"
                        onClick={() => handleOpenSupplierQuote(sup.name)}
                      >
                        <Send size={15} />
                        <span>Solicitar Cotação com {sup.name}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      <Footer />

      {/* Modals & Drawers */}
      {suppliersModalProduct && (
        <ProductSuppliersModal
          product={suppliersModalProduct}
          onClose={() => setSuppliersModalProduct(null)}
          onSelectSupplierToQuote={handleSelectSupplierForProduct}
        />
      )}

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
        onCancelQuote={handleCancelQuote}
        onDeleteQuote={handleDeleteQuote}
      />

      <SuppliersModal
        isOpen={isSuppliersModalOpen}
        onClose={() => setIsSuppliersModalOpen(false)}
        suppliers={suppliers}
      />
    </div>
  );
}
