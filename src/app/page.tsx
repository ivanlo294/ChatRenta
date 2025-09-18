'use client';

import React, { useState } from 'react';
import { HotelForm } from '@/components/HotelForm';
import { ValuationReportComponent } from '@/components/ValuationReport';
import { HotelData, ValuationReport } from '@/lib/types';

export default function HomePage() {
  const [report, setReport] = useState<ValuationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: HotelData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const detail = errorBody?.detail || response.statusText;
        console.error('API /api/valuation error:', { status: response.status, detail: errorBody });
        throw new Error(detail || 'Failed to generate report');
      }

      const reportData = await response.json();
      setReport(reportData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al generar el informe: ${message}`);
      console.error('Client error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Herramienta de Valoración Hotelera
            </h1>
            {report && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Nueva Valoración
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!report ? (
          <HotelForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <ValuationReportComponent report={report} />
        )}
      </main>
    </div>
  );
}