/** Builds a Czech SPAYD payment string that banking apps read from a QR code. */
export function buildSpayd(params: {
  iban: string;
  amount: number;
  variableSymbol: string;
  message: string;
  recipient: string;
}) {
  const sanitize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[*]/g, " ")
      .toUpperCase()
      .slice(0, 35);

  return [
    "SPD*1.0",
    `ACC:${params.iban.replace(/\s/g, "")}`,
    `AM:${params.amount.toFixed(2)}`,
    "CC:CZK",
    `X-VS:${params.variableSymbol.replace(/\D/g, "")}`,
    `MSG:${sanitize(params.message)}`,
    `RN:${sanitize(params.recipient)}`,
  ].join("*");
}
