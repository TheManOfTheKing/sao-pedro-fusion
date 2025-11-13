import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { Globe } from "lucide-react";
import { useLocation } from "wouter";

const allLanguages = [
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export default function LanguageSelector() {
  const [, setLocation] = useLocation();
  const { data: activeLanguages, isLoading } = trpc.menu.getActiveLanguages.useQuery();
  
  // Filter languages to show only active ones
  const languages = allLanguages.filter(lang => 
    activeLanguages?.includes(lang.code) ?? true // Default to all if not loaded yet
  );

  const handleLanguageSelect = (languageCode: string) => {
    setLocation(`/menu/${languageCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <Card className="bg-card/95 backdrop-blur-sm shadow-2xl border-2 border-accent/20">
          <div className="p-8 md:p-12 text-center space-y-8">
            {/* Logo/Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <Globe className="w-10 h-10 text-accent-foreground" />
                </div>
              </div>
              <h1 className="font-script text-4xl md:text-5xl text-primary">
                {APP_TITLE}
              </h1>
              <p className="font-display text-lg md:text-xl text-muted-foreground">
                Fusion Restaurant
              </p>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Bem-vindo • Welcome • Bienvenido
              </h2>
              <p className="font-sans text-sm md:text-base text-muted-foreground">
                Selecione seu idioma • Choose your language
              </p>
            </div>

            {/* Language Buttons */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : languages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {languages.map((language) => (
                <Button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  variant="outline"
                  size="lg"
                  className="h-auto py-6 px-6 border-2 hover:border-accent hover:bg-accent/10 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {language.flag}
                    </span>
                    <span className="font-sans text-lg font-medium text-left flex-1">
                      {language.name}
                    </span>
                  </div>
                </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum idioma disponível no momento.</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-border">
              <p className="font-sans text-xs text-muted-foreground">
                Especialidades da cozinha portuguesa e brasileira
                <br />
                Pinseria Romana
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
