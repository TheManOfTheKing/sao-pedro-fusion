import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { useSupabaseAuth } from "@/contexts/AuthContext";
import { Menu as MenuIcon, QrCode, LogOut, Download } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Dashboard() {
  const { user, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const menuUrl = `${window.location.origin}/menu`;

  useEffect(() => {
    // Generate QR Code on mount
    QRCode.toDataURL(menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1F2937",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
        toast.error("Erro ao gerar QR Code");
      });
  }, [menuUrl]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      setLocation("/");
    } catch (error: any) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleDownloadQRCode = async () => {
    try {
      if (!qrCodeUrl) {
        toast.error("QR Code ainda não foi gerado");
        return;
      }

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qr-code-menu-${APP_TITLE.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("QR Code baixado com sucesso!");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Erro ao baixar QR Code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <header className="border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary">{APP_TITLE}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl font-bold text-foreground">
              Bem-vindo ao Painel Admin!
            </h2>
            <p className="text-muted-foreground font-sans text-lg">
              Gerencie o menu digital do seu restaurante
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Manage Menu */}
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation("/admin")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MenuIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl">Gerenciar Menu</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Adicionar, editar ou remover itens
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setLocation("/admin")}>
                  Abrir Painel Admin
                </Button>
              </CardContent>
            </Card>

            {/* View Public Menu */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl">Menu Público</CardTitle>
                    <p className="text-sm text-muted-foreground">Ver como os clientes veem</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open("/menu", "_blank")}
                >
                  Visualizar Menu
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <QrCode className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">QR Code do Menu</h3>
                    <p className="text-sm text-muted-foreground">
                      Baixe o QR Code apontando para{" "}
                      <code className="bg-background px-2 py-1 rounded text-xs">
                        {menuUrl}
                      </code>{" "}
                      para que os clientes acessem o menu digital diretamente em seus celulares.
                    </p>
                  </div>
                  
                  {/* QR Code Preview and Download */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    {qrCodeUrl ? (
                      <div className="flex-shrink-0">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code do Menu"
                          className="w-48 h-48 border-2 border-border rounded-lg bg-white p-2 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 border-2 border-border rounded-lg bg-muted flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleDownloadQRCode}
                        disabled={!qrCodeUrl}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar QR Code
                      </Button>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Clique para baixar o QR Code em formato PNG. Recomendamos imprimir em tamanho mínimo de 5x5 cm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
