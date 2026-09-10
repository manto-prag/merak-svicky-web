-- roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- catalog
CREATE TABLE public.scents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_cs text NOT NULL, name_en text NOT NULL,
  description_cs text NOT NULL DEFAULT '', description_en text NOT NULL DEFAULT '',
  notes_cs text NOT NULL DEFAULT '', notes_en text NOT NULL DEFAULT '',
  price_delta integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_cs text NOT NULL, name_en text NOT NULL,
  description_cs text NOT NULL DEFAULT '', description_en text NOT NULL DEFAULT '',
  hex text NOT NULL DEFAULT '#f0e4db',
  price_delta integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packagings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_cs text NOT NULL, name_en text NOT NULL,
  description_cs text NOT NULL DEFAULT '', description_en text NOT NULL DEFAULT '',
  price_delta integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  image_url text,
  vessel_style text NOT NULL DEFAULT 'glass',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pickup_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  street text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  zip text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shop_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  base_price integer NOT NULL DEFAULT 349,
  shipping_price integer NOT NULL DEFAULT 79,
  personalization_fee integer NOT NULL DEFAULT 30,
  free_shipping_from integer NOT NULL DEFAULT 1500,
  bank_account text NOT NULL DEFAULT '2801234567/2010',
  bank_iban text NOT NULL DEFAULT 'CZ6520100000002801234567',
  bank_holder text NOT NULL DEFAULT 'MERAK svíčky s.r.o.',
  contact_email text NOT NULL DEFAULT 'ahoj@meraksvicky.cz',
  contact_phone text NOT NULL DEFAULT '+420 777 123 456',
  instagram text NOT NULL DEFAULT 'https://instagram.com/meraksvicky',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  pickup_point text NOT NULL,
  note text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'cs',
  status text NOT NULL DEFAULT 'new',
  items_total integer NOT NULL DEFAULT 0,
  shipping_total integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  tracking_number text,
  paid_at timestamptz,
  shipped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  scent_id uuid REFERENCES public.scents(id),
  color_id uuid REFERENCES public.colors(id),
  packaging_id uuid REFERENCES public.packagings(id),
  scent_name_cs text NOT NULL, scent_name_en text NOT NULL,
  color_name_cs text NOT NULL, color_name_en text NOT NULL,
  color_hex text NOT NULL DEFAULT '#f0e4db',
  packaging_name_cs text NOT NULL, packaging_name_en text NOT NULL,
  message text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL DEFAULT 0,
  line_total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE SEQUENCE public.order_number_seq START 1001;
GRANT USAGE ON SEQUENCE public.order_number_seq TO service_role;

CREATE TRIGGER scents_updated BEFORE UPDATE ON public.scents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER colors_updated BEFORE UPDATE ON public.colors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER packagings_updated BEFORE UPDATE ON public.packagings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- grants
GRANT SELECT ON public.scents, public.colors, public.packagings, public.pickup_points, public.shop_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.scents, public.colors, public.packagings, public.pickup_points, public.shop_settings TO authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.scents, public.colors, public.packagings, public.pickup_points, public.shop_settings, public.orders, public.order_items TO service_role;

ALTER TABLE public.scents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packagings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active scents" ON public.scents FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage scents" ON public.scents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "public read active colors" ON public.colors FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage colors" ON public.colors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "public read active packagings" ON public.packagings FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage packagings" ON public.packagings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "public read pickup points" ON public.pickup_points FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage pickup points" ON public.pickup_points FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "public read settings" ON public.shop_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.shop_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- seed
INSERT INTO public.shop_settings (id) VALUES (1);

INSERT INTO public.scents (slug, name_cs, name_en, description_cs, description_en, notes_cs, notes_en, price_delta, stock, sort_order) VALUES
('vanilka','Vanilka & Tonka','Vanilla & Tonka','Krémová vanilka s teplými tonka boby. Sladká, ale nikdy ne těžká.','Creamy vanilla with warm tonka beans. Sweet, yet never heavy.','vanilka, tonka, karamel','vanilla, tonka, caramel',0,40,1),
('levandule','Levandule z Provence','Provence Lavender','Uklidňující levandulové pole za soumraku.','Calming lavender fields at dusk.','levandule, bylinky, dřevo','lavender, herbs, wood',0,40,2),
('bila-kava','Bílá káva','White Coffee','Ranní espresso s mlékem a špetkou skořice.','Morning espresso with milk and a pinch of cinnamon.','káva, mléko, skořice','coffee, milk, cinnamon',20,30,3),
('pivonka','Pivoňka & Pižmo','Peony & Musk','Rozkvetlá pivoňka zjemněná bílým pižmem.','Blooming peony softened with white musk.','pivoňka, růže, pižmo','peony, rose, musk',20,30,4),
('figa','Fíky & Cedr','Fig & Cedar','Zelené fíky a suché cedrové dřevo.','Green figs and dry cedar wood.','fík, cedr, zeleň','fig, cedar, greenery',20,30,5),
('citrus','Citrus & Bazalka','Citrus & Basil','Svěží bergamot s čerstvou bazalkou.','Fresh bergamot with garden basil.','bergamot, citron, bazalka','bergamot, lemon, basil',0,40,6),
('kokos','Kokos & Vanilkový krém','Coconut Cream','Krémový kokos jako dovolená u moře.','Creamy coconut like a seaside holiday.','kokos, mandle, vanilka','coconut, almond, vanilla',0,40,7),
('santal','Santalové dřevo','Sandalwood','Hluboké, teplé dřevo s ambrou.','Deep, warm wood with amber.','santal, ambra, kůže','sandalwood, amber, leather',30,25,8),
('skorice','Skořice & Pomeranč','Cinnamon & Orange','Vánoční klasika po celý rok.','A Christmas classic all year round.','skořice, pomeranč, hřebíček','cinnamon, orange, clove',20,30,9),
('cista-bavlna','Čistá bavlna','Clean Cotton','Vůně čerstvě vypraného prádla na slunci.','Freshly washed linen drying in the sun.','bavlna, mýdlo, konvalinka','cotton, soap, lily',0,40,10);

