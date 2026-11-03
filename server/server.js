const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load static data
const productsPath = path.join(__dirname, 'data', 'products.json');
const suppliersPath = path.join(__dirname, 'data', 'suppliers.json');
const quotesPath = path.join(__dirname, 'data', 'quotes.json');

function getProducts() {
  return JSON.parse(fs.readFileSync(productsPath, 'utf8'));
}

function getSuppliers() {
  return JSON.parse(fs.readFileSync(suppliersPath, 'utf8'));
}

function getQuotes() {
  if (!fs.existsSync(quotesPath)) {
    fs.writeFileSync(quotesPath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
  } catch {
    return [];
  }
}

function saveQuote(quote) {
  const quotes = getQuotes();
  quotes.unshift(quote);
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8');
  return quote;
}

// 1. GET /api/products
app.get('/api/products', (req, res) => {
  let products = getProducts();
  const { search, subsystem, supplier } = req.query;

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.technicalName.toLowerCase().includes(term) ||
      p.function.toLowerCase().includes(term) ||
      p.specification.toLowerCase().includes(term)
    );
  }

  if (subsystem && subsystem !== 'Todos') {
    products = products.filter(p => p.subsystem === subsystem);
  }

  if (supplier) {
    products = products.filter(p => p.suppliers.some(s => s.toLowerCase().includes(supplier.toLowerCase())));
  }

  res.json({
    total: products.length,
    products
  });
});

// 2. GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const products = getProducts();
  const suppliers = getSuppliers();
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  // Enrich with supplier contact details
  const enrichedSuppliers = product.suppliers.map(supName => {
    const found = suppliers.find(s => s.name.toLowerCase() === supName.toLowerCase());
    return found || { name: supName, location: 'Brasil', phone: '-', email: '-' };
  });

  res.json({
    ...product,
    supplierDetails: enrichedSuppliers
  });
});

// 3. GET /api/subsystems
app.get('/api/subsystems', (req, res) => {
  const products = getProducts();
  const counts = {};
  products.forEach(p => {
    counts[p.subsystem] = (counts[p.subsystem] || 0) + 1;
  });

  const list = Object.entries(counts).map(([name, count]) => ({
    name,
    count
  }));

  res.json({
    totalItems: products.length,
    subsystems: list
  });
});

// 4. GET /api/suppliers
app.get('/api/suppliers', (req, res) => {
  let suppliers = getSuppliers();
  const { region } = req.query;

  if (region && region !== 'Todas') {
    suppliers = suppliers.filter(s => s.region.toLowerCase().includes(region.toLowerCase()));
  }

  res.json({
    total: suppliers.length,
    suppliers
  });
});

// 5. POST /api/quotes (Solicitar Orçamento)
app.post('/api/quotes', (req, res) => {
  const { productId, productName, quantity, supplier, customerName, customerEmail, customerPhone, notes } = req.body;

  if (!customerName || !customerEmail) {
    return res.status(400).json({ error: 'Nome e E-mail são obrigatórios para a cotação.' });
  }

  const quoteProtocol = `ERUS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newQuote = {
    protocol: quoteProtocol,
    date: new Date().toISOString(),
    productId: productId || null,
    productName: productName || 'Geral / Múltiplos Itens',
    quantity: quantity || 'Não especificada',
    supplier: supplier || 'Melhor Proposta (Cotação Aberta)',
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    notes: notes || '',
    status: 'Em Análise pelo Fornecedor'
  };

  saveQuote(newQuote);

  res.status(201).json({
    success: true,
    message: 'Solicitação de orçamento enviada com sucesso aos fornecedores cadastrados na ERUS!',
    quote: newQuote
  });
});

// 6. GET /api/quotes
app.get('/api/quotes', (req, res) => {
  const quotes = getQuotes();
  res.json({
    total: quotes.length,
    quotes
  });
});

// 7. PATCH /api/quotes/:protocol/cancel
app.patch('/api/quotes/:protocol/cancel', (req, res) => {
  const { protocol } = req.params;
  const quotes = getQuotes();
  const quote = quotes.find(q => q.protocol === protocol);

  if (!quote) {
    return res.status(404).json({ error: 'Orçamento não encontrado' });
  }

  quote.status = 'Cancelado pelo Solicitante';
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8');

  res.json({
    success: true,
    message: 'Orçamento cancelado com sucesso',
    quote
  });
});

// 8. DELETE /api/quotes/:protocol
app.delete('/api/quotes/:protocol', (req, res) => {
  const { protocol } = req.params;
  let quotes = getQuotes();
  const initialLength = quotes.length;
  quotes = quotes.filter(q => q.protocol !== protocol);

  if (quotes.length === initialLength) {
    return res.status(404).json({ error: 'Orçamento não encontrado' });
  }

  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8');

  res.json({
    success: true,
    message: 'Orçamento excluído do histórico com sucesso'
  });
});

// 9. PATCH /api/quotes/:protocol/step
app.patch('/api/quotes/:protocol/step', (req, res) => {
  const { protocol } = req.params;
  const { step, status } = req.body;
  const quotes = getQuotes();
  const quote = quotes.find(q => q.protocol === protocol);

  if (!quote) {
    return res.status(404).json({ error: 'Orçamento não encontrado' });
  }

  if (step !== undefined) quote.step = step;
  if (status) quote.status = status;
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf8');

  res.json({
    success: true,
    message: 'Etapa atualizada com sucesso pelo Administrador',
    quote
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ERUS Solar Market API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[ERUS API] Servidor rodando com sucesso na porta http://localhost:${PORT}`);
});
