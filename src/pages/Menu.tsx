import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE, LANGUAGES } from "@/const";
import { trpc } from "@/lib/trpc";
import { Globe, Leaf, Flame, WheatOff, Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import type { LanguageCode } from "@/const";

export default function Menu() {
  const [, params] = useRoute("/menu/:language");
  const [, setLocation] = useLocation();
  const language = (params?.language || "pt") as LanguageCode;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: menu, isLoading } = trpc.menu.getCompleteMenu.useQuery({
    language,
  });

  const handleBackToLanguages = () => {
    setLocation("/menu");
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `€${(priceInCents / 100).toFixed(2)}`;
  };

  const languageName = LANGUAGES.find((l) => l.code === language)?.name || "Português";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLanguages}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{languageName}</span>
            </Button>

            <h1 className="font-script text-2xl md:text-3xl text-primary text-center flex-1">
              {APP_TITLE}
            </h1>

            <div className="w-24" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      {menu && menu.length > 0 && (
        <nav className="sticky top-[73px] z-40 bg-primary/95 backdrop-blur-md shadow-md">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {menu.map((category) => (
                <Button
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  variant={selectedCategory === category.slug ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap text-primary-foreground hover:bg-primary-foreground/20"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Menu Content */}
      <main className="container py-8 space-y-12">
        {menu && menu.length > 0 ? (
          menu.map((category) => (
            <section key={category.id} id={`category-${category.slug}`} className="space-y-6">
              {/* Category Header */}
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {category.name}
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
              </div>

              {/* Menu Items */}
              <div className="grid gap-6 md:grid-cols-2">
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    className={`overflow-hidden transition-all hover:shadow-lg ${
                      !item.isAvailable ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-xl font-semibold text-foreground">
                              {item.name}
                            </h3>
                            {item.isFeatured && (
                              <Star className="w-5 h-5 text-accent fill-accent" />
                            )}
                          </div>
                          {item.description && (
                            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl font-bold text-accent">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Dietary Icons */}
                      <div className="flex flex-wrap gap-2">
                        {item.isVegetarian && (
                          <Badge variant="secondary" className="gap-1">
                            <Leaf className="w-3 h-3" />
                            <span className="text-xs">Vegetariano</span>
                          </Badge>
                        )}
                        {item.isVegan && (
                          <Badge variant="secondary" className="gap-1">
                            <Leaf className="w-3 h-3" />
                            <span className="text-xs">Vegano</span>
                          </Badge>
                        )}
                        {item.isGlutenFree && (
                          <Badge variant="secondary" className="gap-1">
                            <WheatOff className="w-3 h-3" />
                            <span className="text-xs">Sem Glúten</span>
                          </Badge>
                        )}
                        {item.isSpicy && (
                          <Badge variant="destructive" className="gap-1">
                            <Flame className="w-3 h-3" />
                            <span className="text-xs">Picante</span>
                          </Badge>
                        )}
                        {!item.isAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Esgotado
                          </Badge>
                        )}
                      </div>

                      {/* Image if available */}
                      {item.imageUrl && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum item disponível no momento.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container py-6 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            {APP_TITLE} © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
