import React from 'react';
import type { 
  TransactionCardData, 
  CategoryCardData, 
  FinancialSummaryCardData, 
  TransactionListCardData, 
  CategoryListCardData, 
  BudgetStatusCardData 
} from '@/types/ai.types';
import { TransactionCard } from './cards/TransactionCard';
import { CategoryCard } from './cards/CategoryCard';
import { FinancialSummaryCard } from './cards/FinancialSummaryCard';
import { TransactionListCard } from './cards/TransactionListCard';
import { CategoryListCard } from './cards/CategoryListCard';
import { BudgetStatusCard } from './cards/BudgetStatusCard';
import { CategoryExpenseCard } from './cards/CategoryExpenseCard';
import { BudgetLimitsCard } from './cards/BudgetLimitsCard';
import { BudgetExceededCard } from './cards/BudgetExceededCard';

interface MCPDataRendererProps {
  data: any;
}

export const MCPDataRenderer: React.FC<MCPDataRendererProps> = ({ data }) => {
  if (!data) return null;

  // Detectar array de categorías con gastos (respuesta de "¿En qué categorías he gastado más?")
  if (Array.isArray(data) && data.length > 0 && data[0].category_id && data[0].category_name && data[0].total !== undefined) {
    return <CategoryExpenseCard data={data} />;
  }

  // Detectar límites de presupuesto con estructura anidada (respuesta de "¿Qué límites de presupuesto tengo configurados?")
  if (data.success && data.items && Array.isArray(data.items) && data.items.length > 0 && data.items[0].limit_amount && data.items[0].category_name) {
    return <BudgetLimitsCard data={data.items} />;
  }

  // Detectar array de límites de presupuesto (formato directo)
  if (Array.isArray(data) && data.length > 0 && data[0].limit_amount && data[0].category_name && data[0].alert_threshold !== undefined) {
    return <BudgetLimitsCard data={data} />;
  }

  // Detectar array de límites de presupuesto (formato alternativo)
  if (Array.isArray(data) && data.length > 0 && data[0].limit_amount && data[0].category && data[0].alert_threshold !== undefined) {
    return <BudgetLimitsCard data={data} />;
  }

  // Detectar datos de límites excedidos (respuesta de "¿Estoy cerca de exceder algún límite de gasto?")
  if (data.verificar_limites_gasto && data.obtener_gastos_por_categoria) {
    return <BudgetExceededCard data={data} />;
  }

  // Detectar tipo de transacción individual
  if (data.id && data.amount && data.type && data.category) {
    return <TransactionCard data={data as TransactionCardData} />;
  }

  // Detectar categoría individual
  if (data.id && data.name && data.type && data.color && !data.amount) {
    return <CategoryCard data={data as CategoryCardData} />;
  }

  // Detectar resumen financiero
  if (data.summary && data.income_by_category && data.expense_by_category) {
    return <FinancialSummaryCard data={data as FinancialSummaryCardData} />;
  }

  // Detectar lista de transacciones
  if (data.count && data.transactions && Array.isArray(data.transactions)) {
    return <TransactionListCard data={data as TransactionListCardData} />;
  }

  // Detectar lista de categorías
  if (data.success !== undefined && data.categories && Array.isArray(data.categories)) {
    return <CategoryListCard data={data as CategoryListCardData} />;
  }

  // Detectar estado de presupuestos
  if (data.success !== undefined && data.budget_status && Array.isArray(data.budget_status)) {
    return <BudgetStatusCard data={data as BudgetStatusCardData} />;
  }

  // Detectar datos anidados (como en respuestas múltiples)
  if (typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    
    // Si hay múltiples operaciones, renderizar cada una (excluyendo 'raw' si ya se procesó 'items')
    if (keys.length > 1) {
      const filteredKeys = keys.filter(key => {
        // Si ya se procesó 'items', no procesar 'raw' para evitar duplicados
        if (key === 'raw' && keys.includes('items')) {
          return false;
        }
        return true;
      });
      
      return (
        <div className="space-y-4">
          {filteredKeys.map((key) => {
            const subData = data[key];
            if (subData && typeof subData === 'object') {
              return (
                <div key={key}>
                  <MCPDataRenderer data={subData} />
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    
    // Si es un objeto con una sola propiedad, renderizar su contenido
    if (keys.length === 1) {
      return <MCPDataRenderer data={data[keys[0]]} />;
    }
  }

  // Si no se puede detectar el tipo, no mostrar nada (solo las cards renderizadas)
  return null;
};
