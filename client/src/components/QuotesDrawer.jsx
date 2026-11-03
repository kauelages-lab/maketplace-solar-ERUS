import React from 'react';
import { X, FileText, CheckCircle, Clock } from 'lucide-react';

export default function QuotesDrawer({ isOpen, onClose, quotes, onNewQuoteClick }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>
            <FileText size={20} color="#FB923C" />
            <span>Minhas Cotações ({quotes.length})</span>
          </h3>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {quotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748B' }}>
              <Clock size={40} style={{ margin: '0 auto 12px', color: '#94A3B8' }} />
              <p style={{ fontWeight: 600, color: '#334155' }}>Nenhum orçamento solicitado ainda</p>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Navegue pelas peças do Solar Tracker e clique em "Solicitar Orçamento" para gerar protocolos técnicos de cotação.
              </p>
              <button
                className="form-submit-btn"
                style={{ marginTop: '16px', width: '100%' }}
                onClick={() => {
                  onClose();
                  onNewQuoteClick();
                }}
              >
                Fazer Cotação Geral
              </button>
            </div>
          ) : (
            quotes.map((q, idx) => (
              <div key={idx} className="quote-item-card">
                <div className="quote-item-header">
                  <span className="quote-protocol-pill">{q.protocol}</span>
                  <span className="quote-status-badge">{q.status}</span>
                </div>
                <div className="quote-item-title">{q.productName}</div>
                <div className="quote-item-meta">
                  <div><strong>Fornecedor:</strong> {q.supplier}</div>
                  <div><strong>Quantidade:</strong> {q.quantity}</div>
                  <div><strong>Solicitante:</strong> {q.customerName} ({q.customerEmail})</div>
                  {q.customerPhone && <div><strong>Contato:</strong> {q.customerPhone}</div>}
                  {q.notes && (
                    <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#64748B' }}>
                      "{q.notes}"
                    </div>
                  )}
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#94A3B8' }}>
                    {new Date(q.date).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
