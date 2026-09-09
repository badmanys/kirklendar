# 🗓️ Kirklendář — Minimalistický Event Tracker

> Stylová webová aplikace (SPA) pro správu akcí party s velkým kalendářem v prémiovém Dark SaaS designu a PIN ochranou.

---

## 🎨 Design & Estetika
- **Tmavý režim:** `#09090b` (hluboká černá) s jemnými radiálními akcenty a kartami `#111115`.
- **Primární akcent:** Lososově červená `#ff4359` s neonovým glow stínováním.
- **Typografie:** Moderní sans-serif (Inter) s podporou `tabular-nums` pro přehledné formátování časů.
- **Komponenty:** Stylizováno ve stylu shadcn/ui a Tailwind CSS.

---

## ✨ Hlavní funkce

1. 🔒 **Gatekeeper / Lock Screen**
   - Vstup chráněn 4místným PIN kódem (`6969`).
   - Shake animace při chybném zadání, automatické odemčení při správném kódu.
   - Trvalé přihlášení uložené v `localStorage`, možnost rychlého odhlášení (zámku) v hlavičce.

2. 📅 **Dominantní velký kalendář**
   - Měsíční zobrazení (Po–Ne) s minimální výškou buněk 125px+.
   - Zvýraznění dnešního dne červeným neonovým kroužkem.
   - Kliknutí do volného místa otevře vytvoření akce s předvyplněným datem.
   - Kompaktní čipy akcí s časem, zkráceným názvem a iniciálami účastníků.
   - Indikátor `+X dalších` při větším množství akcí s detailním náhledem dne.

3. 👥 **Filtrování podle účastníků**
   - Předdefinovaní členové party: **Adam, Míša, Šárka, Lucka, Lukáš, Ondra**.
   - Kliknutím na člena se okamžitě vyfiltrují pouze jeho akce v kalendáři i postranním panelu.

4. ⏳ **Nadcházející akce s odpočtem**
   - Chronologicky seřazený seznam s inteligentním odpočtem (*„Dnes v 18:00“*, *„Zítra“*, *„Za 2 dny“*).
   - Ikonky lokace a barevné štítky všech účastníků.

5. 🔍 **Globální vyhledávání (⌘K / Ctrl+K)**
   - Rychlé fulltextové hledání napříč názvy akcí, místy, účastníky i daty.

6. 💾 **Čistá databáze & LocalStorage perzistence**
   - Startuje s čistou databází bez fiktivních dat.
   - Všechny vytvořené akce se ukládají lokálně v prohlížeči.

---

## 🛠️ Spuštění projektu

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Produkční build
npm run build
```
