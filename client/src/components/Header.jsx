import React from 'react';
import { Sun, Search, X, Building2, FileText } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onOpenSuppliers,
  onOpenQuotes,
  quotesCount
}) {
  return (
    <header className="erus-header">
      <div className="header-top">
        <div className="logo-container" onClick={() => setSearchTerm('')}>
          <div className="logo-icon-wrap">
            <Sun size={26} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div className="logo-text">
            <h1>
              ERUS <span className="logo-badge">SOLAR MARKET</span>
            </h1>
            <span className="logo-subtitle">B2B Tracker Hub & Suprimentos</span>
          </div>
        </div>

        <div className="header-search">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              placeholder="Buscar tubos de torque, atuadores, módulos bifaciais, sensores TCU..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn-header-secondary"
            onClick={onOpenSuppliers}
            title="Ver catálogo de fabricantes e distribuidores"
          >
            <Building2 size={18} />
            <span>Fornecedores (12)</span>
          </button>

          <button
            className="btn-header-primary"
            onClick={onOpenQuotes}
            title="Ver histórico de solicitações de orçamento"
          >
            <FileText size={18} />
            <span>Meus Orçamentos</span>
            {quotesCount > 0 && (
              <span className="quote-count-pill">{quotesCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="header-subnav">
        <div className="subnav-container">
          <div className="subnav-highlights">
            <div className="subnav-item">
              <span>Projeto de Referência:</span>
              <strong>Solar Tracker 10kW Monoeixo</strong>
            </div>
            <div className="subnav-item">
              <span>Parceiros:</span>
              <strong>Ceará, Nacional & Global</strong>
            </div>
            <div className="subnav-item">
              <span>Cotação B2B:</span>
              <strong>Direto com Fabricantes Cadastrados</strong>
            </div>
          </div>
          <div
            className="subnav-link"
            onClick={onOpenSuppliers}
          >
            Consultar Fabricantes Homologados →
          </div>
        </div>
      </div>
    </header>
  );
}
