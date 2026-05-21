# /humeur

**L'humeur du boss** — fonctionnalité comm/marque portée par Apollon-Marketing.

Clients scannent un QR → votent l'humeur de Cédric (0-4) → résultat affiché en direct sur la TV cuisine et iframable sur le site public.

## Pages servies (statiques)

- `/humeur/` — page de vote mobile
- `/humeur/tv.html` — slide TV cuisine plein écran (auto-refresh 20 s)
- `/humeur/widget.html` — bandeau iframable

## Backend

Supabase `xjlpttrziisldlclhsth` (`inventaire-labrassee`) :

- Tables `humeur_votes`, `humeur_boss_etat`, vue `humeur_boss_jour`
- Edge Functions `humeur-vote` (POST anonyme) + `humeur-statut` (GET cache 20 s)
- 1 vote / device / jour (`device_hash` localStorage + UNIQUE en BD)
- Données 7 jours rolling

## Aucune dépendance ajoutée

HTML + JS vanilla. Aucun changement à `next.config.mjs`, `package.json`, `tsconfig.json`. Aucun composant React modifié. Servi tel quel par Next.js depuis `public/humeur/`.

## Owner

Apollon-Marketing (Cédric / Apollon, La Brassée).
