# ERUS Solar Market ☀️
> Marketplace e Hub B2B de Peças & Fornecedores para Solar Trackers (Rastreadores Solares)

Desenvolvido para a equipe **ERUS**, com base nos dados técnicos da planilha `solar_tracker_pecas_e_fornecedores_v2.xlsx`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18+)

### 1. Iniciar o Backend (API)
```bash
cd marketplace-solar/server
npm.cmd install
npm.cmd start
```
*API rodando em: `http://localhost:3001`*

### 2. Iniciar o Frontend (React / Vite)
```bash
cd marketplace-solar/client
npm.cmd install
npm.cmd run dev
```
*Aplicação web rodando em: `http://localhost:5173`*

---

## 🛠️ Tecnologias e Funcionalidades

- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS com design responsivo moderno inspirado no Mercado Livre.
- **Backend:** Node.js, Express, CORS, endpoints REST estruturados.
- **Identidade Visual ERUS:** Cores Laranja Solar (#F97316) e Azul Noturno (#0F172A).
- **Dados Integrados:**
  - **19 Componentes:** Ilustrações procedurais em SVG, especificações técnicas completas, subsistemas (Estrutura Mecânica, Acionamento Mecânico, Automação & Controle, Componentes Elétricos).
  - **12 Fornecedores Homologados:** Contatos telefônicos, links diretos para WhatsApp, e-mails corporativos, websites e categorias atendidas (Ceará, Nacional e Internacional).
  - **Solicitação de Orçamento:** Sistema com geração de protocolo (ex: `ERUS-2026-XXXX`) e drawer para acompanhamento de cotações em tempo real.
