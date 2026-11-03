import React, { useState } from 'react';
import { X, FileText, Clock, Ban, Trash2, Check, ShieldCheck, Lock, Unlock, ShieldAlert } from 'lucide-react';

export default function QuotesDrawer({
  isOpen,
  onClose,
  quotes,
  onNewQuoteClick,
  onCancelQuote,
  onDeleteQuote,
  onUpdateQuoteStep
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPinPrompt(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    // Default PIN: erus or 1234
    if (pinInput.toLowerCase() === 'erus' || pinInput === '1234' || pinInput.toLowerCase() === 'admin') {
      setIsAdmin(true);
      setShowPinPrompt(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const getStepStatus = (currentStep, stepNum) => {
    if (currentStep > stepNum) return 'completed';
    if (currentStep === stepNum) return 'active';
    return 'pending';
  };

  const getStepDetailText = (step) => {
    switch (step) {
      case 1:
        return 'Demanda recebida e registrada no sistema ERUS.';
      case 2:
        return 'Análise de estoque e compatibilidade técnica com o fornecedor.';
      case 3:
        return 'Proposta comercial pronta com preços e prazos de frete.';
      case 4:
        return 'Cotação finalizada com sucesso! Proposta enviada ao solicitante.';
      default:
        return 'Em análise pelo departamento de engenharia do fornecedor.';
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#FB923C" />
            <h3 style={{ margin: 0 }}>Minhas Cotações ({quotes.length})</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Admin Mode Toggle */}
            <button
              className={`btn-admin-toggle ${isAdmin ? 'admin-active' : ''}`}
              onClick={handleAdminToggle}
              title={isAdmin ? 'Desativar Modo Administrador' : 'Ativar Modo Administrador para alterar etapas'}
            >
              {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
              <span>{isAdmin ? 'Admin Ativo' : 'Sou Admin'}</span>
            </button>

            <button className="drawer-close" onClick={onClose} title="Fechar">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PIN Prompt Modal / Dropdown */}
        {showPinPrompt && (
          <div className="admin-pin-prompt">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} color="#F97316" /> Acesso Administrador ERUS
              </span>
              <button
                style={{ fontSize: '0.75rem', color: '#64748B' }}
                onClick={() => setShowPinPrompt(false)}
              >
                Cancelar
              </button>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#475569', marginBottom: '8px' }}>
              Digite a chave de segurança para gerenciar as demandas e atualizar etapas:
            </p>
            <form onSubmit={handleVerifyPin} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="password"
                placeholder="Chave de acesso..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="admin-pin-input"
              />
              <button type="submit" className="admin-pin-submit">
                Entrar
              </button>
            </form>
            {pinError && (
              <span style={{ color: '#DC2626', fontSize: '0.72rem', marginTop: '4px', display: 'block' }}>
                Senha incorreta. Tente novamente.
              </span>
            )}
          </div>
        )}

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
            quotes.map((q) => {
              const isCancelled = q.status === 'Cancelado pelo Solicitante';
              const currentStep = q.step !== undefined ? q.step : 2;

              return (
                <div
                  key={q.protocol}
                  className={`quote-item-card ${isCancelled ? 'quote-item-cancelled' : ''}`}
                >
                  <div className="quote-item-header">
                    <span className="quote-protocol-pill">{q.protocol}</span>
                    <span className={`quote-status-badge ${isCancelled ? 'status-cancelled' : 'status-pending'}`}>
                      {q.status}
                    </span>
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
                      Data do Pedido: {new Date(q.date).toLocaleString('pt-BR')}
                    </div>
                  </div>

                  {/* Visual Progress Tracking */}
                  {!isCancelled ? (
                    <div className="quote-stepper-box">
                      <div className="stepper-title">Andamento da Cotação:</div>
                      
                      <div className="stepper-track">
                        {/* Step 1 */}
                        <div className={`stepper-step ${getStepStatus(currentStep, 1)}`}>
                          <div className="step-circle">
                            {currentStep > 1 ? <Check size={12} strokeWidth={3} /> : '1'}
                          </div>
                          <span className="step-label">Solicitado</span>
                        </div>
                        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                        
                        {/* Step 2 */}
                        <div className={`stepper-step ${getStepStatus(currentStep, 2)}`}>
                          <div className="step-circle">
                            {currentStep > 2 ? <Check size={12} strokeWidth={3} /> : (currentStep === 2 ? <Clock size={12} /> : '2')}
                          </div>
                          <span className="step-label">Análise</span>
                        </div>
                        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                        
                        {/* Step 3 */}
                        <div className={`stepper-step ${getStepStatus(currentStep, 3)}`}>
                          <div className="step-circle">
                            {currentStep > 3 ? <Check size={12} strokeWidth={3} /> : (currentStep === 3 ? <Clock size={12} /> : '3')}
                          </div>
                          <span className="step-label">Proposta</span>
                        </div>
                        <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`}></div>
                        
                        {/* Step 4 */}
                        <div className={`stepper-step ${getStepStatus(currentStep, 4)}`}>
                          <div className="step-circle">
                            {currentStep >= 4 ? <Check size={12} strokeWidth={3} /> : '4'}
                          </div>
                          <span className="step-label">Concluído</span>
                        </div>
                      </div>

                      <div className="stepper-details">
                        <div className="stepper-detail-item">
                          <span className="detail-dot"></span>
                          <span>Fase Atual: <strong>{getStepDetailText(currentStep)}</strong></span>
                        </div>
                        <div className="stepper-sla">
                          Previsão de retorno: <strong>24h a 48h úteis</strong> via <em>{q.customerEmail}</em>
                        </div>
                      </div>

                      {/* Admin Controller (Exclusivo Administrador) */}
                      {isAdmin && (
                        <div className="admin-step-controller">
                          <div className="admin-ctrl-label">
                            <ShieldAlert size={13} color="#F97316" />
                            <span>Atualizar Etapa (Exclusivo Administrador ERUS):</span>
                          </div>
                          <div className="admin-step-buttons">
                            <button
                              className={`admin-btn-step ${currentStep === 1 ? 'selected' : ''}`}
                              onClick={() => onUpdateQuoteStep(q.protocol, 1, 'Solicitação Registrada')}
                            >
                              1. Solicitado
                            </button>
                            <button
                              className={`admin-btn-step ${currentStep === 2 ? 'selected' : ''}`}
                              onClick={() => onUpdateQuoteStep(q.protocol, 2, 'Em Análise Técnica')}
                            >
                              2. Análise Técnica
                            </button>
                            <button
                              className={`admin-btn-step ${currentStep === 3 ? 'selected' : ''}`}
                              onClick={() => onUpdateQuoteStep(q.protocol, 3, 'Proposta Comercial Pronta')}
                            >
                              3. Proposta Pronta
                            </button>
                            <button
                              className={`admin-btn-step ${currentStep === 4 ? 'selected' : ''}`}
                              onClick={() => onUpdateQuoteStep(q.protocol, 4, 'Cotação Concluída')}
                            >
                              4. Concluído ✓
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="cancelled-notice-box">
                      <Ban size={15} color="#DC2626" />
                      <span>Processo cancelado pelo solicitante. Os fornecedores foram notificados da suspensão da demanda.</span>
                    </div>
                  )}

                  <div className="quote-actions-row">
                    {!isCancelled ? (
                      <button
                        className="btn-cancel-quote"
                        onClick={() => onCancelQuote(q.protocol)}
                        title="Cancelar esta solicitação de orçamento"
                      >
                        <Ban size={14} />
                        <span>Cancelar Pedido</span>
                      </button>
                    ) : (
                      <button
                        className="btn-delete-quote"
                        onClick={() => onDeleteQuote(q.protocol)}
                        title="Excluir este orçamento cancelado do seu histórico"
                      >
                        <Trash2 size={14} />
                        <span>Excluir do Histórico</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
