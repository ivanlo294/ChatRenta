import React from 'react';
import { ValuationReport } from '@/lib/types';

interface ValuationReportProps {
  report: ValuationReport;
}

export const ValuationReportComponent: React.FC<ValuationReportProps> = ({ report }) => {
  const formatCurrency = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(num);
  };

  const formatPercentage = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return '-';
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Asset Characteristics */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Características del Activo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.assetCharacteristics || {}).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded">
              <dt className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/_/g, ' ')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {typeof value === 'number' ? formatCurrency(value) : String(value)}
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* P&L Statement */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cuenta de Pérdidas y Ganancias
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  ADR
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ocupación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ingresos Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Costes Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  GOP
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  EBITDA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(report.plStatement || []).map((month, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month?.month ?? `Mes ${index + 1}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(month?.adr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatPercentage(month?.occupancy)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(month?.revenue?.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(month?.costs?.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(month?.gop)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(month?.ebitda)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  TOTAL ANUAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(report.annualTotals?.adr)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPercentage(report.annualTotals?.occupancy)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(report.annualTotals?.revenue?.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(report.annualTotals?.costs?.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(report.annualTotals?.gop)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(report.annualTotals?.ebitda)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Valuation */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Valoración del Activo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-blue-600">Exit Yield</dt>
            <dd className="mt-1 text-lg font-semibold text-blue-900">
              {formatPercentage(report.valuation?.exitYield)}
            </dd>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-green-600">Valor del Activo</dt>
            <dd className="mt-1 text-lg font-semibold text-green-900">
              {formatCurrency(report.valuation?.assetValue)}
            </dd>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-purple-600">Precio por m²</dt>
            <dd className="mt-1 text-lg font-semibold text-purple-900">
              {formatCurrency(report.valuation?.pricePerM2)}
            </dd>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-orange-600">Precio por Habitación</dt>
            <dd className="mt-1 text-lg font-semibold text-orange-900">
              {formatCurrency(report.valuation?.pricePerRoom)}
            </dd>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Análisis de Sensibilidad
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ADR / Exit Yield
                </th>
                {(report.sensitivityAnalysis?.yieldVariations || []).map((yield_, index) => (
                  <th key={index} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {yield_ > 0 ? '+' : ''}{formatPercentage(yield_)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(report.sensitivityAnalysis?.adrVariations || []).map((adr, adrIndex) => (
                <tr key={adrIndex}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {adr > 0 ? '+' : ''}{adr}%
                  </td>
                  {(report.sensitivityAnalysis?.valuationMatrix?.[adrIndex] || []).map((value, yieldIndex) => (
                    <td key={yieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {formatCurrency(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};