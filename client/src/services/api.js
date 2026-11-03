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
    
    // Optional backend sync
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
    
    // Optional backend sync
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
  } catch (e) {
    // Fallback to static data
  }
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
  } catch (e) {
    // Fallback to static data
  }

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
  } catch (e) {
    // Fallback to static data
  }

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

export function getProductSupplierDirectUrl(product, supplierName) {
  if (!supplierName) return null;

  const sName = supplierName.toLowerCase();
  const pName = (product?.name || '').toLowerCase();
  const pTech = (product?.technicalName || '').toLowerCase();

  // 1. WEG specific deep-links
  if (sName.includes('weg')) {
    if (pName.includes('cabo')) return 'https://www.weg.net/catalog/weg/BR/pt/search?text=cabos+solares';
    if (pName.includes('inversor')) return 'https://www.weg.net/catalog/weg/BR/pt/Energia-Solar/Inversores-Solares/c/BR_WSS_SOLAR_INVERTERS';
    if (pName.includes('string box') || pName.includes('quadro')) return 'https://www.weg.net/catalog/weg/BR/pt/Energia-Solar/String-Box/c/BR_WSS_SOLAR_STRING_BOX';
    if (pName.includes('atuador') || pName.includes('motor')) return 'https://www.weg.net/catalog/weg/BR/pt/search?text=motoredutor+solar';
    if (pName.includes('tcu') || pName.includes('controlador')) return 'https://www.weg.net/catalog/weg/BR/pt/search?text=controlador+solar+tcu';
    if (pName.includes('anemometro') || pName.includes('inclinometro') || pName.includes('sensor')) return 'https://www.weg.net/catalog/weg/BR/pt/search?text=sensor+solar';
    return `https://www.weg.net/catalog/weg/BR/pt/search?text=${encodeURIComponent(product.name || 'solar')}`;
  }

  // 2. Santoro Atuadores
  if (sName.includes('santoro')) {
    if (pName.includes('atuador')) return 'https://santoroatuador.com.br/atuador-linear/';
    if (pName.includes('fuso') || pName.includes('haste')) return 'https://santoroatuador.com.br/haste-de-impulso/';
    return 'https://santoroatuador.com.br/produtos/';
  }

  // 3. Emov Brasil
  if (sName.includes('emov')) {
    if (pName.includes('atuador')) return 'https://emovbrasil.com.br/atuadores-lineares/';
    if (pName.includes('inclinometro') || pName.includes('sensor')) return 'https://emovbrasil.com.br/inclinometros/';
    return 'https://emovbrasil.com.br/produtos/';
  }

  // 4. PLP do Brasil
  if (sName.includes('plp')) {
    if (pName.includes('tubo') || pName.includes('torque') || pName.includes('eixo')) return 'https://plp.com.br/mercados/energia-solar/';
    if (pName.includes('estaca') || pName.includes('coluna')) return 'https://plp.com.br/mercados/energia-solar/';
    if (pName.includes('grampo') || pName.includes('clame')) return 'https://plp.com.br/mercados/energia-solar/';
    return 'https://plp.com.br/mercados/energia-solar/';
  }

  // 5. Array Technologies
  if (sName.includes('array')) {
    if (pName.includes('tubo') || pName.includes('torque') || pName.includes('eixo')) return 'https://arraytechinc.com/products/duratrack/';
    if (pName.includes('slew') || pName.includes('motor')) return 'https://arraytechinc.com/products/omnitrack/';
    return 'https://arraytechinc.com/products/';
  }

  // 6. Soltec
  if (sName.includes('soltec')) {
    return 'https://soltec.com/trackers/';
  }

  // 7. Nextracker
  if (sName.includes('nextracker')) {
    if (pName.includes('tcu') || pName.includes('controlador')) return 'https://www.nextracker.com/products/truecapture/';
    return 'https://www.nextracker.com/products/';
  }

  // 8. Trina Tracker / Trina Solar
  if (sName.includes('trina')) {
    if (pName.includes('modulo') || pName.includes('painel')) return 'https://www.trinasolar.com/en-glb/product/vertex-bifacial';
    return 'https://www.trinasolar.com/en-glb/trina-tracker';
  }

  // 9. Sou Energy
  if (sName.includes('sou energy')) {
    if (pName.includes('cabo')) return 'https://souenergy.com.br/?s=cabos+solares';
    if (pName.includes('modulo') || pName.includes('painel')) return 'https://souenergy.com.br/?s=modulo+bifacial';
    if (pName.includes('inversor')) return 'https://souenergy.com.br/?s=inversor';
    if (pName.includes('string box')) return 'https://souenergy.com.br/?s=string+box';
    if (pName.includes('grampo') || pName.includes('trilho')) return 'https://souenergy.com.br/?s=estrutura+fixacao';
    return `https://souenergy.com.br/?s=${encodeURIComponent(product?.name || 'solar')}`;
  }

  // 10. Cearasol
  if (sName.includes('cearasol')) {
    if (pName.includes('cabo')) return 'https://cearasol.com.br/?s=cabo+solar';
    if (pName.includes('modulo') || pName.includes('painel')) return 'https://cearasol.com.br/?s=painel+solar';
    if (pName.includes('grampo') || pName.includes('trilho')) return 'https://cearasol.com.br/?s=estrutura';
    return `https://cearasol.com.br/?s=${encodeURIComponent(product?.name || 'solar')}`;
  }

  // 11. Fortal Solar
  if (sName.includes('fortal solar')) {
    if (pName.includes('cabo')) return 'https://fortalsolar.com.br/?s=cabos';
    if (pName.includes('string box')) return 'https://fortalsolar.com.br/?s=string+box';
    if (pName.includes('grampo')) return 'https://fortalsolar.com.br/?s=grampos';
    return `https://fortalsolar.com.br/?s=${encodeURIComponent(product?.name || 'solar')}`;
  }

  // 12. BSolar
  if (sName.includes('bsolar')) {
    if (pName.includes('inversor')) return 'https://bsolar.com.br/?s=inversor';
    if (pName.includes('string box')) return 'https://bsolar.com.br/?s=string+box';
    if (pName.includes('cabo')) return 'https://bsolar.com.br/?s=cabos';
    return `https://bsolar.com.br/?s=${encodeURIComponent(product?.name || 'solar')}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${supplierName} ${product?.name || ''} solar tracker`)}`;
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
    // If supplier is explicitly in the matched products
    if (supplierNamesFromProducts.has(s.name.toLowerCase())) {
      return true;
    }
    // Or if supplier categories match the search term
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

  // Try sending to remote API
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
  } catch (e) {
    // Silently fall back to local quote storage
  }

  saveStoredQuote(localQuote);
  return localQuote;
}
