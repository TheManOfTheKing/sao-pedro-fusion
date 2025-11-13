import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_TITLE, LOGIN_PATH, DEFAULT_MENU_LANGUAGE } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Globe,
  QrCode,
  Copy,
  Download,
  LogOut,
  Languages,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import MenuItemForm from "@/components/MenuItemForm";
import { QRCodeComponent } from "@/components/QRCode";

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | undefined>(undefined);

  const { data: categories, isLoading: categoriesLoading } = trpc.menu.getCategories.useQuery();
  const { data: allItems, isLoading: itemsLoading } = trpc.menu.getCompleteMenu.useQuery({ language: "pt" });
  const { data: activeLanguages = ["pt", "en", "es", "fr", "de", "it"] } = trpc.admin.getActiveLanguages.useQuery();
  const utils = trpc.useUtils();
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  
  const updateActiveLanguages = trpc.admin.updateActiveLanguages.useMutation({
    onSuccess: () => {
      toast.success("Idiomas atualizados com sucesso!");
      utils.admin.getActiveLanguages.invalidate();
      utils.menu.getActiveLanguages.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar idiomas: ${error.message}`);
    },
  });
  
  // Update selected languages when activeLanguages changes
  useEffect(() => {
    if (activeLanguages && activeLanguages.length > 0 && selectedLanguages.length === 0) {
      setSelectedLanguages(activeLanguages);
    }
  }, [activeLanguages, selectedLanguages.length]);
  
  const updateAvailability = trpc.admin.updateAvailability.useMutation({
    onSuccess: () => {
      toast.success("Disponibilidade atualizada!");
      // Invalidate queries to refresh data
      utils.menu.getCompleteMenu.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const formatPrice = (priceInCents: number) => {
    return `€${(priceInCents / 100).toFixed(2)}`;
  };

  const handleToggleAvailability = (itemId: number, currentStatus: boolean) => {
    updateAvailability.mutate({
      itemId,
      isAvailable: !currentStatus,
    });
  };

  const menuPath = useMemo(() => `/menu`, []);
  
  const menuUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return menuPath;
    }
    return `${window.location.origin}${menuPath}`;
  }, [menuPath]);

  const handleViewMenu = () => {
    if (typeof window !== "undefined") {
      window.open(menuUrl, "_blank", "noopener,noreferrer");
    } else {
      setLocation(menuPath);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      setLocation(LOGIN_PATH);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handleCopyUrl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(menuUrl).then(() => {
        toast.success("URL copiada para a área de transferência!");
      }).catch(() => {
        toast.error("Erro ao copiar URL");
      });
    }
  };

  const handleDownloadQR = () => {
    try {
      const canvas = document.getElementById("qrcode-svg") as HTMLCanvasElement;
      if (!canvas) {
        toast.error("QR Code não encontrado");
        return;
      }

      // Create a new canvas with padding
      const padding = 20;
      const downloadCanvas = document.createElement("canvas");
      const ctx = downloadCanvas.getContext("2d");
      
      if (!ctx) {
        toast.error("Erro ao criar canvas");
        return;
      }

      downloadCanvas.width = canvas.width + padding * 2;
      downloadCanvas.height = canvas.height + padding * 2;

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

      // Draw QR code image with padding
      ctx.drawImage(canvas, padding, padding);

      // Convert to PNG and download
      downloadCanvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Erro ao gerar imagem");
          return;
        }

        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-menu-${APP_TITLE.replace(/\s+/g, "-").toLowerCase()}.png`;
        downloadLink.href = url;
        downloadLink.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        toast.success("QR Code baixado com sucesso!");
      }, "image/png");
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error);
      toast.error("Erro ao baixar QR Code");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center font-display text-2xl">
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground font-sans">
              Você precisa estar autenticado para acessar o painel administrativo.
            </p>
            <Button
              onClick={() => setLocation(LOGIN_PATH)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Fazer Login
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Voltar ao Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredItems = selectedCategory
    ? allItems?.find(cat => cat.id === selectedCategory)?.items || []
    : allItems?.flatMap(cat => cat.items) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-script text-3xl mb-1">{APP_TITLE}</h1>
              <p className="font-sans text-sm opacity-90">Painel Administrativo</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-sans text-sm">
                Olá, {user?.name || "Admin"}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewMenu}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                Ver Menu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* QR Code Section */}
        <section>
          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                QR Code do Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* QR Code Display */}
                <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-lg">
                  <QRCodeComponent
                    id="qrcode-svg"
                    value={menuUrl}
                    size={200}
                    level="H"
                  />
                </div>

                {/* URL and Actions */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label className="font-sans text-sm font-medium">
                      Link Público do Menu
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={menuUrl}
                        className="font-mono text-sm"
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyUrl}
                        title="Copiar URL"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">
                      Escaneie o QR Code ou compartilhe o link para que os clientes acessem o menu digital
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleDownloadQR}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar QR Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleViewMenu}
                      className="gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Visualizar Menu
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Language Settings Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <Languages className="w-6 h-6" />
                Idiomas do Cardápio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-sans">
                  Selecione os idiomas que estarão disponíveis para os clientes no cardápio digital.
                  O idioma Português sempre estará disponível.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {[
                    { code: "pt", name: "Português", flag: "🇵🇹", required: true },
                    { code: "en", name: "English", flag: "🇬🇧", required: false },
                    { code: "es", name: "Español", flag: "🇪🇸", required: false },
                    { code: "fr", name: "Français", flag: "🇫🇷", required: false },
                    { code: "de", name: "Deutsch", flag: "🇩🇪", required: false },
                    { code: "it", name: "Italiano", flag: "🇮🇹", required: false },
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      className={`flex items-center space-x-3 p-3 border rounded-lg ${
                        lang.required ? "bg-muted/50" : ""
                      }`}
                    >
                      <Checkbox
                        id={`lang-${lang.code}`}
                        checked={selectedLanguages.includes(lang.code)}
                        onCheckedChange={(checked) => {
                          if (lang.required) return; // Português sempre ativo
                          
                          if (checked) {
                            setSelectedLanguages([...selectedLanguages, lang.code]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter(l => l !== lang.code));
                          }
                        }}
                        disabled={lang.required || updateActiveLanguages.isPending}
                      />
                      <Label
                        htmlFor={`lang-${lang.code}`}
                        className="flex-1 cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-sans">{lang.name}</span>
                        {lang.required && (
                          <span className="text-xs text-muted-foreground">(obrigatório)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={() => {
                      // Ensure Portuguese is always included
                      const languagesToSave = selectedLanguages.includes("pt")
                        ? selectedLanguages
                        : ["pt", ...selectedLanguages];
                      updateActiveLanguages.mutate({ languages: languagesToSave });
                    }}
                    disabled={updateActiveLanguages.isPending || selectedLanguages.length === 0}
                    className="gap-2"
                  >
                    {updateActiveLanguages.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Languages className="w-4 h-4" />
                        Salvar Idiomas
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Categorias
            </h2>
            <Button 
              size="sm" 
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => toast.info("Funcionalidade em desenvolvimento")}
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCategory === null ? "border-accent border-2" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                <CardContent className="p-4 text-center">
                  <p className="font-sans font-medium">Todas</p>
                  <p className="text-sm text-muted-foreground">
                    {allItems?.reduce((acc, cat) => acc + cat.items.length, 0) || 0} itens
                  </p>
                </CardContent>
              </Card>
              
              {categories?.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id ? "border-accent border-2" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="font-sans font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {allItems?.find(c => c.id === category.id)?.items.length || 0} itens
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Menu Items Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Itens do Cardápio
              {selectedCategory && (
                <span className="text-lg text-muted-foreground ml-2">
                  - {categories?.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </h2>
            <Button 
              size="sm" 
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                setEditingItemId(undefined);
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Novo Item
            </Button>
          </div>

          {itemsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-semibold">
                            {item.name}
                          </h3>
                          {item.isFeatured && (
                            <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <p className="font-sans text-sm text-muted-foreground">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-display font-bold text-accent">
                            {formatPrice(item.price)}
                          </span>
                          
                          {item.isVegetarian && (
                            <span className="text-green-600">🌱 Vegetariano</span>
                          )}
                          {item.isVegan && (
                            <span className="text-green-700">🌿 Vegano</span>
                          )}
                          {item.isGlutenFree && (
                            <span className="text-amber-600">🌾 Sem Glúten</span>
                          )}
                          {item.isSpicy && (
                            <span className="text-red-600">🌶️ Picante</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Availability Toggle */}
                        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                          {item.isAvailable ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <Switch
                            checked={item.isAvailable}
                            onCheckedChange={() => handleToggleAvailability(item.id, item.isAvailable)}
                            disabled={updateAvailability.isPending}
                          />
                          <span className="text-xs font-sans whitespace-nowrap">
                            {item.isAvailable ? "Disponível" : "Esgotado"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setEditingItemId(item.id);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => toast.info("Funcionalidade de exclusão em desenvolvimento")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="font-sans text-muted-foreground">
                  Nenhum item encontrado nesta categoria.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Menu Item Form Modal */}
      {showForm && (
        <MenuItemForm
          itemId={editingItemId}
          onClose={() => {
            setShowForm(false);
            setEditingItemId(undefined);
          }}
          onSuccess={() => {
            utils.menu.getCompleteMenu.invalidate();
          }}
        />
      )}
    </div>
  );
}
