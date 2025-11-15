import React from 'react';
import type { Visualization } from '@/types/ai.types';
import { MCPDataRenderer } from './MCPDataRenderer';

interface VisualizationCardProps {
  visualization: Visualization;
}

export const VisualizationCard: React.FC<VisualizationCardProps> = ({ visualization }) => {
  if (visualization.has_error) {
    return (
      <div className="bg-red-50 border border-red-300 p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-red-800">Error al obtener datos</h3>
        </div>
        <div className="text-sm text-red-700">
          {visualization.data.error || 'Error desconocido'}
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (visualization.chart_type) {
      case 'table':
        return renderTable();

      case 'card':
        return renderCards();

      case 'summary':
        return renderSummary();

      case 'list':
        return renderList();

      case 'checklist':
        return renderChecklist();

      case 'progress_bar':
        return renderProgressBar();

      case 'pie':
        return renderPieChart();

      default:
        return renderGeneric();
    }
  };

  const renderTable = () => {
    const data = visualization.data.productos || visualization.data.items || visualization.data;

    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-sm text-gray-500">No hay datos para mostrar</div>;
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider"
                >
                  {header.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-3 py-2 whitespace-nowrap">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCards = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(visualization.data).map(([key, value]) => (
          <div key={key} className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
            <div className="text-lg font-bold text-gray-900">{String(value)}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="space-y-2">
        {Object.entries(visualization.data).map(([key, value]) => (
          <div key={key} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
            <span className="text-gray-700">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderList = () => {
    const data = Array.isArray(visualization.data) ? visualization.data : [visualization.data];

    return (
      <ul className="space-y-2">
        {data.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
            <span className="text-primary mt-0.5">•</span>
            <span>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderChecklist = () => {
    const items = visualization.data.items || visualization.data;

    if (!Array.isArray(items)) {
      return renderGeneric();
    }

    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
            <input
              type="checkbox"
              checked={item.completed || item.estado === 'Completo'}
              readOnly
              className="w-4 h-4"
            />
            <span className={item.completed || item.estado === 'Completo' ? 'line-through text-gray-500' : ''}>
              {item.name || item.title || item.description || JSON.stringify(item)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderProgressBar = () => {
    const { budgets, current, total, percentage } = visualization.data;

    if (budgets && Array.isArray(budgets)) {
      return (
        <div className="space-y-4">
          {budgets.map((budget, idx) => {
            const percent = parseFloat(budget.porcentaje) || 0;
            const isAlert = budget.alerta || percent >= 80;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{budget.categoria}</span>
                  <span className={`font-semibold ${isAlert ? 'text-orange-600' : 'text-gray-600'}`}>
                    {budget.porcentaje}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      isAlert ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Gastado: {budget.gastado}</span>
                  <span>Límite: {budget.limite}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const percent = percentage || (current && total ? (current / total) * 100 : 0);

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progreso</span>
          <span className="text-gray-600">{Math.round(percent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        {current !== undefined && total !== undefined && (
          <div className="text-xs text-gray-500 text-center">
            {current} / {total}
          </div>
        )}
      </div>
    );
  };

  const renderPieChart = () => {
    const { gastos, title } = visualization.data;

    if (!gastos || !Array.isArray(gastos)) {
      return renderGeneric();
    }

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
      <div className="space-y-3">
        {title && <h4 className="font-semibold text-sm text-gray-700">{title}</h4>}
        <div className="space-y-2">
          {gastos.map((gasto, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="text-sm font-medium">{gasto.categoria}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-semibold">{gasto.monto}</span>
                <span className="text-xs text-gray-500 w-12 text-right">{gasto.porcentaje}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGeneric = () => {
    // Usar MCPDataRenderer para renderizar datos estructurados
    const rendered = <MCPDataRenderer data={visualization.data} />;

    // Si MCPDataRenderer retorna null (no detectó el formato), mostrar JSON como fallback
    if (!rendered) {
      return (
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
          {JSON.stringify(visualization.data, null, 2)}
        </pre>
      );
    }

    return rendered;
  };

  // Si el visualization_type es "generic", SIEMPRE usar MCPDataRenderer
  // porque indica datos genéricos que pueden tener cualquier estructura
  if (visualization.visualization_type === 'generic') {
    const mcpRendered = <MCPDataRenderer data={visualization.data} />;

    // Si MCPDataRenderer puede manejar los datos, retornar sin wrapper
    if (mcpRendered) {
      return <>{mcpRendered}</>;
    }
  }

  // Si el chart_type no es reconocido (default), intentar renderizar con MCPDataRenderer sin wrapper
  const knownChartTypes = [
    'table',
    'card',
    'summary',
    'list',
    'checklist',
    'progress_bar',
    'pie',
  ];

  if (
    !visualization.chart_type ||
    !knownChartTypes.includes(visualization.chart_type)
  ) {
    const mcpRendered = <MCPDataRenderer data={visualization.data} />;

    // Si MCPDataRenderer puede manejar los datos, retornar sin wrapper
    if (mcpRendered) {
      return <>{mcpRendered}</>;
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{visualization.icon}</span>
        <h3 className="text-base font-semibold capitalize">
          {visualization.tool.replace(/_/g, ' ')}
        </h3>
      </div>

      {renderChart()}
    </div>
  );
};
