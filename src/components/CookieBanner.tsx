import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const KEY = "merak-cookies-ok";

export function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-lg border border-border bg-card p-4 shadow-lift sm:flex sm:items-center sm:gap-4">
      <p className="text-sm text-muted-foreground">
        {t("cookies.text")}{" "}
        <Link to="/cookies" className="underline underline-offset-4 hover:text-foreground">
          {t("cookies.more")}
        </Link>
      </p>
      <Button
        className="mt-3 w-full sm:mt-0 sm:w-auto"
        onClick={() => {
          window.localStorage.setItem(KEY, "1");
          setVisible(false);
        }}
      >
        {t("cookies.accept")}
      </Button>
    </div>
  );
}
