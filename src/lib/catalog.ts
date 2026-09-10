import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Scent = {
  id: string;
  slug: string;
  name_cs: string;
  name_en: string;
  description_cs: string;
  description_en: string;
  notes_cs: string;
  notes_en: string;
  price_delta: number;
  stock: number;
  sort_order: number;
  recommended_color_slug: string;
};

export type Color = {
  id: string;
  slug: string;
  name_cs: string;
  name_en: string;
  description_cs: string;
  description_en: string;
  hex: string;
  price_delta: number;
  stock: number;
  sort_order: number;
};

export type Packaging = {
  id: string;
  slug: string;
  name_cs: string;
  name_en: string;
  description_cs: string;
  description_en: string;
  price_delta: number;
  stock: number;
  sort_order: number;
  vessel_style: string;
};

export type ShopSettings = {
  base_price: number;
  shipping_price: number;
  personalization_fee: number;
  free_shipping_from: number;
  bank_account: string;
  bank_iban: string;
  bank_holder: string;
  contact_email: string;
  contact_phone: string;
  instagram: string;
};

export type PickupPoint = {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
};

export const scentsQuery = queryOptions({
  queryKey: ["scents"],
  queryFn: async (): Promise<Scent[]> => {
    const { data, error } = await supabase
      .from("scents")
      .select(
        "id, slug, name_cs, name_en, description_cs, description_en, notes_cs, notes_en, price_delta, stock, sort_order, recommended_color_slug",
      )
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const colorsQuery = queryOptions({
  queryKey: ["colors"],
  queryFn: async (): Promise<Color[]> => {
    const { data, error } = await supabase
      .from("colors")
      .select("id, slug, name_cs, name_en, description_cs, description_en, hex, price_delta, stock, sort_order")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const packagingsQuery = queryOptions({
  queryKey: ["packagings"],
  queryFn: async (): Promise<Packaging[]> => {
    const { data, error } = await supabase
      .from("packagings")
      .select("id, slug, name_cs, name_en, description_cs, description_en, price_delta, stock, sort_order, vessel_style")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["shop-settings"],
  queryFn: async (): Promise<ShopSettings> => {
    const { data, error } = await supabase
      .from("shop_settings")
      .select(
        "base_price, shipping_price, personalization_fee, free_shipping_from, bank_account, bank_iban, bank_holder, contact_email, contact_phone, instagram",
      )
      .eq("id", 1)
      .single();
    if (error) throw error;
    return data;
  },
});

export const pickupPointsQuery = queryOptions({
  queryKey: ["pickup-points"],
  queryFn: async (): Promise<PickupPoint[]> => {
    const { data, error } = await supabase
      .from("pickup_points")
      .select("id, name, street, city, zip")
      .order("name");
    if (error) throw error;
    return data ?? [];
  },
});
