import { GoogleGenerativeAI } from '@google/generative-ai';
import { HotelData, ValuationReport } from './types';

// Validate API key early to provide clearer diagnostics
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey.trim().length === 0) {
  throw new Error(
    'GEMINI_API_KEY is not set. Add GEMINI_API_KEY to your environment (e.g., .env.local) and restart the dev server.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateValuationReport(hotelData: HotelData): Promise<ValuationReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
Eres un experto en valoración hotelera. Analiza los siguientes datos de un establecimiento hotelero y genera un informe completo de valoración siguiendo estos pasos:

DATOS DEL ESTABLECIMIENTO:
${JSON.stringify(hotelData, null, 2)}

INSTRUCCIONES DETALLADAS:

1. BÚSQUEDA DE COMPARABLES:
   - Identifica hoteles comparables en ${hotelData.municipality} y zona
   - Considera tipo: ${hotelData.establishmentType}, categoría: ${hotelData.category || 'N/A'}
   - Analiza características similares: ${hotelData.rooms} habitaciones, uso ${hotelData.establishmentUse}

2. ESTIMACIÓN ADR Y OCUPACIONES:
   - Calcula ADR mensual considerando estacionalidad y ubicación
   - Para hoteles ${hotelData.establishmentUse}: ajusta por patrones de demanda
   - Estima ocupaciones mensuales (0-100%)
   - ${hotelData.establishmentUse === 'vacacional' ? 'Considera temporada alta/baja y cierre de meses de baja demanda' : 'Opera 12 meses al año'}

3. ESTIMACIÓN F&B:
   - Servicio: ${hotelData.fb}
   - Calcula ingresos F&B por huésped según precios zona y asistencia estimada
   - Considera costes operativos F&B (30-40% de ingresos F&B)

4. OTROS INGRESOS:
   - MICE: ${hotelData.otherRevenues.mice ? 'Sí' : 'No'}
   - SPA: ${hotelData.otherRevenues.spa ? 'Sí' : 'No'}
   - Masajes: ${hotelData.otherRevenues.masajes ? 'Sí' : 'No'}
   - Estima ingresos anuales por servicios seleccionados

5. CUENTA P&L MENSUAL:
   - Ingresos: Habitaciones + F&B + Otros
   - Costes operativos: Personal, suministros, marketing, mantenimiento
   - GOP (Gross Operating Profit)
   - ${hotelData.operatorType === 'alquiler' ? 'Alquiler fijo estimado' : 'Management fees (8-12% ingresos)'}
   - EBITDA final

6. VALORACIÓN:
   - Cap rate según ubicación, categoría y características
   - Valor = EBITDA anual / Exit Yield
   - Calcular €/m² y €/habitación

7. ANÁLISIS SENSIBILIDAD:
   - ADR: -10%, -5%, base, +5%, +10%
   - Exit Yield: +0.5pp, +0.25pp, base, -0.25pp, -0.5pp
   - Matriz 5x5 de valoraciones

FORMATO DE RESPUESTA (JSON válido):
Devuelve ÚNICAMENTE un objeto JSON con la siguiente estructura, sin texto adicional:

{
  "assetCharacteristics": {
    "tipo": "${hotelData.establishmentType}",
    "categoria": "${hotelData.category || 'N/A'}",
    "habitaciones": ${hotelData.rooms},
    "superficie_m2": ${hotelData.constructedSurface},
    "uso": "${hotelData.establishmentUse}",
    "ubicacion": "${hotelData.municipality}, ${hotelData.address}",
    "fb": "${hotelData.fb}",
    "precio_compra": ${hotelData.purchasePrice},
    "honorarios_pct": ${hotelData.fees},
    "capex": ${hotelData.capex},
    "operador": "${hotelData.operatorType}",
    "euros_m2": "calculado",
    "euros_habitacion": "calculado"
  },
  "plStatement": [
    // Array de 12 meses con estructura MonthlyPL
  ],
  "annualTotals": {
    // Totales anuales con estructura MonthlyPL
  },
  "valuation": {
    "exitYield": "porcentaje_decimal",
    "assetValue": "valor_calculado",
    "pricePerM2": "precio_por_m2",
    "pricePerRoom": "precio_por_habitacion"
  },
  "sensitivityAnalysis": {
    "adrVariations": [-10, -5, 0, 5, 10],
    "yieldVariations": [0.5, 0.25, 0, -0.25, -0.5],
    "valuationMatrix": [
      // Matriz 5x5 de valoraciones
    ]
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini raw response without JSON:', text);
      throw new Error('La respuesta del modelo no contiene JSON válido.');
    }

    const jsonString = jsonMatch[0];
    const parsedData = JSON.parse(jsonString);

    return parsedData as ValuationReport;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while generating report';
    console.error('Error generating valuation report:', message);
    throw new Error(`Error al generar el informe: ${message}`);
  }
}