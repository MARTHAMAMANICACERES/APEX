import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

interface PasajeroViewProps {
  saldoActual: number;
  setSaldoActual: (saldo: number) => void;
  onReset: () => void;
}

const PRECIOS = {
  niño: 0.50,
  estudiante: 1.00,
  adulto_mayor: 1.00,
  adulto: 2.30
};

const PRECIOS_TRUFI = {
  corta: 2.00,
  larga: 3.00
};

export function PasajeroView({ saldoActual, setSaldoActual, onReset }: PasajeroViewProps) {
  const [codigoMicro, setCodigoMicro] = useState('');
  const [tipoTransporte, setTipoTransporte] = useState<'micro' | 'trufi' | ''>('');
  const [distanciaTrufi, setDistanciaTrufi] = useState<'corta' | 'larga' | ''>('');
  const [tipoPersona, setTipoPersona] = useState<keyof typeof PRECIOS | ''>('');
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [montoTotal, setMontoTotal] = useState(0);
  const [mostrarPago, setMostrarPago] = useState(false);

  useEffect(() => {
    if (tipoPersona && tipoTransporte) {
      let precioBase = 0;
      
      if (tipoTransporte === 'micro') {
        precioBase = PRECIOS[tipoPersona];
      } else if (tipoTransporte === 'trufi' && distanciaTrufi) {
        precioBase = PRECIOS_TRUFI[distanciaTrufi];
      }
      
      setMontoTotal(precioBase * cantidadPersonas);
      setMostrarPago(precioBase > 0);
    } else {
      setMontoTotal(0);
      setMostrarPago(false);
    }
  }, [tipoPersona, tipoTransporte, distanciaTrufi, cantidadPersonas]);

  const handlePagar = () => {
    if (saldoActual >= montoTotal) {
      setSaldoActual(saldoActual - montoTotal);
      toast.success('¡CANCELÓ! Pago realizado exitosamente');
      
      // Resetear formulario
      setCodigoMicro('');
      setTipoTransporte('');
      setDistanciaTrufi('');
      setTipoPersona('');
      setCantidadPersonas(1);
      setMontoTotal(0);
      setMostrarPago(false);
    } else {
      toast.error('Saldo insuficiente para realizar el pago');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-green-700">👤 PASAJERO</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Saldo: {saldoActual.toFixed(2)} BS
              </Badge>
              <Button variant="outline" onClick={onReset} size="sm">
                Cambiar Usuario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Código del Micro */}
          <div className="space-y-2">
            <Label>Código del Micro (4 dígitos)</Label>
            <Input 
              type="text"
              placeholder="Ej: 1234"
              value={codigoMicro}
              onChange={(e) => setCodigoMicro(e.target.value.slice(0, 4))}
              maxLength={4}
              className="text-center text-lg"
            />
          </div>

          {/* Tipo de Transporte */}
          <div className="space-y-2">
            <Label>Tipo de Transporte</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={tipoTransporte === 'micro' ? 'default' : 'outline'}
                onClick={() => {
                  setTipoTransporte('micro');
                  setDistanciaTrufi('');
                }}
                className="h-12"
              >
                🚌 MICRO
              </Button>
              <Button 
                variant={tipoTransporte === 'trufi' ? 'default' : 'outline'}
                onClick={() => setTipoTransporte('trufi')}
                className="h-12"
              >
                🚐 TRUFI
              </Button>
            </div>
          </div>

          {/* Distancia para Trufi */}
          {tipoTransporte === 'trufi' && (
            <div className="space-y-2">
              <Label>Distancia del Viaje</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={distanciaTrufi === 'corta' ? 'default' : 'outline'}
                  onClick={() => setDistanciaTrufi('corta')}
                  className="h-12"
                >
                  📍 CORTA (2 BS)
                </Button>
                <Button 
                  variant={distanciaTrufi === 'larga' ? 'default' : 'outline'}
                  onClick={() => setDistanciaTrufi('larga')}
                  className="h-12"
                >
                  📍 LARGA (3 BS)
                </Button>
              </div>
            </div>
          )}

          {/* Tipo de Persona */}
          {tipoTransporte && (tipoTransporte === 'micro' || distanciaTrufi) && (
            <div className="space-y-2">
              <Label>Tipo de Persona</Label>
              <Select value={tipoPersona} onValueChange={(value) => setTipoPersona(value as keyof typeof PRECIOS)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona el tipo de persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="niño">👶 NIÑO (0.50 BS)</SelectItem>
                  <SelectItem value="estudiante">🎓 ESTUDIANTE (1.00 BS)</SelectItem>
                  <SelectItem value="adulto_mayor">👴 ADULTO MAYOR (1.00 BS)</SelectItem>
                  <SelectItem value="adulto">👨 ADULTO (2.30 BS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cantidad de Personas */}
          {mostrarPago && (
            <div className="space-y-2">
              <Label>Cantidad de Personas</Label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCantidadPersonas(Math.max(1, cantidadPersonas - 1))}
                  disabled={cantidadPersonas <= 1}
                >
                  -
                </Button>
                <span className="text-2xl font-bold w-16 text-center">{cantidadPersonas}</span>
                <Button 
                  variant="outline" 
                  onClick={() => setCantidadPersonas(cantidadPersonas + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          {/* Monto Total y Pago */}
          {mostrarPago && (
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Monto Total a Pagar:</p>
                    <p className="text-3xl font-bold text-blue-700">{montoTotal.toFixed(2)} BS</p>
                    <p className="text-xs text-gray-500">
                      {cantidadPersonas} persona{cantidadPersonas > 1 ? 's' : ''} × {(montoTotal/cantidadPersonas).toFixed(2)} BS
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handlePagar}
                disabled={saldoActual < montoTotal}
                className="w-full h-16 text-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
              >
                💳 PAGAR {montoTotal.toFixed(2)} BS
              </Button>

              {saldoActual < montoTotal && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    Saldo insuficiente. Necesitas {(montoTotal - saldoActual).toFixed(2)} BS adicionales.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}