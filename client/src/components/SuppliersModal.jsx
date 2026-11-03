import React, { useState } from 'react';
import { X, Building2, Phone, Mail, Globe, MessageSquare, BadgeCheck, MapPin } from 'lucide-react';

export default function SuppliersModal({ isOpen, onClose, suppliers }) {
  const [selectedRegion, setSelectedRegion] = useState('Todas');

  if (!isOpen) return null;

  const filteredSuppliers = selectedRegion === 'Todas'
    ? suppliers
    : suppliers.filter(s => s.region.toLowerCase().includes(selectedRegion.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Building2 size={22} color="#F97316" />
            <span>Fabricantes & Fornecedores Homologados ({suppliers.length})</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['Todas', 'Ceará', 'Nacional', 'Internacional'].map((reg) => (
              <button
                key={reg}
                className={`cat-pill ${selectedRegion === reg ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => setSelectedRegion(reg)}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="suppliers-grid">
            {filteredSuppliers.map((sup) => (
              <div key={sup.id} className="supplier-item-card">
                <div className="supplier-card-top">
                  <div>
                    <h4 className="supplier-name">{sup.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      <MapPin size={13} color="#F97316" />
                      <span>{sup.location}</span>
                    </div>
                  </div>
                  <span className="supplier-region-badge">{sup.region}</span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                  <strong>Linha Fornecida:</strong> {sup.categories.join(', ')}
                </div>

                <div className="supplier-contact-row">
                  {sup.phone && (
                    <a href={`tel:${sup.phone}`} className="contact-link">
                      <Phone size={14} color="#0284C7" />
                      <span>{sup.phone}</span>
                    </a>
                  )}

                  {sup.whatsapp && (
                    <a
                      href={`https://wa.me/${sup.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link whatsapp-link"
                    >
                      <MessageSquare size={14} color="#16A34A" />
                      <span>WhatsApp ({sup.whatsapp})</span>
                    </a>
                  )}

                  {sup.email && (
                    <a href={`mailto:${sup.email}`} className="contact-link">
                      <Mail size={14} color="#F97316" />
                      <span>{sup.email}</span>
                    </a>
                  )}

                  {sup.website && (
                    <a
                      href={sup.website.startsWith('http') ? sup.website : `https://${sup.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                      style={{ color: '#0284C7', fontWeight: 600 }}
                    >
                      <Globe size={14} />
                      <span>{sup.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
