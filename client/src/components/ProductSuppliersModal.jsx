import React from 'react';
import { X, Building2, MapPin, Phone, MessageSquare, Globe, Send, ShieldCheck } from 'lucide-react';
import { getSuppliersForProduct } from '../services/api';

export default function ProductSuppliersModal({ product, onClose, onSelectSupplierToQuote }) {
  if (!product) return null;

  const suppliers = getSuppliersForProduct(product);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>
              <Building2 size={22} color="#F97316" />
              <span>Fornecedores para: {product.name}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              {suppliers.length} {suppliers.length === 1 ? 'empresa homologada disponível' : 'empresas homologadas disponíveis'} para este item
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-product-summary" style={{ marginBottom: '16px' }}>
            <div className="modal-summary-title">{product.name}</div>
            <div className="modal-summary-subtitle">{product.subsystem} • {product.technicalName}</div>
            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
              <strong>Especificação Padrão:</strong> {product.specification} ({product.estimatedQty})
            </div>
          </div>

          <div className="suppliers-grid">
            {suppliers.map((sup, idx) => {
              const whatsappMsg = encodeURIComponent(
                `Olá, ${sup.name}! Gostaria de solicitar um orçamento para o item "${product.name}" (${product.estimatedQty}) através do marketplace ERUS Solar.`
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

                    {sup.website && (
                      <a
                        href={sup.website.startsWith('http') ? sup.website : `https://${sup.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        <Globe size={14} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="card-action-btn"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', width: 'auto' }}
                      onClick={() => {
                        onClose();
                        onSelectSupplierToQuote(product, sup.name);
                      }}
                    >
                      <Send size={14} />
                      <span>Solicitar Orçamento c/ {sup.name}</span>
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
