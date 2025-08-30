import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { PasajeroView } from './components/PasajeroView';
import { ConductorView } from './components/ConductorView';


export default function App() {
  const [userType, setUserType] = useState<'pasajero' | 'conductor' | null>(null);
  const [saldoActual, setSaldoActual] = useState(50.00); // Saldo inicial simulado

  const handleReset = async () => {
    await fetch('/cobrese/APEX/api/logout.php', { credentials: 'include' });
    setUserType(null);
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-800">
              Registro - Transporte Público
            </CardTitle>
            <p className="text-gray-600">Selecciona tu tipo de usuario</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Saldo: {saldoActual.toFixed(2)} BS
              </Badge>
            </div>
            
            <Button 
              onClick={() => setUserType('pasajero')}
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
            >
              👤 PASAJERO
            </Button>
            
            <Button 
              onClick={() => setUserType('conductor')}
              className="w-full h-16 text-lg bg-orange-600 hover:bg-orange-700"
            >
              🚌 CONDUCTOR
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {userType === 'pasajero' && (
        <PasajeroView 
          saldoActual={saldoActual} 
          setSaldoActual={setSaldoActual}
          onReset={handleReset}
        />
      )}
      {userType === 'conductor' && (
        <ConductorView 
          saldoActual={saldoActual}
          setSaldoActual={setSaldoActual}
          onReset={handleReset}
        />
      )}
      <Toaster />
    </div>
  );
}