import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  id?: string;
}

export function QRCodeComponent({ 
  value, 
  size = 200, 
  level = "H",
  id = "qrcode-svg"
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).catch((err) => {
      console.error("Erro ao gerar QR Code:", err);
    });
  }, [value, size, level]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      style={{ display: "block" }}
      width={size}
      height={size}
    />
  );
}

