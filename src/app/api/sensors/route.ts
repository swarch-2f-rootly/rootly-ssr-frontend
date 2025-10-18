import { NextResponse } from "next/server";

// Closed API handler: en producción deberíamos llamar a https://api.rootly.com/v1/sensors
// Aquí dejamos un mock para cerrar el ciclo end-to-end.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const data = [
    {
      id: "sensor-1",
      name: "Humedad Invernadero",
      type: "humidity",
      status: status || "active",
      location: { latitude: 4.711, longitude: -74.072 },
      installedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(data, { status: 200 });
}


