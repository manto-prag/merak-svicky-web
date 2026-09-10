import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useI18n } from "@/lib/i18n";
import { COMPANY } from "@/lib/company";

const paymentSpayd = `SPD*1.0*ACC:${COMPANY.iban}*CC:CZK*RN:SVICKY MERAK*MSG:SVICKY MERAK`;

export function FooterQrCodes() {
  const { t } = useI18n();
  const [webQr, setWebQr] = useState<string | null>(null);
  const [payQr, setPayQr] = useState<string | null>(null);

  useEffect(() => {
    const options = { margin: 1, width: 320 } as const;
    void QRCode.toDataURL(COMPANY.webUrl, options).then(setWebQr);
    void QRCode.toDataURL(paymentSpayd, options).then(setPayQr);
  }, []);

  return (
    <div className="flex flex-wrap gap-8">
      <figure className="text-center">
        {webQr && (
          <img
            src={webQr}
            alt={`QR kód s odkazem na ${COMPANY.web}`}
            className="size-28 rounded-lg border border-border bg-background p-2"
            loading="lazy"
          />
        )}
        <figcaption className="mt-2 text-xs text-muted-foreground">{t("footer.qr.web")}</figcaption>
      </figure>
      <figure className="text-center">
        {payQr && (
          <img
            src={payQr}
            alt={`Platební QR kód na účet ${COMPANY.bankAccount}`}
            className="size-28 rounded-lg border border-border bg-background p-2"
            loading="lazy"
          />
        )}
        <figcaption className="mt-2 text-xs text-muted-foreground">{t("footer.qr.pay")}</figcaption>
        <p className="mt-1 text-xs text-muted-foreground">{COMPANY.bankAccount}</p>
      </figure>
    </div>
  );
}
