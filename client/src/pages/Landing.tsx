import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { APP_TITLE, DEFAULT_MENU_LANGUAGE } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, Globe, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Landing() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const menuPath = useMemo(() => `/menu`, []);

  const menuUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return menuPath;
    }
    return `${window.location.origin}${menuPath}`;
  }, [menuPath]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (submitting) return;
    if (!email || !password) {
      setFormError("Informe email e senha.");
      return;
    }
    setSubmitting(true);
    supabase.auth
      .signInWithPassword({ email, password })
      .then(({ error }) => {
        if (error) {
          setFormError(error.message);
          return;
        }
        toast.success(`Bem-vindo, ${email}!`);
        setEmail("");
        setPassword("");
        setLocation("/admin");
      })
      .catch((error: Error) => {
        setFormError(error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="container max-w-3xl">
        <Card className="bg-card/95 backdrop-blur-sm shadow-2xl border-2 border-accent/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <CardTitle className="font-script text-4xl text-primary">
              {APP_TITLE}
            </CardTitle>
            <CardDescription className="font-display text-lg text-muted-foreground">
              Área Administrativa do Menu Digital
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <p className="font-sans text-sm text-muted-foreground text-center">
                Acesse com suas credenciais para gerenciar o cardápio. Também é possível abrir o menu público pelo link abaixo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                    <label className="font-display text-left text-sm text-muted-foreground" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@exemplo.com"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="font-display text-left text-sm text-muted-foreground" htmlFor="password">
                      Senha
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Sua senha secreta"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={submitting}
                      required
                    />
                  </div>

                  {formError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
            </div>

            <div className="space-y-2">
              <p className="font-display text-sm text-muted-foreground">
                Link público do menu
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  readOnly
                  value={menuUrl}
                  className="font-mono"
                  onFocus={(event) => event.currentTarget.select()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(menuUrl).catch(() => {});
                    }
                    window.open(menuPath, "_blank", "noopener,noreferrer");
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setLocation(menuPath)}
              >
                <Globe className="w-4 h-4" />
                Visualizar menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

