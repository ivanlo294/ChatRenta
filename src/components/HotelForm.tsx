'use client';

import React, { useState } from 'react';
import { HotelData } from '@/lib/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';

interface HotelFormProps {
  onSubmit: (data: HotelData) => Promise<void>;
  loading: boolean;
}

export const HotelForm: React.FC<HotelFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<HotelData>({
    establishmentType: 'hotel',
    category: '',
    rooms: 0,
    constructedSurface: 0,
    establishmentUse: 'urbano',
    municipality: '',
    address: '',
    fb: 'sin_fb',
    otherRevenues: {
      mice: false,
      spa: false,
      masajes: false,
    },
    purchasePrice: 0,
    fees: 0,
    capex: 0,
    operatorType: 'alquiler',
  });

  const establishmentOptions = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'pension', label: 'Pensión' },
    { value: 'apartamentos_turisticos', label: 'Apartamentos Turísticos' },
  ];

  const categoryOptions = [
    { value: '1', label: '1 Estrella' },
    { value: '2', label: '2 Estrellas' },
    { value: '3', label: '3 Estrellas' },
    { value: '4', label: '4 Estrellas' },
    { value: '5', label: '5 Estrellas' },
  ];

  const useOptions = [
    { value: 'urbano', label: 'Urbano' },
    { value: 'vacacional', label: 'Vacacional' },
  ];

  const fbOptions = [
    { value: 'sin_fb', label: 'Sin F&B' },
    { value: 'desayunos', label: 'Desayunos' },
    { value: 'restaurante_cafeteria', label: 'Restaurante/Cafetería' },
    { value: 'restaurante_abierto', label: 'Restaurante Abierto' },
    { value: 'restaurantes_bar', label: 'Restaurantes & Bar' },
    { value: 'full_service', label: 'Full Service' },
  ];

  const operatorOptions = [
    { value: 'alquiler', label: 'Alquiler' },
    { value: 'contrato_management', label: 'Contrato de Management' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('otherRevenues.')) {
        const key = name.split('.')[1] as keyof typeof formData.otherRevenues;
        setFormData(prev => ({
          ...prev,
          otherRevenues: {
            ...prev.otherRevenues,
            [key]: checkbox.checked,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Establecimiento */}
        <Select
          name="establishmentType"
          label="Tipo de Establecimiento"
          options={establishmentOptions}
          value={formData.establishmentType}
          onChange={handleInputChange}
          required
        />

        {/* Categoría (solo si es hotel) */}
        {formData.establishmentType === 'hotel' && (
          <Select
            name="category"
            label="Categoría"
            options={categoryOptions}
            value={formData.category || ''}
            onChange={handleInputChange}
          />
        )}

        {/* Número de habitaciones */}
        <Input
          name="rooms"
          label="Número de Habitaciones"
          type="number"
          value={formData.rooms}
          onChange={handleInputChange}
          required
          min="1"
        />

        {/* Superficie construida */}
        <Input
          name="constructedSurface"
          label="Superficie Construida (m²)"
          type="number"
          value={formData.constructedSurface}
          onChange={handleInputChange}
          required
          min="1"
        />

        {/* Uso del establecimiento */}
        <Select
          name="establishmentUse"
          label="Uso del Establecimiento"
          options={useOptions}
          value={formData.establishmentUse}
          onChange={handleInputChange}
          required
        />

        {/* Municipio */}
        <Input
          name="municipality"
          label="Municipio"
          type="text"
          value={formData.municipality}
          onChange={handleInputChange}
          required
        />

        {/* Dirección */}
        <Input
          name="address"
          label="Dirección"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="md:col-span-2"
        />

        {/* F&B */}
        <Select
          name="fb"
          label="F&B"
          options={fbOptions}
          value={formData.fb}
          onChange={handleInputChange}
          required
        />

        {/* Precio de compra */}
        <Input
          name="purchasePrice"
          label="Precio de Compra (€)"
          type="number"
          value={formData.purchasePrice}
          onChange={handleInputChange}
          required
          min="0"
        />

        {/* Honorarios */}
        <Input
          name="fees"
          label="Honorarios (% del precio de compra)"
          type="number"
          value={formData.fees}
          onChange={handleInputChange}
          required
          min="0"
          max="100"
          step="0.1"
        />

        {/* Capex */}
        <Input
          name="capex"
          label="Capex (€)"
          type="number"
          value={formData.capex}
          onChange={handleInputChange}
          required
          min="0"
        />

        {/* Tipo de operador */}
        <Select
          name="operatorType"
          label="Tipo de Operador"
          options={operatorOptions}
          value={formData.operatorType}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Otros ingresos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Otros Ingresos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Checkbox
            name="otherRevenues.mice"
            label="MICE"
            checked={formData.otherRevenues.mice}
            onChange={handleInputChange}
          />
          <Checkbox
            name="otherRevenues.spa"
            label="SPA"
            checked={formData.otherRevenues.spa}
            onChange={handleInputChange}
          />
          <Checkbox
            name="otherRevenues.masajes"
            label="Masajes"
            checked={formData.otherRevenues.masajes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={loading}
        className="w-full"
      >
        {loading ? 'Generando Informe...' : 'Generar Informe de Valoración'}
      </Button>
    </form>
  );
};