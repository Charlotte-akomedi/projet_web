import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (all: boolean) => {
    const data = all ? { necessary: true, analytics: true, marketing: true } : prefs;
    localStorage.setItem("cookie-consent", JSON.stringify(data));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-card border-t shadow-lg animate-fade-in">
      <div className="container max-w-4xl">
        <div className="flex items-start gap-3 mb-3">
          <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez personnaliser vos préférences ci-dessous.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked disabled className="accent-primary" /> Nécessaires
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))} className="accent-primary" />
            Analytiques
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={prefs.marketing} onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))} className="accent-primary" />
            Marketing
          </label>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => accept(true)}>Tout accepter</Button>
          <Button size="sm" variant="outline" onClick={() => accept(false)}>Enregistrer mes choix</Button>
        </div>
      </div>
    </div>
  );
}
