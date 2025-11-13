import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { X, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MenuItemFormProps {
  itemId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  categoryId: number;
  namePt: string;
  descriptionPt: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
}

interface Translation {
  language: string;
  name: string;
  description: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
];

export default function MenuItemForm({ itemId, onClose, onSuccess }: MenuItemFormProps) {
  const isEditing = !!itemId;

  const [formData, setFormData] = useState<FormData>({
    categoryId: 1,
    namePt: "",
    descriptionPt: "",
    price: 0,
    imageUrl: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    isFeatured: false,
    isAvailable: true,
  });

  const [translations, setTranslations] = useState<Translation[]>(
    languages.map(lang => ({ language: lang.code, name: "", description: "" }))
  );

  const { data: categories } = trpc.menu.getCategories.useQuery();
  const { data: existingItem } = trpc.admin.getMenuItem.useQuery(
    { itemId: itemId! },
    { enabled: isEditing }
  );

  const createItem = trpc.admin.createMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Item criado com sucesso!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar item: ${error.message}`);
    },
  });

  const updateItem = trpc.admin.updateMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Item atualizado com sucesso!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar item: ${error.message}`);
    },
  });

  useEffect(() => {
    if (existingItem) {
      setFormData({
        categoryId: existingItem.categoryId,
        namePt: existingItem.namePt,
        descriptionPt: existingItem.descriptionPt || "",
        price: existingItem.price,
        imageUrl: existingItem.imageUrl || "",
        isVegetarian: !!existingItem.isVegetarian,
        isVegan: !!existingItem.isVegan,
        isGlutenFree: !!existingItem.isGlutenFree,
        isSpicy: !!existingItem.isSpicy,
        isFeatured: !!existingItem.isFeatured,
        isAvailable: !!existingItem.isAvailable,
      });

      // Load existing translations
      if (existingItem.translations) {
        const translationsMap = new Map(
          existingItem.translations.map((t: any) => [t.language, t])
        );
        setTranslations(
          languages.map(lang => {
            const trans = translationsMap.get(lang.code) as any;
            return {
              language: lang.code,
              name: trans?.name || "",
              description: trans?.description || "",
            };
          })
        );
      }
    }
  }, [existingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namePt.trim()) {
      toast.error("Nome do item é obrigatório");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    const itemData = {
      ...formData,
      translations: translations.filter(t => t.name.trim() !== ""),
    };

    if (isEditing) {
      updateItem.mutate({ itemId: itemId!, ...itemData });
    } else {
      createItem.mutate(itemData);
    }
  };

  const handleTranslationChange = (
    languageCode: string,
    field: "name" | "description",
    value: string
  ) => {
    setTranslations(prev =>
      prev.map(t =>
        t.language === languageCode ? { ...t, [field]: value } : t
      )
    );
  };

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-2xl">
            {isEditing ? "Editar Item" : "Novo Item"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isPending}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="translations">Traduções</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name (PT) */}
                <div className="space-y-2">
                  <Label htmlFor="namePt">Nome (Português) *</Label>
                  <Input
                    id="namePt"
                    value={formData.namePt}
                    onChange={(e) =>
                      setFormData({ ...formData, namePt: e.target.value })
                    }
                    placeholder="Ex: Bacalhau à Brás"
                    required
                  />
                </div>

                {/* Description (PT) */}
                <div className="space-y-2">
                  <Label htmlFor="descriptionPt">Descrição (Português)</Label>
                  <Textarea
                    id="descriptionPt"
                    value={formData.descriptionPt}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionPt: e.target.value })
                    }
                    placeholder="Descreva o prato..."
                    rows={3}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price / 100}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Math.round(parseFloat(e.target.value) * 100),
                      })
                    }
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor em euros (ex: 12.50)
                  </p>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole o link de uma imagem hospedada online
                  </p>
                </div>

                {/* Dietary Options */}
                <div className="space-y-3">
                  <Label>Opções Alimentares</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="vegetarian" className="cursor-pointer flex-1">
                        🌱 Vegetariano
                      </Label>
                      <Switch
                        id="vegetarian"
                        checked={formData.isVegetarian}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isVegetarian: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="vegan" className="cursor-pointer flex-1">
                        🌿 Vegano
                      </Label>
                      <Switch
                        id="vegan"
                        checked={formData.isVegan}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isVegan: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="glutenFree" className="cursor-pointer flex-1">
                        🌾 Sem Glúten
                      </Label>
                      <Switch
                        id="glutenFree"
                        checked={formData.isGlutenFree}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isGlutenFree: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="spicy" className="cursor-pointer flex-1">
                        🌶️ Picante
                      </Label>
                      <Switch
                        id="spicy"
                        checked={formData.isSpicy}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isSpicy: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Status Options */}
                <div className="space-y-3">
                  <Label>Status</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="featured" className="cursor-pointer flex-1">
                        ⭐ Item em Destaque
                      </Label>
                      <Switch
                        id="featured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isFeatured: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                      <Label htmlFor="available" className="cursor-pointer flex-1">
                        ✅ Disponível
                      </Label>
                      <Switch
                        id="available"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isAvailable: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="translations" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Adicione traduções para os idiomas disponíveis no menu. Deixe em branco
                  para usar o texto em português.
                </p>

                {languages.map((lang) => {
                  const translation = translations.find(t => t.language === lang.code);
                  return (
                    <Card key={lang.code}>
                      <CardHeader>
                        <CardTitle className="text-lg font-sans">
                          {lang.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${lang.code}`}>Nome</Label>
                          <Input
                            id={`name-${lang.code}`}
                            value={translation?.name || ""}
                            onChange={(e) =>
                              handleTranslationChange(lang.code, "name", e.target.value)
                            }
                            placeholder={`Nome em ${lang.name}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`desc-${lang.code}`}>Descrição</Label>
                          <Textarea
                            id={`desc-${lang.code}`}
                            value={translation?.description || ""}
                            onChange={(e) =>
                              handleTranslationChange(
                                lang.code,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder={`Descrição em ${lang.name}`}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Atualizar" : "Criar"} Item
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
