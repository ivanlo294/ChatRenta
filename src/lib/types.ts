export interface HotelData {
    establishmentType: 'hotel' | 'hostel' | 'pension' | 'apartamentos_turisticos';
    category?: string;
    rooms: number;
    constructedSurface: number;
    establishmentUse: 'urbano' | 'vacacional';
    municipality: string;
    address: string;
    fb: 'sin_fb' | 'desayunos' | 'restaurante_cafeteria' | 'restaurante_abierto' | 'restaurantes_bar' | 'full_service';
    otherRevenues: {
      mice: boolean;
      spa: boolean;
      masajes: boolean;
    };
    purchasePrice: number;
    fees: number; // percentage
    capex: number;
    operatorType: 'alquiler' | 'contrato_management';
  }
  
  export interface MonthlyPL {
    month: string;
    revenue: {
      rooms: number;
      fb: number;
      other: number;
      total: number;
    };
    costs: {
      operational: number;
      staff: number;
      utilities: number;
      marketing: number;
      maintenance: number;
      total: number;
    };
    gop: number;
    rentOrFees: number;
    ebitda: number;
    adr: number;
    occupancy: number;
  }
  
  export interface ValuationReport {
    assetCharacteristics: {
      [key: string]: string | number;
    };
    plStatement: MonthlyPL[];
    annualTotals: MonthlyPL;
    valuation: {
      exitYield: number;
      assetValue: number;
      pricePerM2: number;
      pricePerRoom: number;
    };
    sensitivityAnalysis: {
      adrVariations: number[];
      yieldVariations: number[];
      valuationMatrix: number[][];
    };
  }