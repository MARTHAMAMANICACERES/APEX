import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

interface ConductorViewProps {
  saldoActual: number;
  setSaldoActual: (saldo: number) => void;
  onReset: () => void;
}

interface PagoRecibido {
  id: string;
  monto: number;
  tipoTransporte: string;
  timestamp: Date;
  codigoMicro: string;
}

export function ConductorView({ saldoActual, setSaldoActual, onReset }: ConductorViewProps) {
  const [tipoTransporte, setTipoTransporte] = useState<'micro' | 'trufi' | ''>('');
  const [codigoVehiculo, setCodigoVehiculo] = useState('');
  const [pagosRecibidos, setPagosRecibidos] = useState<PagoRecibido[]>([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);

  // Simulador de pagos recibidos
  useEffect(() => {
    if (tipoTransporte && codigoVehiculo) {
      const interval = setInterval(() => {
        // Simular pago recibido aleatoriamente
        if (Math.random() < 0.3) { // 30% de probabilidad cada 3 segundos
          const montosAleatorios = [0.50, 1.00, 1.00, 2.30, 2.00, 3.00];
          const montoRecibido = montosAleatorios[Math.floor(Math.random() * montosAleatorios.length)];
          
          const nuevoPago: PagoRecibido = {
            id: Date.now().toString(),
            monto: montoRecibido,
            tipoTransporte,
            timestamp: new Date(),
            codigoMicro: codigoVehiculo
          };

          setPagosRecibidos(prev => [nuevoPago, ...prev.slice(0, 9)]); // Mantener últimos 10
          setTotalRecaudado(prev => prev + montoRecibido);
          setSaldoActual(prev => prev + montoRecibido);
          
          toast.success(`💰 PAGO RECIBIDO: ${montoRecibido.toFixed(2)} BS`);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [tipoTransporte, codigoVehiculo, setSaldoActual]);

  const handleIniciarViaje = () => {
    if (tipoTransporte && codigoVehiculo) {
      toast.success('¡Viaje iniciado! Esperando pasajeros...');
    }
  };

  const handleFinalizarViaje = () => {
    toast.info('Viaje finalizado');
    setPagosRecibidos([]);
    setTotalRecaudado(0);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-orange-700">🚌 CONDUCTOR</CardTitle>
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
          
          {/* Tipo de Transporte */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Transporte</label>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={tipoTransporte === 'micro' ? 'default' : 'outline'}
                onClick={() => {
                  setTipoTransporte('micro');
                  setCodigoVehiculo('');
                }}
                className="h-12"
              >
                🚌 MICRO
              </Button>
              <Button 
                variant={tipoTransporte === 'trufi' ? 'default' : 'outline'}
                onClick={() => {
                  setTipoTransporte('trufi');
                  setCodigoVehiculo('');
                }}
                className="h-12"
              >
                🚐 TRUFI
              </Button>
            </div>
          </div>

          {/* Código del Vehículo */}
          {tipoTransporte && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Código del {tipoTransporte === 'micro' ? 'Micro' : 'Trufi'}
              </label>
              <Select value={codigoVehiculo} onValueChange={setCodigoVehiculo}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={`Selecciona tu ${tipoTransporte}`} />
                </SelectTrigger>
                <SelectContent>
                  {tipoTransporte === 'micro' ? (
                    <>
                      <SelectItem value="1001">Micro 1001</SelectItem>
                      <SelectItem value="1002">Micro 1002</SelectItem>
                      <SelectItem value="1003">Micro 1003</SelectItem>
                      <SelectItem value="1004">Micro 1004</SelectItem>
                      <SelectItem value="1005">Micro 1005</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="T001">Trufi T001</SelectItem>
                      <SelectItem value="T002">Trufi T002</SelectItem>
                      <SelectItem value="T003">Trufi T003</SelectItem>
                      <SelectItem value="T004">Trufi T004</SelectItem>
                      <SelectItem value="T005">Trufi T005</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Controles de Viaje */}
          {tipoTransporte && codigoVehiculo && (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleIniciarViaje}
                className="h-12 bg-green-600 hover:bg-green-700"
              >
                🚀 Iniciar Viaje
              </Button>
              <Button 
                onClick={handleFinalizarViaje}
                variant="outline"
                className="h-12"
              >
                🛑 Finalizar Viaje
              </Button>
            </div>
          )}

          {/* Resumen de Recaudación */}
          {tipoTransporte && codigoVehiculo && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">💰 Recaudación del Viaje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-green-700">{totalRecaudado.toFixed(2)} BS</p>
                  <p className="text-sm text-gray-600">Total recaudado hoy</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial de Pagos Recibidos */}
          {pagosRecibidos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Últimos Pagos Recibidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {pagosRecibidos.map((pago) => (
                    <Alert key={pago.id} className="border-green-200 bg-green-50">
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-700">
                              +{pago.monto.toFixed(2)} BS
                            </p>
                            <p className="text-xs text-gray-600">
                              {pago.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {pago.tipoTransporte.toUpperCase()}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado Actual */}
          {tipoTransporte && codigoVehiculo && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-700">
                <strong>Estado:</strong> Operando {tipoTransporte.toUpperCase()} {codigoVehiculo} - 
                Esperando pasajeros...
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}