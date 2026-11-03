import { STATIC_PRODUCTS, STATIC_SUPPLIERS, getSubsystemsList } from '../data/catalogData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const LOCAL_STORAGE_QUOTES_KEY = 'erus_submitted_quotes_v1';

export function getStoredQuotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredQuote(quote) {
  try {
    const current = getStoredQuotes();
    const updated = [quote, ...current];
    localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [quote];
  }
}

export function cancelStoredQuote(protocol) {
  try {
    const current = getStoredQuotes();
    const updated = current.map(q => {
      if (q.protocol === protocol) {
        return { ...q, status: 'Cancelado pelo Solicitante' };
      }
      return q;
    });
    localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(updated));
    fetch(`${API_BASE}/quotes/${protocol}/cancel`, { method: 'PATCH' }).catch(() => {});
    return updated;
  } catch {
    return getStoredQuotes();
  }
}

export function deleteStoredQuote(protocol) {
  try {
    const current = getStoredQuotes();
    const updated = current.filter(q => q.protocol !== protocol);
    localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(updated));
    fetch(`${API_BASE}/quotes/${protocol}`, { method: 'DELETE' }).catch(() => {});
    return updated;
  } catch {
    return getStoredQuotes();
  }
}

export async function fetchSubsystems() {
  try {
    const res = await fetch(`${API_BASE}/subsystems`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return data.subsystems || [];
    }
  } catch (e) {}
  return getSubsystemsList();
}

export async function fetchSuppliers(region = 'Todas') {
  try {
    const query = region && region !== 'Todas' ? `?region=${encodeURIComponent(region)}` : '';
    const res = await fetch(`${API_BASE}/suppliers${query}`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return data.suppliers || [];
    }
  } catch (e) {}

  if (region && region !== 'Todas') {
    return STATIC_SUPPLIERS.filter(s => s.region.toLowerCase().includes(region.toLowerCase()));
  }
  return STATIC_SUPPLIERS;
}

export async function fetchProducts({ search = '', subsystem = 'Todos', supplier = 'Todos' } = {}) {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (subsystem && subsystem !== 'Todos') params.append('subsystem', subsystem);
    if (supplier && supplier !== 'Todos') params.append('supplier', supplier);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return data.products || [];
    }
  } catch (e) {}

  let list = [...STATIC_PRODUCTS];

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.technicalName.toLowerCase().includes(term) ||
      p.function.toLowerCase().includes(term) ||
      p.specification.toLowerCase().includes(term) ||
      (p.keywords && p.keywords.some(k => k.toLowerCase().includes(term) || term.includes(k.toLowerCase()))) ||
      (p.suppliers && p.suppliers.some(s => s.toLowerCase().includes(term)))
    );
  }

  if (subsystem && subsystem !== 'Todos') {
    list = list.filter(p => p.subsystem === subsystem);
  }

  if (supplier && supplier !== 'Todos') {
    list = list.filter(p => p.suppliers.some(s => s.toLowerCase().includes(supplier.toLowerCase())));
  }

  return list;
}

export function getSuppliersForProduct(product) {
  if (!product || !product.suppliers) return [];
  return product.suppliers.map(supName => {
    const found = STATIC_SUPPLIERS.find(s => s.name.toLowerCase() === supName.toLowerCase());
    return found || {
      id: Math.random(),
      name: supName,
      region: 'Nacional',
      location: 'Brasil',
      categories: [product.subsystem],
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
      verified: true
    };
  });
}

/**
 * Retorna o link verificado direto para a página de produto, catálogo ou loja oficial daquele fornecedor específico.
 */
