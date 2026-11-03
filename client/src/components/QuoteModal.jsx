import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { submitQuote } from '../services/api';

export default function QuoteModal({ product, onClose, onQuoteSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    quantity: product?.estimatedQty || '1 projeto (10 kW)',
    supplier: product?.suppliers?.[0] || 'Cotação Aberta (Todos os Fornecedores)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      setError('Por favor preencha Nome e E-mail.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quote = await submitQuote({
        productId: product?.id || null,
        productName: product?.name || 'Cotação Geral de Projeto Tracker',
        quantity: formData.quantity,
        supplier: formData.supplier,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes
      });

      setSuccessData(quote);
      if (onQuoteSuccess) {
        onQuoteSuccess(quote);
      }
    } catch (err) {
      setError(err.message || 'Falha ao processar orçamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Send size={20} color="#F97316" />
            <span>Solicitar Orçamento B2B</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {successData ? (
            <div className="quote-success-view">
              <div className="success-check-circle">
                <CheckCircle2 size={40} />
              </div>
              <h4>Orçamento Registrado na ERUS!</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                Sua solicitação foi enviada aos fornecedores homologados. Você receberá propostas técnicas e prazos por e-mail ou WhatsApp.
              </p>

              <div className="protocol-box">
                Protocolo: {successData.protocol}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                Item: <strong>{successData.productName}</strong> | Fornecedor: <strong>{successData.supplier}</strong>
              </div>

              <button className="form-submit-btn" style={{ width: '100%' }} onClick={onClose}>
                Concluir e Voltar ao Marketplace
              </button>
            </div>
          ) : (
            <>
              {product && (
                <div className="modal-product-summary">
                  <div className="modal-summary-title">{product.name}</div>
                  <div className="modal-summary-subtitle">
                    {product.subsystem} • {product.technicalName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px' }}>
                    Especificação: {product.specification}
                  </div>
                </div>
              )}

              {error && (
                <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-group">
                  <label>Nome do Responsável / Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva / ERUS Engenharia"
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      placeholder="nome@empresa.com.br"
                      className="form-input"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp / Telefone</label>
                    <input
                      type="tel"
                      placeholder="(85) 99999-0000"
                      className="form-input"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantidade Estimada</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fornecedor de Preferência</label>
                    <select
                      className="form-select"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    >
                      <option value="Cotação Aberta (Todos os Fabricantes)">
                        Cotação Aberta (Melhor Preço/Prazo)
                      </option>
                      {product?.suppliers?.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Observações Técnicas / Local de Entrega</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Entrega em Fortaleza/CE, demanda para usina fotovoltaica de 10kW ou 50kW..."
                    className="form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="form-submit-btn"
                >
                  <Send size={16} />
                  <span>{loading ? 'Transmitindo Cotação...' : 'Confirmar e Enviar Pedido de Orçamento'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
