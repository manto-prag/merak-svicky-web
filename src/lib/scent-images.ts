import levandule from "@/assets/scent-levandule.jpg";
import citron from "@/assets/scent-citron.jpg";
import pomeranc from "@/assets/scent-pomeranc.jpg";
import santal from "@/assets/scent-santal.jpg";
import visen from "@/assets/scent-visen.jpg";
import mata from "@/assets/scent-mata.jpg";
import jahoda from "@/assets/scent-jahoda.jpg";
import jasmin from "@/assets/scent-jasmin.jpg";
import malina from "@/assets/scent-malina.jpg";
import skorice from "@/assets/scent-skorice.jpg";

export const scentImages: Record<string, string> = {
  levandule,
  citron,
  pomeranc,
  "santalove-drevo": santal,
  visen,
  mata,
  jahoda,
  jasmin,
  malina,
  skorice,
};

export function scentImage(slug: string): string | undefined {
  return scentImages[slug];
}
