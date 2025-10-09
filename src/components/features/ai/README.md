# Componentes de Chat con Datos MCP

Este directorio contiene los componentes necesarios para renderizar las respuestas del agente MCP con datos estructurados.

## Componentes Principales

### MCPDataRenderer
Componente principal que detecta automáticamente el tipo de datos y renderiza el componente apropiado.

```tsx
import { MCPDataRenderer } from './MCPDataRenderer';

<MCPDataRenderer data={mcpResponse.data} />
```

### Cards Específicas

#### TransactionCard
Renderiza una transacción individual (gasto o ingreso).

```tsx
import { TransactionCard } from './cards/TransactionCard';

<TransactionCard data={transactionData} />
```

#### FinancialSummaryCard
Renderiza un resumen financiero completo con ingresos, gastos y balance.

```tsx
import { FinancialSummaryCard } from './cards/FinancialSummaryCard';

<FinancialSummaryCard data={summaryData} />
```

#### TransactionListCard
Renderiza una lista de transacciones.

```tsx
import { TransactionListCard } from './cards/TransactionListCard';

<TransactionListCard data={transactionListData} />
```

#### CategoryListCard
Renderiza una lista de categorías organizadas por tipo (gastos/ingresos).

```tsx
import { CategoryListCard } from './cards/CategoryListCard';

<CategoryListCard data={categoryListData} />
```

#### CategoryCard
Renderiza una categoría individual.

```tsx
import { CategoryCard } from './cards/CategoryCard';

<CategoryCard data={categoryData} />
```

#### BudgetStatusCard
Renderiza el estado de los presupuestos configurados.

```tsx
import { BudgetStatusCard } from './cards/BudgetStatusCard';

<BudgetStatusCard data={budgetStatusData} />
```

#### CategoryExpenseCard
Renderiza las categorías con sus gastos (respuesta de "¿En qué categorías he gastado más?").

```tsx
import { CategoryExpenseCard } from './cards/CategoryExpenseCard';

<CategoryExpenseCard data={categoryExpenseData} />
```

#### BudgetLimitsCard
Renderiza los límites de presupuesto configurados (respuesta de "¿Qué límites de presupuesto tengo configurados?").

```tsx
import { BudgetLimitsCard } from './cards/BudgetLimitsCard';

<BudgetLimitsCard data={budgetLimitsData} />
```

## Tipos de Datos Soportados

### Transacción Individual
```typescript
{
  id: string;
  amount: number;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  transaction_date: string;
  category: {
    id: string;
    name: string;
    type: 'EXPENSE' | 'INCOME';
    color: string;
  };
  category_used?: string;
}
```

### Resumen Financiero
```typescript
{
  summary: {
    total_income: { value: number; currency: string };
    total_expenses: { value: number; currency: string };
    net_balance: { value: number; currency: string };
    transaction_count: number;
  };
  income_by_category: Array<{
    category: { name: string; color: string };
    total: { value: number; currency: string };
    percentage: number;
  }>;
  expense_by_category: Array<{
    category: { name: string; color: string };
    total: { value: number; currency: string };
    percentage: number;
  }>;
}
```

### Lista de Transacciones
```typescript
{
  count: number;
  transactions: TransactionCardData[];
}
```

### Lista de Categorías
```typescript
{
  success: boolean;
  categories: CategoryCardData[];
  count: number;
}
```

### Estado de Presupuestos
```typescript
{
  success: boolean;
  budget_status: Array<{
    category_name: string;
    limit_amount: number;
    current_amount: number;
    percentage: number;
    status: 'OK' | 'WARNING' | 'EXCEEDED';
  }>;
  total: number;
}
```

### Gastos por Categoría
```typescript
Array<{
  category_id: string;
  category_name: string;
  total: number;
  currency: string;
  transaction_count: number;
  percentage: number;
  average: number;
}>
```

### Límites de Presupuesto
```typescript
Array<{
  id: string;
  category_id: string;
  category_name: string;
  limit_amount: number;
  period: string;
  is_active: boolean;
  alert_threshold: number;
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    group_id: string;
    created_at: string;
  };
  created_at?: string;
}>
```

## Integración con el Chat

Para integrar estos componentes con el chat, actualiza el store y el componente de mensaje:

### Store (aiChatStore.ts)
```typescript
addMCPResponse: (response) =>
  set((state) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: response.client_response,
      client_response: response.client_response,
      mcp_data: response.data,
      timestamp: new Date(),
    };
    return {
      messages: [...state.messages, newMessage],
    };
  }),
```

### ChatMessage.tsx
```typescript
const renderMCPData = () => {
  if (!message.mcp_data) return null;
  return <MCPDataRenderer data={message.mcp_data} />;
};

// En el JSX:
{renderMCPData()}
```

## Pruebas

Para probar los componentes, puedes usar:

- `MCPDataTest.tsx` - Prueba individual de cada componente
- `MCPChatTest.tsx` - Prueba de integración con el chat
- `mcpDataExamples.ts` - Datos de ejemplo para pruebas

## Extensibilidad

Para agregar nuevos tipos de datos:

1. Define el tipo en `ai.types.ts`
2. Crea el componente de card correspondiente
3. Actualiza `MCPDataRenderer` para detectar el nuevo tipo
4. Agrega el caso en el switch del renderer

## Estilos

Todos los componentes usan Tailwind CSS y siguen el diseño del mockup proporcionado. Los colores y estilos son consistentes con el tema de la aplicación.
