import React from 'react';
import { Sun, CheckCircle, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="erus-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h4>
            <Sun size={22} color="#F97316" />
            <span>ERUS SOLAR MARKET</span>
          </h4>
          <p>
            Plataforma B2B para cotação, homologação e suprimento de componentes mecânicos, elétricos e de automação para rastreadores solares (Solar Trackers).
          </p>
        </div>

        <div className="footer-col">
          <h5>Subsistemas do Tracker</h5>
          <ul>
            <li>Estrutura Mecânica & Apoio de Solo</li>
            <li>Acionamento Linear & Slew Drives</li>
            <li>Automação, TCU & Inclinômetros</li>
            <li>Módulos Bifaciais & Inversores</li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Garantias Técnicas</h5>
          <ul>
            <li><CheckCircle size={14} color="#10B981" /> Compatível c/ Norma ASTM A123</li>
            <li><Shield size={14} color="#0284C7" /> Atuadores com Selagem IP66/IP67</li>
            <li><Award size={14} color="#F59E0B" /> Algoritmo Astronômico NREL SPA</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} <strong>Equipe ERUS</strong> — Desenvolvido para o ecossistema de Energia Solar & Solar Trackers.
        </div>
        <div>
          Base de dados extraída de: <em>solar_tracker_pecas_e_fornecedores_v2.xlsx</em>
        </div>
      </div>
    </footer>
  );
}
