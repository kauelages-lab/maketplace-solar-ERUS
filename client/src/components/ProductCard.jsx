import React from 'react';
import ProductIllustration from './ProductIllustration';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ProductCard({ product, onRequestQuote }) {
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
          <div className="suppliers-label">Fornecedores Homologados:</div>
          <div className="supplier-tags-list">
            {product.suppliers.map((sup, idx) => (
              <span key={idx} className="supplier-tag">
                {sup}
              </span>
            ))}
          </div>
        </div>

        <button
          className="card-action-btn"
          onClick={() => onRequestQuote(product)}
        >
          <Send size={15} />
          <span>Solicitar Orçamento</span>
        </button>
      </div>
    </div>
  );
}