INSERT INTO public.colors (slug, name_cs, name_en, description_cs, description_en, hex, price_delta, stock, sort_order) VALUES
('smetanova','Smetanová','Cream','Nadčasová přírodní bílá.','Timeless natural white.','#f7efe4',0,50,1),
('pudrova','Pudrová růžová','Powder Pink','Jemná, dívčí, romantická.','Soft, feminine, romantic.','#e8bfc2',0,50,2),
('bezova','Béžová','Beige','Teplá neutrální klasika.','Warm neutral classic.','#e2cdb4',0,50,3),
('terakota','Terakota','Terracotta','Zemitá pálená hlína.','Earthy burnt clay.','#c4795c',0,40,4),
('salvej','Šalvějová','Sage','Klidná zelená s šedým nádechem.','Calm green with a grey touch.','#a9b79c',0,40,5),
('karamel','Karamelová','Caramel','Sladce hnědá, útulná.','Sweet brown, cosy.','#b98a5e',0,40,6),
('cokoladova','Čokoládová','Chocolate','Hluboká teplá hnědá.','Deep warm brown.','#6b4f3f',0,40,7),
('levandulova','Levandulová','Lavender','Zasněná světle fialová.','Dreamy pale purple.','#c3b5d6',20,30,8),
('perlova','Perleťově zlatá','Pearl Gold','Jemný zlatý třpyt.','Subtle golden shimmer.','#d8c08a',30,25,9),
('uhlova','Uhlová','Charcoal','Elegantní tmavě šedá.','Elegant dark grey.','#4a4643',20,30,10);

INSERT INTO public.packagings (slug, name_cs, name_en, description_cs, description_en, price_delta, stock, sort_order, vessel_style) VALUES
('sklo-cire','Čiré sklo','Clear Glass','Klasická sklenice, 180 ml.','Classic tumbler, 180 ml.',0,60,1,'glass'),
('sklo-matne','Matné sklo','Frosted Glass','Pískované sklo s hebkým povrchem.','Sandblasted glass with a soft touch.',40,50,2,'frosted'),
('keramika-bila','Bílá keramika','White Ceramic','Ručně glazovaná keramika.','Hand-glazed ceramic vessel.',80,40,3,'ceramic'),
('keramika-ryhovana','Rýhovaná keramika','Ribbed Ceramic','Vroubkovaný povrch, matná glazura.','Fluted surface, matte glaze.',110,30,4,'ribbed'),
('plechovka','Cestovní plechovka','Travel Tin','Praktická plechovka s víčkem.','Handy tin with a lid.',0,60,5,'tin'),
('beton','Betonová nádoba','Concrete Vessel','Minimalistický beton.','Minimalist concrete.',120,25,6,'concrete'),
('amber-sklo','Ambrové sklo','Amber Glass','Jantarové sklo s dřevěným víčkem.','Amber glass with wooden lid.',90,35,7,'amber'),
('darkova-krabice','Dárková krabice','Gift Box','Sklenice v dárkové krabičce se stuhou.','Tumbler in a ribboned gift box.',150,30,8,'giftbox'),
('lnene-baleni','Lněný pytlík','Linen Pouch','Sklenice v ručně šitém lněném pytlíku.','Tumbler in a hand-sewn linen pouch.',120,30,9,'linen'),
('duo-set','Duo set','Duo Set','Dvě mini svíčky v dárkové sadě.','Two mini candles in a gift set.',180,20,10,'duo');

INSERT INTO public.pickup_points (name, street, city, zip) VALUES
('Z-BOX Praha – Anděl','Nádražní 762/32','Praha 5','150 00'),
('Zásilkovna – Praha, Vinohradská','Vinohradská 1200/56','Praha 2','120 00'),
('Zásilkovna – Brno, Masarykova','Masarykova 8','Brno','602 00'),
('Z-BOX Ostrava – Nová Karolina','Jantarová 3344/4','Ostrava','702 00'),
('Zásilkovna – Plzeň, Americká','Americká 42','Plzeň','301 00'),
('Zásilkovna – Olomouc, Horní náměstí','Horní náměstí 12','Olomouc','779 00'),
('Zásilkovna – Liberec, Pražská','Pražská 14','Liberec','460 01'),
('Zásilkovna – České Budějovice','Lannova 63/2','České Budějovice','370 01');