import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ChevronLeft,
  Leaf,
  Flame,
  WheatOff,
  Star,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";

const languageNames: Record<string, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

export default function Menu() {
  const [, params] = useRoute("/menu/:language");
  const [, setLocation] = useLocation();
  const language = (params?.language || "pt") as "pt" | "en" | "es" | "fr" | "de" | "it";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: menu, isLoading } = trpc.menu.getCompleteMenu.useQuery({
    language,
  });

  const handleBackToLanguages = () => {
    setLocation("/menu");
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    // Scroll to category
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `€${(priceInCents / 100).toFixed(2)}`;
  };

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
              <span className="hidden sm:inline">{languageNames[language]}</span>
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
                  key={category.id}
                  variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`
                    whitespace-nowrap font-sans font-medium
                    ${selectedCategory === category.slug 
                      ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                    }
                  `}
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
            <section
              key={category.id}
              id={`category-${category.slug}`}
              className="scroll-mt-32"
            >
              {/* Category Title */}
              <div className="mb-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary border-b-2 border-accent inline-block pb-2">
                  {category.name}
                </h2>
              </div>

              {/* Menu Items */}
              <div className="grid gap-4 md:gap-6">
                {category.items.length > 0 ? (
                  category.items.map((item) => (
                    <Card
                      key={item.id}
                      className={`
                        overflow-hidden transition-all duration-300 hover:shadow-lg
                        ${!item.isAvailable ? "opacity-60" : ""}
                      `}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Image */}
                          {item.imageUrl && (
                            <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-muted overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                            <div className="space-y-2">
                              {/* Title and Icons */}
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                                  {item.name}
                                  {!item.isAvailable && (
                                    <span className="ml-2 text-sm font-sans font-normal text-destructive">
                                      {language === "pt" ? "(Esgotado)" : "(Sold out)"}
                                    </span>
                                  )}
                                </h3>
                                <div className="flex gap-1 flex-shrink-0">
                                  {item.isFeatured && (
                                    <Star className="w-5 h-5 text-accent fill-accent" />
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              {item.description && (
                                <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                                  {item.description}
                                </p>
                              )}

                              {/* Dietary Icons */}
                              <div className="flex gap-3 pt-2">
                                {item.isVegetarian && (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Leaf className="w-4 h-4" />
                                    <span className="font-sans">
                                      {language === "pt" ? "Vegetariano" : "Vegetarian"}
                                    </span>
                                  </div>
                                )}
                                {item.isVegan && (
                                  <div className="flex items-center gap-1 text-xs text-green-700">
                                    <Leaf className="w-4 h-4 fill-current" />
                                    <span className="font-sans">
                                      {language === "pt" ? "Vegano" : "Vegan"}
                                    </span>
                                  </div>
                                )}
                                {item.isGlutenFree && (
                                  <div className="flex items-center gap-1 text-xs text-amber-600">
                                    <WheatOff className="w-4 h-4" />
                                    <span className="font-sans">
                                      {language === "pt" ? "Sem Glúten" : "Gluten Free"}
                                    </span>
                                  </div>
                                )}
                                {item.isSpicy && (
                                  <div className="flex items-center gap-1 text-xs text-red-600">
                                    <Flame className="w-4 h-4" />
                                    <span className="font-sans">
                                      {language === "pt" ? "Picante" : "Spicy"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="mt-4 pt-4 border-t border-border">
                              <span className="font-display text-2xl font-bold text-accent">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="font-sans text-muted-foreground text-center py-8">
                    {language === "pt"
                      ? "Nenhum item disponível nesta categoria."
                      : "No items available in this category."}
                  </p>
                )}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-lg text-muted-foreground">
              {language === "pt"
                ? "Menu em breve disponível."
                : "Menu coming soon."}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary/10 border-t border-border mt-16">
        <div className="container py-8 text-center space-y-2">
          <p className="font-script text-2xl text-primary">{APP_TITLE}</p>
          <p className="font-sans text-sm text-muted-foreground">
            Rua São Pedro, 61, Faro, Portugal
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            +351 926 795 721
          </p>
        </div>
      </footer>
    </div>
  );
}
