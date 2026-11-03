import React from 'react';
import { Sparkles, ShieldCheck, Zap, Factory } from 'lucide-react';

export default function HeroBanner({ onQuickQuote }) {
  return (
    <section className="hero-banner">
      <div className="hero-inner">
        <div className="hero-text-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Ecossistema ERUS de Energia Solar</span>
          </div>
          <h2 className="hero-title">
            Marketplace Especializado em <span>Solar Trackers</span>
          </h2>
          <p className="hero-desc">
            Encontre componentes estruturais, atuadores elétricos heavy-duty, controladoras TCU astronômicas
            e módulos bifaciais dos principais fornecedores do Brasil e do Mundo. Solicite cotações técnicas diretas.
          </p>

          <div className="hero-metrics">
            <div className="metric-card">
              <div className="metric-val">19</div>
              <div className="metric-label">Peças e Subsistemas Mapeados</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">12</div>
              <div className="metric-label">Fornecedores Certificados</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">10 kW</div>
              <div className="metric-label">Dimensionamento Padrão de Arranjo</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-preview">
            <div className="preview-tag">
              <ShieldCheck size={16} />
              <span>Garantia de Especificação Técnica</span>
            </div>
            <div className="preview-title">
              Cotação Centralizada B2B
            </div>
            <div className="preview-specs">
              Compatibilidade garantida com normas ASTM A123, graus de vedação IP66/IP67 e células monocristalinas de alta eficiência.
            </div>
            <button
              className="preview-btn"
              onClick={onQuickQuote}
            >
              Fazer Cotação Aberta de Projeto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
