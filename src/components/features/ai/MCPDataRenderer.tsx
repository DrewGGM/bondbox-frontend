import React from 'react';
import type { 
  TransactionCardData, 
  CategoryCardData, 
  FinancialSummaryCardData, 
  TransactionListCardData, 
  CategoryListCardData, 
  BudgetStatusCardData,
  EmailNotificationCardData,
  ProductCardData,
  InventoryListCardData,
  ShoppingListCardData,
  ProductSearchCardData,
  LowStockCardData,
  ExpiringProductsCardData,
  GroupMembersCardData,
  TaskCreatedCardData,
  TaskListCardData,
  TaskUpdatedCardData
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
import { EmailNotificationCard } from './cards/EmailNotificationCard';
import { ProductCard } from './cards/ProductCard';
import { InventoryListCard } from './cards/InventoryListCard';
import { ShoppingListCard } from './cards/ShoppingListCard';
import { ProductSearchCard } from './cards/ProductSearchCard';
import { LowStockCard } from './cards/LowStockCard';
import { ExpiringProductsCard } from './cards/ExpiringProductsCard';
import { GroupMembersCard } from './cards/GroupMembersCard';
import { TaskCreatedCard } from './cards/TaskCreatedCard';
import { TaskListCard } from './cards/TaskListCard';
import { TaskUpdatedCard } from './cards/TaskUpdatedCard';

interface MCPDataRendererProps {
  data: any;
}

export const MCPDataRenderer: React.FC<MCPDataRendererProps> = ({ data }) => {
  if (!data) return null;

  // Detectar nuevo formato con ui_data (visualizaciones y acciones estructuradas)
  if (data.ui_data) {
    const { visualizations = [], actions = [] } = data.ui_data;

    return (
      <div className="space-y-4">
        {/* Renderizar visualizaciones */}
        {visualizations.map((viz: any, index: number) => {
          if (viz.has_error) {
            return (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">Error al obtener datos</span>
                </div>
              </div>
            );
          }

          // Renderizar según el tipo de visualización
          if (viz.visualization_type === 'generic' && viz.data) {
            // Renderizar datos genéricos con formato mejorado
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{viz.icon || '📊'}</span>
                  <span className="font-semibold text-gray-800">
                    {viz.tool?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Resultados'}
                  </span>
                </div>

                {/* Renderizar resumen si hay totales */}
                {(viz.data.total_ingresos !== undefined || viz.data.total_gastos !== undefined || viz.data.todas_categorias !== undefined) && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {viz.data.todas_categorias !== undefined && (
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 mb-1">Total</div>
                        <div className="text-2xl font-bold text-blue-600">{viz.data.todas_categorias}</div>
                        <div className="text-xs text-gray-500">categorías</div>
                      </div>
                    )}
                    {viz.data.total_ingresos !== undefined && (
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 mb-1">Ingresos</div>
                        <div className="text-2xl font-bold text-green-600">{viz.data.total_ingresos}</div>
                        <div className="text-xs text-gray-500">categorías</div>
                      </div>
                    )}
                    {viz.data.total_gastos !== undefined && (
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 mb-1">Gastos</div>
                        <div className="text-2xl font-bold text-red-600">{viz.data.total_gastos}</div>
                        <div className="text-xs text-gray-500">categorías</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Renderizar el resto de los datos */}
                <MCPDataRenderer data={viz.data} />
              </div>
            );
          }

          // Renderizar los datos directamente
          return (
            <div key={index}>
              <MCPDataRenderer data={viz.data} />
            </div>
          );
        })}

        {/* Renderizar acciones si existen */}
        {actions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-900 mb-2">Acciones sugeridas:</div>
            <div className="space-y-2">
              {actions.map((action: any, index: number) => (
                <div key={index} className="text-sm text-blue-700">
                  • {action.description || action.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detectar formato con titulo (formato más reciente de Bondy)
  if (data.categorias && Array.isArray(data.categorias) && data.titulo) {
    // Inferir tipo desde el primer elemento de categorías o del título
    const firstCat = data.categorias[0];
    const isIncome =
      firstCat?.tipo === 'INCOME' ||
      data.titulo.toLowerCase().includes('ingreso');
    const bgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isIncome ? 'border-green-200' : 'border-red-200';
    const textColor = isIncome ? 'text-green-700' : 'text-red-700';
    const icon = isIncome ? '💰' : '💸';

    return (
      <div>
        <div className={`text-sm font-medium ${textColor} mb-2 flex items-center gap-2`}>
          <span>{icon}</span>
          <span>
            {data.titulo} ({data.categorias.length})
          </span>
        </div>
        <div className="grid gap-2">
          {data.categorias.map((cat: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center gap-3 ${bgColor} rounded-lg p-3 border ${borderColor}`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{cat.nombre}</div>
                <div className="text-xs text-gray-500">{cat.tipo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detectar formato genérico de categorías con tipo (nuevo formato de Bondy)
  if (data.categorias && Array.isArray(data.categorias) && data.tipo) {
    const isIncome = data.tipo === 'INCOME';
    const bgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isIncome ? 'border-green-200' : 'border-red-200';
    const textColor = isIncome ? 'text-green-700' : 'text-red-700';
    const icon = isIncome ? '💰' : '💸';
    const label = isIncome ? 'Ingresos' : 'Gastos';

    return (
      <div>
        <div className={`text-sm font-medium ${textColor} mb-2 flex items-center gap-2`}>
          <span>{icon}</span>
          <span>Categorías de {label} ({data.categorias.length})</span>
        </div>
        <div className="grid gap-2">
          {data.categorias.map((cat: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center gap-3 ${bgColor} rounded-lg p-3 border ${borderColor}`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{cat.nombre}</div>
                <div className="text-xs text-gray-500">{cat.tipo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detectar formato de categorías_ingresos/categorias_gastos (nuevo formato de Bondy)
  if (data.categorias_ingresos || data.categorias_gastos) {
    const allCategories = [
      ...(data.categorias_ingresos || []),
      ...(data.categorias_gastos || [])
    ];

    if (allCategories.length > 0) {
      return (
        <div className="space-y-3">
          {data.categorias_ingresos && data.categorias_ingresos.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                <span>💰</span>
                <span>Categorías de Ingresos ({data.categorias_ingresos.length})</span>
              </div>
              <div className="grid gap-2">
                {data.categorias_ingresos.map((cat: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{cat.nombre}</div>
                      <div className="text-xs text-gray-500">{cat.tipo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.categorias_gastos && data.categorias_gastos.length > 0 && (
            <div>
              <div className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <span>💸</span>
                <span>Categorías de Gastos ({data.categorias_gastos.length})</span>
              </div>
              <div className="grid gap-2">
                {data.categorias_gastos.map((cat: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-50 rounded-lg p-3 border border-red-200">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{cat.nombre}</div>
                      <div className="text-xs text-gray-500">{cat.tipo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  }

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

  // Detectar notificación de email (respuesta de envío de correo)
  if (data.success !== undefined && data.message && data.email_sent_to) {
    return <EmailNotificationCard data={data as EmailNotificationCardData} />;
  }

  // Detectar lista de compras
  if (data.success !== undefined && data.items && Array.isArray(data.items) && data.estado) {
    return <ShoppingListCard data={data as ShoppingListCardData} />;
  }

  // Detectar productos con stock bajo
  if (data.success !== undefined && data.productos_bajo_stock && Array.isArray(data.productos_bajo_stock)) {
    return <LowStockCard data={data as LowStockCardData} />;
  }

  // Detectar productos por vencer
  if (data.success !== undefined && data.productos_vencidos && Array.isArray(data.productos_vencidos)) {
    return <ExpiringProductsCard data={data as ExpiringProductsCardData} />;
  }

  // Detectar búsqueda de productos
  if (data.success !== undefined && data.productos_encontrados && Array.isArray(data.productos_encontrados) && data.busqueda) {
    return <ProductSearchCard data={data as ProductSearchCardData} />;
  }

  // Detectar lista de inventario (productos generales)
  if (data.success !== undefined && data.productos && Array.isArray(data.productos) && data.total !== undefined) {
    return <InventoryListCard data={data as InventoryListCardData} />;
  }

  // Detectar producto individual agregado
  if (data.success !== undefined && data.producto_agregado && data.producto_agregado.id && data.producto_agregado.name) {
    return <ProductCard data={data.producto_agregado as ProductCardData} />;
  }

  // Detectar miembros del grupo
  if (data.success !== undefined && data.miembros && Array.isArray(data.miembros) && data.total !== undefined) {
    return <GroupMembersCard data={data as GroupMembersCardData} />;
  }

  // Detectar tarea creada
  if (data.crear_tarea && data.crear_tarea.success && data.crear_tarea.tarea_creada) {
    return <TaskCreatedCard data={data.crear_tarea as TaskCreatedCardData} />;
  }

  // Detectar lista de tareas
  if (data.success !== undefined && (data.tareas_pendientes || data.tareas) && Array.isArray(data.tareas_pendientes || data.tareas)) {
    return <TaskListCard data={data as TaskListCardData} />;
  }

  // Detectar tarea actualizada
  if (data.success !== undefined && data.tarea_actualizada && data.task_id) {
    return <TaskUpdatedCard data={data as TaskUpdatedCardData} />;
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
