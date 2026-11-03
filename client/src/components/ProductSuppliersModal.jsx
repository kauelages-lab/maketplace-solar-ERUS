import React from 'react';
import { X, Building2, MapPin, Phone, MessageSquare, ExternalLink, Send, ShieldCheck, Search, FileText } from 'lucide-react';
import { getSuppliersForProduct, getProductSupplierDirectUrl, getProductDatasheetSearchUrl } from '../services/api';

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
              <span>Fornecedores para: {product.name}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              {suppliers.length} {suppliers.length === 1 ? 'empresa cadastrada com links diretos e canais de contato' : 'empresas cadastradas com links diretos e canais de contato'}
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
              const datasheetUrl = getProductDatasheetSearchUrl(product, sup.name);

              const whatsappMsg = encodeURIComponent(
                `Olá, equipe da ${sup.name}! Gostaria de solicitar especificações técnicas e cotação para o item "${product.name}" (${product.estimatedQty}) através do marketplace ERUS Solar.`
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

                  {/* Direct Product and Datasheet Action Links */}
                  <div className="supplier-links-group" style={{ margin: '10px 0 6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {directProductUrl && (
                      <a
                        href={directProductUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-product-direct-link"
                        title={`Acessar página oficial do produto ou catálogo na ${sup.name}`}
                      >
                        <ExternalLink size={15} />
                        <span>Ver Peça no Catálogo / Site da {sup.name} ↗</span>
                      </a>
                    )}

                    <a
                      href={datasheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-product-datasheet-link"
                      title={`Buscar ficha técnica e datasheet oficial de ${product.name} da ${sup.name}`}
                    >
                      <FileText size={14} />
                      <span>Buscar Ficha Técnica / Datasheet no Google ↗</span>
                    </a>
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