export function getProductSupplierDirectUrl(product, supplierName) {
  if (!supplierName) return null;

  const s = supplierName.toLowerCase();
  const p = (product?.name || '').toLowerCase();
  const t = (product?.technicalName || '').toLowerCase();

  // 1. WEG (Verificado)
  if (s.includes('weg')) {
    if (p.includes('inversor')) return 'https://www.weg.net/catalog/weg/BR/pt/WDC_DRIVES_INVERTER_SIW';
    if (p.includes('cabo') || p.includes('string box') || p.includes('protecao')) return 'https://www.weg.net/solar/br/produtos/';
    if (p.includes('tcu') || p.includes('controlador') || p.includes('motor')) return 'https://www.weg.net/solar/br/produtos/';
    return 'https://www.weg.net/solar/br/produtos/';
  }

  // 2. Santoro Atuadores (Loja Oficial com fotos reais, especificações de curso 50mm a 1000mm e compras)
  if (s.includes('santoro')) {
    return 'https://lista.mercadolivre.com.br/santoro-atuadores';
  }

  // 3. Emov Brasil (Catálogo oficial de movimentação linear ETM e fusos Korta)
  if (s.includes('emov')) {
    if (p.includes('fuso') || p.includes('haste')) return 'https://emovbrasil.com.br/produtos/marca/korta-group';
    if (p.includes('junta') || p.includes('mancal') || p.includes('guia')) return 'https://emovbrasil.com.br/produtos/marca/etm-linear-motion';
    return 'https://emovbrasil.com.br/produtos';
  }

  // 4. PLP do Brasil (Portal oficial de energia solar e estruturas)
  if (s.includes('plp')) {
    return 'https://plp.com.br/energia/solar/';
  }

  // 5. Array Technologies Brasil (Páginas oficiais de produtos DuraTrack e OmniTrack)
  if (s.includes('array')) {
    if (p.includes('tubo') || p.includes('torque') || p.includes('eixo')) return 'https://arraytechinc.com/products/duratrack/';
    if (p.includes('slew') || p.includes('motor') || p.includes('redutor')) return 'https://arraytechinc.com/products/omnitrack/';
    return 'https://arraytechinc.com/products/duratrack/';
  }

  // 6. Nextracker Inc. (NX Horizon Tracker & TrueCapture TCU Algorithm)
  if (s.includes('nextracker')) {
    if (p.includes('tcu') || p.includes('controlador') || p.includes('inteligente')) return 'https://www.nextracker.com/products/truecapture/';
    return 'https://www.nextracker.com/products/nx-horizon/';
  }

  // 7. Trina Tracker / Trina Solar (Páginas oficiais de rastreadores e módulos bifaciais Vertex)
  if (s.includes('trina')) {
    if (p.includes('modulo') || p.includes('painel') || p.includes('bifacial')) return 'https://www.trinasolar.com/en-glb/product/vertex-bifacial';
    return 'https://www.trinasolar.com/en-glb/trina-tracker';
  }

  // 8. Soltec Trackers (Sistemas de rastreamento SF7 e SFOne)
  if (s.includes('soltec')) {
    return 'https://soltec.com/';
  }

  // 9. Sou Energy (Catálogo oficial de inversores e portal de documentos/datasheets)
  if (s.includes('sou energy')) {
    if (p.includes('inversor')) return 'https://souenergy.com.br/inversores-e-microinversores.html';
    if (p.includes('modulo') || p.includes('painel') || p.includes('cabo')) return 'https://docs.souenergy.com.br/';
    return 'https://souenergy.com.br/';
  }

  // 10. Fortal Solar (Página de soluções e serviços solares)
  if (s.includes('fortal solar')) {
    return 'https://fortalsolar.com.br/servicos-e-solucoes/';
  }

  // 11. Cearasol Energia Solar (Portal oficial de soluções fotovoltaicas e suportes)
  if (s.includes('cearasol')) {
    return 'https://cearasol.com.br/';
  }

  // 12. BSolar Energia (Portal oficial de kits e soluções solares)
  if (s.includes('bsolar')) {
    return 'https://bsolar.com.br/';
  }

  return null;
}

/**
 * Link direto de pesquisa no Google para encontrar o Datasheet / Ficha Técnica do item naquela marca.
 */
export function getProductDatasheetSearchUrl(product, supplierName) {
  const query = `${supplierName} ${product?.name || ''} ${product?.technicalName || ''} datasheet especificações`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function findSuppliersBySearch(searchTerm, matchedProducts = []) {
  if (!searchTerm && matchedProducts.length === 0) {
    return STATIC_SUPPLIERS;
  }

  const term = searchTerm ? searchTerm.toLowerCase() : '';
  const supplierNamesFromProducts = new Set();
  
  matchedProducts.forEach(p => {
    if (p.suppliers) {
      p.suppliers.forEach(s => supplierNamesFromProducts.add(s.toLowerCase()));
    }
  });

  return STATIC_SUPPLIERS.filter(s => {
    if (supplierNamesFromProducts.has(s.name.toLowerCase())) {
      return true;
    }
    if (term) {
      const nameMatch = s.name.toLowerCase().includes(term);
      const catMatch = s.categories.some(c => c.toLowerCase().includes(term) || term.includes(c.toLowerCase()));
      const locMatch = s.location.toLowerCase().includes(term);
      return nameMatch || catMatch || locMatch;
    }
    return false;
  });
}

export async function submitQuote(quotePayload) {
  const protocol = `ERUS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const localQuote = {
    protocol,
    date: new Date().toISOString(),
    productId: quotePayload.productId || null,
    productName: quotePayload.productName || 'Geral / Múltiplos Itens',
    quantity: quotePayload.quantity || 'Não especificada',
    supplier: quotePayload.supplier || 'Melhor Proposta (Cotação Aberta)',
    customerName: quotePayload.customerName,
    customerEmail: quotePayload.customerEmail,
    customerPhone: quotePayload.customerPhone || '',
    notes: quotePayload.notes || '',
    status: 'Em Análise pelo Fornecedor'
  };

  try {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotePayload),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.quote) {
        saveStoredQuote(data.quote);
        return data.quote;
      }
    }
  } catch (e) {}

  saveStoredQuote(localQuote);
  return localQuote;
}
