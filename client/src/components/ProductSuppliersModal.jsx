import React from 'react';
import { X, Building2, MapPin, Phone, MessageSquare, ExternalLink, Send, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { getSuppliersForProduct, getProductSupplierDirectUrl } from '../services/api';

export default function ProductSuppliersModal({ product, onClose, onSelectSupplierToQuote }) {
  if (!product) return null;

  const suppliers = getSuppliersForProduct(product);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>
              <Building2 size={22} color="#F97316" />
              <span>Fornecedores Diretos: {product.name}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              {suppliers.length} {suppliers.length === 1 ? 'fornecedor cadastrado com link direto para o produto' : 'fornecedores cadastrados com links diretos para o produto'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-product-summary" style={{ marginBottom: '18px' }}>
            <div className="modal-summary-title">{product.name}</div>
            <div className="modal-summary-subtitle">{product.subsystem} • {product.technicalName}</div>
            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
              <strong>Especificação Padrão:</strong> {product.specification} ({product.estimatedQty})
            </div>
          </div>

          <div className="suppliers-grid">
            {suppliers.map((sup, idx) => {
              const directProductUrl = getProductSupplierDirectUrl(product, sup.name);

              const whatsappMsg = encodeURIComponent(
                `Olá, equipe da ${sup.name}! Gostaria de solicitar especificações e orçamento para o item "${product.name}" (${product.estimatedQty}) encontrado através do marketplace ERUS Solar.`
              );

              return (
                <div key={sup.id || idx} className="supplier-item-card">
                  <div className="supplier-card-top">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 className="supplier-name">{sup.name}</h4>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#16A34A', fontSize: '0.72rem', fontWeight: 700 }}>
                          <ShieldCheck size={14} /> Homologado
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                        <MapPin size={13} color="#F97316" />
                        <span>{sup.location}</span>
                      </div>
                    </div>
                    <span className="supplier-region-badge">{sup.region}</span>
                  </div>

                  {/* Direct Product Link Highlight */}
                  {directProductUrl && (
                    <div style={{ margin: '8px 0 4px' }}>
                      <a
                        href={directProductUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-product-direct-link"
                        title={`Ir direto para a página e ficha técnica deste item no catálogo da ${sup.name}`}
                      >
                        <ExternalLink size={15} />
                        <span>Acessar {product.name} no Catálogo da {sup.name} ↗</span>
                      </a>
                    </div>
                  )}

                  <div className="supplier-contact-row" style={{ marginTop: '8px' }}>
                    {sup.whatsapp && (
                      <a
                        href={`https://wa.me/${sup.whatsapp.replace(/\D/g, '')}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link whatsapp-link"
                      >
                        <MessageSquare size={14} />
                        <span>WhatsApp Direto</span>
                      </a>
                    )}

                    {sup.phone && (
                      <a href={`tel:${sup.phone}`} className="contact-link">
                        <Phone size={14} color="#0284C7" />
                        <span>{sup.phone}</span>
                      </a>
                    )}
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      className="card-action-btn"
                      style={{ padding: '9px 16px', fontSize: '0.84rem', width: 'auto' }}
                      onClick={() => {
                        onClose();
                        onSelectSupplierToQuote(product, sup.name);
                      }}
                    >
                      <Send size={14} />
                      <span>Solicitar Cotação c/ {sup.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
