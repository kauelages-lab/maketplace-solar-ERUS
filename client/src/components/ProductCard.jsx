import React from 'react';
import ProductIllustration from './ProductIllustration';
import { Send, Building2 } from 'lucide-react';

export default function ProductCard({ product, onRequestQuote, onViewSuppliers }) {
  return (
    <div className="product-card">
      <div className="card-image-area">
        <span className="subsystem-tag">{product.subsystem}</span>
        <span className="qty-badge" title="Quantidade estimada para arranjo padrão de 10kW">
          Qtde: {product.estimatedQty}
        </span>
        <ProductIllustration type={product.iconType} />
      </div>

      <div className="card-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-technical">{product.technicalName}</p>

        <p className="product-function" title={product.function}>
          {product.function}
        </p>

        <div className="product-spec-box">
          <strong>Especificação Técnica:</strong>
          {product.specification}
        </div>

        <div className="card-suppliers">
          <div className="card-suppliers-header">
            <span className="suppliers-label">Fornecedores ({product.suppliers.length}):</span>
            <button
              className="btn-compare-suppliers"
              onClick={() => onViewSuppliers && onViewSuppliers(product)}
              title="Comparar fornecedores e contatos diretos deste item"
            >
              <Building2 size={12} />
              <span>Ver todos ({product.suppliers.length})</span>
            </button>
          </div>

          <div className="supplier-tags-list">
            {product.suppliers.slice(0, 4).map((sup, idx) => (
              <span
                key={idx}
                className="supplier-tag"
                onClick={() => onViewSuppliers && onViewSuppliers(product)}
                style={{ cursor: 'pointer' }}
                title="Clique para ver contatos deste fornecedor"
              >
                {sup}
              </span>
            ))}
            {product.suppliers.length > 4 && (
              <span
                className="supplier-tag-more"
                onClick={() => onViewSuppliers && onViewSuppliers(product)}
                style={{ cursor: 'pointer' }}
              >
                +{product.suppliers.length - 4} mais
              </span>
            )}
          </div>
        </div>

        <div className="card-actions-row">
          <button
            className="card-action-btn"
            onClick={() => onRequestQuote(product)}
          >
            <Send size={15} />
            <span>Solicitar Orçamento</span>
          </button>
        </div>
      </div>
    </div>
  );
}
