import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LANGUAGES } from "@/const";

interface MenuItemFormProps {
  itemId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MenuItemForm({ itemId, onSuccess, onCancel }: MenuItemFormProps) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [namePt, setNamePt] = useState("");
  const [descriptionPt, setDescriptionPt] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Translations state
  const [translations, setTranslations] = useState<
    Record<string, { name: string; description: string }>
  >({
    en: { name: "", description: "" },
    es: { name: "", description: "" },
    fr: { name: "", description: "" },
    de: { name: "", description: "" },
    it: { name: "", description: "" },
  });

  const { data: categories } = trpc.menu.getCategories.useQuery({ language: "pt" });
  const { data: itemData, isLoading: loadingItem } = trpc.admin.getItemWithTranslations.useQuery(
    { id: itemId! },
    { enabled: !!itemId }
  );

  const createMutation = trpc.admin.createMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Item criado com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao criar item: ${error.message}`);
    },
  });

  const updateMutation = trpc.admin.updateMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Item atualizado com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar item: ${error.message}`);
    },
  });

  // Load existing item data
  useEffect(() => {
    if (itemData) {
      const { item, translations: itemTranslations } = itemData;
      setCategoryId(item.category_id.toString());
      setNamePt(item.name_pt);
      setDescriptionPt(item.description_pt || "");
      setPrice((item.price / 100).toFixed(2));
      setImageUrl(item.image_url || "");
      setIsVegetarian(item.is_vegetarian);
      setIsVegan(item.is_vegan);
      setIsGlutenFree(item.is_gluten_free);
      setIsSpicy(item.is_spicy);
      setIsFeatured(item.is_featured);
      setIsAvailable(item.is_available);

      // Load translations
      const translationsMap: Record<string, { name: string; description: string }> = {
        en: { name: "", description: "" },
        es: { name: "", description: "" },
        fr: { name: "", description: "" },
        de: { name: "", description: "" },
        it: { name: "", description: "" },
      };

      itemTranslations.forEach((trans) => {
        if (trans.language !== "pt") {
          if (!translationsMap[trans.language]) {
            translationsMap[trans.language] = { name: "", description: "" };
          }
          if (trans.field_name === "name") {
            translationsMap[trans.language].name = trans.translated_text;
          } else if (trans.field_name === "description") {
            translationsMap[trans.language].description = trans.translated_text;
          }
        }
      });

      setTranslations(translationsMap);
    }
  }, [itemData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || !namePt || !price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const priceInCents = Math.round(parseFloat(price) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Preço inválido");
      return;
    }

    // Prepare translations array
    const translationsArray = Object.entries(translations)
      .filter(([, value]) => value.name || value.description)
      .map(([lang, value]) => ({
        language: lang as "en" | "es" | "fr" | "de" | "it",
        name: value.name || undefined,
        description: value.description || undefined,
      }));

    const data = {
      categoryId: parseInt(categoryId),
      namePt,
      descriptionPt: descriptionPt || undefined,
      price: priceInCents,
      imageUrl: imageUrl || undefined,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isSpicy,
      isFeatured,
      isAvailable,
      translations: translationsArray.length > 0 ? translationsArray : undefined,
    };

    if (itemId) {
      updateMutation.mutate({ id: itemId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleTranslationChange = (
    lang: string,
    field: "name" | "description",
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  if (loadingItem) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
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
            <Select value={categoryId} onValueChange={setCategoryId}>
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

          {/* Name PT */}
          <div className="space-y-2">
            <Label htmlFor="namePt">Nome (Português) *</Label>
            <Input
              id="namePt"
              value={namePt}
              onChange={(e) => setNamePt(e.target.value)}
              placeholder="Ex: Bacalhau à Brás"
              required
            />
          </div>

          {/* Description PT */}
          <div className="space-y-2">
            <Label htmlFor="descriptionPt">Descrição (Português)</Label>
            <Textarea
              id="descriptionPt"
              value={descriptionPt}
              onChange={(e) => setDescriptionPt(e.target.value)}
              placeholder="Descrição detalhada do prato..."
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="12.50"
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* Dietary Options */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Opções Alimentares</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vegetarian" className="cursor-pointer">
                  🌱 Vegetariano
                </Label>
                <Switch
                  id="vegetarian"
                  checked={isVegetarian}
                  onCheckedChange={setIsVegetarian}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vegan" className="cursor-pointer">
                  🌿 Vegano
                </Label>
                <Switch id="vegan" checked={isVegan} onCheckedChange={setIsVegan} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="glutenFree" className="cursor-pointer">
                  🌾 Sem Glúten
                </Label>
                <Switch
                  id="glutenFree"
                  checked={isGlutenFree}
                  onCheckedChange={setIsGlutenFree}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="spicy" className="cursor-pointer">
                  🌶️ Picante
                </Label>
                <Switch id="spicy" checked={isSpicy} onCheckedChange={setIsSpicy} />
              </div>
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="cursor-pointer">
                  ⭐ Item em Destaque
                </Label>
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available" className="cursor-pointer">
                  ✅ Disponível
                </Label>
                <Switch
                  id="available"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="translations" className="space-y-6 mt-4">
          {LANGUAGES.filter((l) => l.code !== "pt").map((lang) => (
            <div key={lang.code} className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-2xl">{lang.flag}</span>
                {lang.name}
              </h3>
              <div className="space-y-2">
                <Label htmlFor={`name-${lang.code}`}>Nome</Label>
                <Input
                  id={`name-${lang.code}`}
                  value={translations[lang.code]?.name || ""}
                  onChange={(e) => handleTranslationChange(lang.code, "name", e.target.value)}
                  placeholder={`Nome em ${lang.name}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`desc-${lang.code}`}>Descrição</Label>
                <Textarea
                  id={`desc-${lang.code}`}
                  value={translations[lang.code]?.description || ""}
                  onChange={(e) =>
                    handleTranslationChange(lang.code, "description", e.target.value)
                  }
                  placeholder={`Descrição em ${lang.name}`}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : itemId ? (
            "Atualizar Item"
          ) : (
            "Criar Item"
          )}
        </Button>
      </div>
    </form>
  );
}
