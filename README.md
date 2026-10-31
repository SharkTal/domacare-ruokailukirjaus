# Ruokailukirjaus DomaCaressa – kehitysehdotus

Opiskelijaprojekti: ehdotus ruokailujen kirjaamisen työnkulun kehittämiseksi
DomaCaressa. Sisältää klikattavan prototyypin kuvitteellisella datalla.

## Tiedostot

```
index.html          Ehdotussivu (kaikki osiot + upotettu prototyyppi)
prototyyppi.html    Prototyyppi omana sivunaan
assets/styles.css   Tyylit (design tokenit + komponentit)
assets/proto.css    Prototyyppisivun oma tumma kehys
assets/app.js       Prototyypin logiikka
```

Ei riippuvuuksia, ei build-vaihetta. Avaa `index.html` selaimessa tai julkaise
sellaisenaan.

## Rakenne

1. Hero + tuotekortti (mitä ehdotetaan, yhdellä silmäyksellä)
2. Mittarit (20+ asukasta, 4 kirjausta / päivä, 1–2 min / asukas, ~2 h / päivä)
3. Nykytila – neljä vaihetta + sitaatti
4. Vaikutus – kolme seurausta + turvallisuushuomio
5. Ehdotus – kuusi muutosta + mikä ei muutu
6. Vertailu – työnkulku ennen ja jälkeen
7. Prototyyppi – toimiva näkymä (valitse ateria, merkitse asukkaat)
8. Rajaus – mitä ehdotus on ja mitä se ei ole
9. Seuraava askel + yhteystiedot

## Prototyypin toiminnot

- Aterian valinta (aamupala / lounas / päivällinen / iltapala), kirjaukset erillään per ateria
- Yksi napautus per asukas: Ruokasali / Huoneessa / Ei osallistunut
- Kirjaamattomat pysyvät ylhäällä, kirjatut siirtyvät omiin ryhmiinsä
- Haku nimellä tai huoneella, lajittelu A–Ö / Ö–A / huone
- Kirjatun rivin avaaminen: tilan korjaus ja asukaskohtainen huomautus
- Sama nappi uudelleen = kirjaus perutaan
- Tallennus antaa palautteen; mitään ei lähetetä palvelimelle

Kaikki asukastiedot ovat kuvitteellisia. Tila säilyy vain selainistunnon ajan.

## Tekniset huomiot

- Fontti (Schibsted Grotesk, yksi leikkausperhe koko sivulle) ladataan Google
  Fontsista. Jos sivun pitää toimia ilman verkkoyhteyttä, fontti kannattaa itse
  isännöidä `assets/fonts/` hakemistoon ja päivittää `@font-face`-säännöt.
- Saavutettavuus: semanttinen HTML, otsikkohierarkia, `aria-pressed` /
  `aria-expanded` -tilat, näppäimistökäyttö, `prefers-reduced-motion`.
  Leipäteksti on vähintään 12 px, toiminnalliset napit 12 px.
- Responsiivisuus: 1440 → 1100 → 860 → 620 px. Prototyyppi vaihtuu yhdestä
  palstasta pinotuksi 860 px alapuolella; tallennusnappi jää näkyviin.
  Vertailun vaiheketju käännetään alle 620 px pystysuuntaiseksi.

## Julkaisu GitHub Pagesilla

```bash
git clone https://github.com/SharkTal/domacare-ruokailukirjaus.git
cd domacare-ruokailukirjaus
# kopioi tämän hakemiston sisältö juureen (index.html, prototyyppi.html, assets/)
git add -A && git commit -m "Uusi ulkoasu ja toimiva prototyyppi"
git push
```

Sen jälkeen repositorion Settings → Pages → Branch: `main`, kansio `/ (root)`.
Sivu julkaistaan osoitteeseen `https://sharktal.github.io/domacare-ruokailukirjaus/`.
