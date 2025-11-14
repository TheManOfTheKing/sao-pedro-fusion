import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_TITLE, LANGUAGES } from "@/const";
import { trpc } from "@/lib/trpc";
import { useSupabaseAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Leaf, Flame, WheatOff, Star, LogOut, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import MenuItemForm from "@/components/MenuItemForm";
import type { LanguageCode } from "@/const";

export default function Admin() {
  const { user, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | undefined>(undefined);

  const { data: categories } = trpc.menu.getCategories.useQuery({ language: "pt" });
  const { data: allItems, isLoading: itemsLoading } = trpc.menu.getCompleteMenu.useQuery({
    language: "pt",
  });

  const { 
    data: activeLanguages, 
    isLoading: languagesLoading,
    error: languagesError 
  } = trpc.admin.getActiveLanguages.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(["pt"]);

  const utils = trpc.useUtils();

  // Sync selectedLanguages with activeLanguages when they load
  useEffect(() => {
    if (activeLanguages && activeLanguages.length > 0) {
      setSelectedLanguages(activeLanguages as LanguageCode[]);
    } else if (!languagesLoading && activeLanguages === undefined) {
      // If query completed but no data, ensure we have at least Portuguese
      if (selectedLanguages.length === 0) {
        setSelectedLanguages(["pt"]);
      }
    }
  }, [activeLanguages, languagesLoading, selectedLanguages]);

  // Show error if query fails
  useEffect(() => {
    if (languagesError) {
      // Ensure we have at least Portuguese on error
      if (selectedLanguages.length === 0) {
        setSelectedLanguages(["pt"]);
      }
    }
  }, [languagesError, selectedLanguages.length]);

  const updateAvailability = trpc.admin.updateAvailability.useMutation({
    onSuccess: () => {
      toast.success("Disponibilidade atualizada!");
      utils.menu.getCompleteMenu.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteItem = trpc.admin.deleteMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Item excluído com sucesso!");
      utils.menu.getCompleteMenu.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const updateActiveLanguages = trpc.admin.updateActiveLanguages.useMutation({
    onSuccess: () => {
      toast.success("Idiomas atualizados com sucesso!");
      utils.admin.getActiveLanguages.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar idiomas: ${error.message}`);
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

  const handleEdit = (itemId: number) => {
    setEditingItemId(itemId);
    setShowForm(true);
  };

  const handleDelete = (itemId: number, itemName: string) => {
    if (confirm(`Tem certeza que deseja excluir "${itemName}"?`)) {
      deleteItem.mutate({ id: itemId });
    }
  };

  const handleNewItem = () => {
    setEditingItemId(undefined);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItemId(undefined);
    utils.menu.getCompleteMenu.invalidate();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      setLocation("/");
    } catch (error: any) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleLanguageToggle = (languageCode: LanguageCode) => {
    const newLanguages = selectedLanguages.includes(languageCode)
      ? selectedLanguages.filter((lang) => lang !== languageCode)
      : [...selectedLanguages, languageCode];

    // Ensure at least one language is selected
    if (newLanguages.length === 0) {
      toast.error("Pelo menos um idioma deve estar ativo");
      return;
    }

    // Optimistically update UI
    const previousLanguages = selectedLanguages;
    setSelectedLanguages(newLanguages);
    updateActiveLanguages.mutate(
      { languages: newLanguages },
      {
        onError: (error) => {
          // Revert on error
          setSelectedLanguages(previousLanguages);
          toast.error(`Erro ao atualizar idiomas: ${error.message}`);
        },
      }
    );
  };

  const filteredItems = selectedCategory
    ? allItems?.find((cat) => cat.id === selectedCategory)?.items || []
    : allItems?.flatMap((cat) => cat.items) || [];

  // Safety check: ensure we always have selectedLanguages
  useEffect(() => {
    if (!selectedLanguages || selectedLanguages.length === 0) {
      setSelectedLanguages(["pt"]);
    }
  }, [selectedLanguages]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary">
            {APP_TITLE} - Painel Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLocation("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Language Settings Card - Only show if query is enabled and not in critical error */}
        {user && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Idiomas Ativos</CardTitle>
                  <CardDescription>
                    Selecione os idiomas que estarão disponíveis no menu público
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {languagesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : languagesError ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Funcionalidade de idiomas temporariamente indisponível. Usando configuração padrão (Português).
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        utils.admin.getActiveLanguages.invalidate();
                      } catch (error) {
                        console.error('[Admin] Error invalidating query:', error);
                      }
                    }}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {LANGUAGES.map((language) => {
                    const isSelected = selectedLanguages.includes(language.code);
                    return (
                      <div
                        key={language.code}
                        className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          try {
                            handleLanguageToggle(language.code);
                          } catch (error) {
                            console.error('[Admin] Error toggling language:', error);
                            toast.error('Erro ao atualizar idioma');
                          }
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            try {
                              handleLanguageToggle(language.code);
                            } catch (error) {
                              console.error('[Admin] Error toggling language:', error);
                              toast.error('Erro ao atualizar idioma');
                            }
                          }}
                          disabled={updateActiveLanguages.isPending}
                        />
                        <label className="text-sm font-medium cursor-pointer flex-1">
                          <span className="mr-2">{language.flag}</span>
                          {language.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={handleNewItem} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItemId ? "Editar Item" : "Novo Item do Menu"}
                </DialogTitle>
              </DialogHeader>
              <MenuItemForm
                itemId={editingItemId}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Items List */}
        {itemsLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Item Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-semibold">{item.name}</h3>
                        {item.isFeatured && <Star className="w-5 h-5 text-accent fill-accent" />}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {item.isVegetarian && (
                          <Badge variant="secondary" className="gap-1">
                            <Leaf className="w-3 h-3" />
                            Vegetariano
                          </Badge>
                        )}
                        {item.isVegan && (
                          <Badge variant="secondary" className="gap-1">
                            <Leaf className="w-3 h-3" />
                            Vegano
                          </Badge>
                        )}
                        {item.isGlutenFree && (
                          <Badge variant="secondary" className="gap-1">
                            <WheatOff className="w-3 h-3" />
                            Sem Glúten
                          </Badge>
                        )}
                        {item.isSpicy && (
                          <Badge variant="destructive" className="gap-1">
                            <Flame className="w-3 h-3" />
                            Picante
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-accent">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.isAvailable ? "Disponível" : "Esgotado"}
                        </span>
                        <Switch
                          checked={item.isAvailable}
                          onCheckedChange={() =>
                            handleToggleAvailability(item.id, item.isAvailable)
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum item encontrado.</p>
              <Button onClick={handleNewItem} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Primeiro Item
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
