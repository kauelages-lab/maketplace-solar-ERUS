import React from 'react';
import { Layers, Wrench, Cpu, Zap, Compass } from 'lucide-react';

const CATEGORY_ICONS = {
  'Todos': Layers,
  'Estrutura Mecânica': Wrench,
  'Acionamento Mecânico': Compass,
  'Automação e Controle': Cpu,
  'Componentes Elétricos': Zap
};

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  totalItems
}) {
  return (
    <nav className="category-nav-bar">
      <div className="category-nav-inner">
        <button
          className={`cat-pill ${selectedCategory === 'Todos' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Todos')}
        >
          <Layers size={16} />
          <span>Todos os Produtos</span>
          <span className="cat-badge">{totalItems}</span>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.name] || Layers;
          const isActive = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <Icon size={16} />
              <span>{cat.name}</span>
              <span className="cat-badge">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
