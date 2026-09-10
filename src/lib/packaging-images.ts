import tin01 from "@/assets/tins/tin-01.jpg";
import tin02 from "@/assets/tins/tin-02.jpg";
import tin03 from "@/assets/tins/tin-03.jpg";
import tin04 from "@/assets/tins/tin-04.jpg";
import tin05 from "@/assets/tins/tin-05.jpg";
import tin06 from "@/assets/tins/tin-06.jpg";
import tin07 from "@/assets/tins/tin-07.jpg";
import tin08 from "@/assets/tins/tin-08.jpg";
import tin09 from "@/assets/tins/tin-09.jpg";
import tin10 from "@/assets/tins/tin-10.jpg";
import tin11 from "@/assets/tins/tin-11.jpg";
import tin12 from "@/assets/tins/tin-12.jpg";

export const packagingImages: Record<string, string> = {
  "plechovka-01": tin01,
  "plechovka-02": tin02,
  "plechovka-03": tin03,
  "plechovka-04": tin04,
  "plechovka-05": tin05,
  "plechovka-06": tin06,
  "plechovka-07": tin07,
  "plechovka-08": tin08,
  "plechovka-09": tin09,
  "plechovka-10": tin10,
  "plechovka-11": tin11,
  "plechovka-12": tin12,
};

export function packagingImage(slug: string): string | undefined {
  return packagingImages[slug];
}
