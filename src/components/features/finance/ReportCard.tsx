import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { financeUtils } from '@/api/services/financeService';
import type { Report } from '@/types/finance.types';

interface ReportCardProps {
  groupId: string;
  onLoadWeekly: () => Promise<Report>;
  onLoadYearly: (year?: number) => Promise<Report>;
}

type ReportType = 'weekly' | 'yearly';

export const ReportCard: React.FC<ReportCardProps> = ({
  onLoadWeekly,
  onLoadYearly,
}) => {
  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let reportData: Report;
      if (reportType === 'weekly') {
        reportData = await onLoadWeekly();
      } else {
        reportData = await onLoadYearly(selectedYear);
      }
      setReport(reportData);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadReport();
  }, [reportType, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Reportes Adicionales
        </h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('weekly')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              reportType === 'weekly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setReportType('yearly')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              reportType === 'yearly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anual
          </button>
        </div>

        {reportType === 'yearly' && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}

        {loading && (
          <div className="text-center py-6 text-gray-500 text-sm">
            Cargando reporte...
          </div>
        )}

        {error && (
          <div className="text-center py-6 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && report && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Período</div>
              <div className="text-sm font-semibold text-gray-900">
                {report.start_date} - {report.end_date}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div className="text-xs text-green-600 font-medium">Ingresos</div>
                </div>
                <div className="text-base font-bold text-green-700">
                  {financeUtils.formatCurrency(report.summary.total_income.value)}
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <div className="text-xs text-red-600 font-medium">Gastos</div>
                </div>
                <div className="text-base font-bold text-red-700">
                  {financeUtils.formatCurrency(report.summary.total_expenses.value)}
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-3 ${
              report.summary.net_balance.value >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <div className="text-xs font-medium mb-1 ${
                report.summary.net_balance.value >= 0 ? 'text-blue-600' : 'text-orange-600'
              }">
                Balance Neto
              </div>
              <div className={`text-lg font-bold ${
                report.summary.net_balance.value >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {financeUtils.formatCurrency(report.summary.net_balance.value)}
              </div>
            </div>

            {report.expense_by_category && report.expense_by_category.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Top 3 Categorías de Gastos
                </div>
                <div className="space-y-2">
                  {report.expense_by_category.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.category.color || '#6B7280' }}
                        />
                        <span className="text-gray-700">{item.category.name}</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {financeUtils.formatCurrency(item.total.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
