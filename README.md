# Ruokailukirjaus DomaCaressa – kehitysehdotus

Opiskelijaprojekti. Ehdotus ruokailujen kirjaamisen työnkulun kehittämiseksi DomaCaressa (Invian Oy / Visma).

**Live-sivu:** https://go.tabbit.space/projects/iahHyXWSg9

---

## Tausta

Hoivakodissa ruokailut kirjataan neljästi päivässä: aamupala, lounas, päivällinen ja iltapala. Nykyinen työnkulku on asukaskeskeinen: jokainen asukas avataan erikseen, valitaan osallistuminen ja paikka, tallennetaan ja suljetaan. Yli 20 asukkaalla tämä toistuu kaksikymmentä kertaa – vaikka kyse on yhdestä yhteisestä ateriasta.

Kaksi seurausta:

1. **Toistuva syöttö.** Arvio 1–2 minuuttia per asukas, eli 20–40 minuuttia per ateria ja noin 1,5–3 tuntia päivässä.
2. **Puuttuvat kirjaukset huomataan myöhään.** Kirjaamattomat eivät erotu näkymästä, joten puute havaitaan usein vasta lopuksi – asukas on jo poistunut ruokasalista ja tilanne joudutaan muistelemaan.

## Ehdotus

Tilannekohtainen ("skenaariokeskeinen") näkymä:

- Valitaan ateria → koko asukaslista näkyy kerralla.
- Yksi napautus per asukas: ruokasali / huoneessa / ei osallistunut.
- **Ei oletusarvoja** – mikään ei merkitse itseään, jotta kirjaus ei jää huomaamatta tekemättä.
- Kirjaamattomat pysyvät ylhäällä, kirjatut siirtyvät tilannekohtaisiin ryhmiin (ryhmät ovat laskettavissa ja taitettavissa).
- Haku nimellä tai huoneella + lajittelu A→Ö / Ö→A / huone. Asukkaat saapuvat eri aikoina, eivät listajärjestyksessä.
- Asukaskohtainen huomautus (ruokahalu, nielemisvaikeudet) säilyy avattavana.
- **Taustalla jokainen asukas saa edelleen oman, jäljitettävän kirjauksensa.** Ehdotus muuttaa käyttöliittymän järjestystä, ei tiedon rakennetta.

## Rakenne

```
index.html          Artikkeli: nykytila, vaikutus, ehdotus, rajaus
prototyyppi.html    Klikattava prototyyppi (upotettu iframeen)
README.md
```

Molemmat ovat itsenäisiä tiedostoja – ei riippuvuuksia, ei build-vaihetta. Toimii suoraan GitHub Pagesissa.

## Käyttö paikallisesti

```bash
git clone https://github.com/SharkTal/domacare-ruokailukirjaus.git
cd domacare-ruokailukirjaus
python3 -m http.server 8000
# avaa http://localhost:8000
```

## GitHub Pages

1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main`, kansio: `/ (root)`
4. Sivu julkaistaan osoitteessa `https://sharktal.github.io/domacare-ruokailukirjaus/`

## Rajaus ja vastuuvapaus

- Tämä on **yhden harjoittelijan henkilökohtainen havainto**, ei harjoitteluorganisaation virallinen kanta.
- **Ei potilastietoja eikä oikeita henkilötietoja.** Kaikki prototyypin nimet ja huoneet ovat kuvitteellisia.
- Ei väitettä, ettei järjestelmässä olisi jo vastaavaa toimintoa.
- Ei sitoumusta toteutuksesta tai aikataulusta.
- Ei sidoksissa Invian Oy:hyn, Vismaan tai harjoitteluorganisaatioon. DomaCare on Invian Oy:n tuotemerkki.

## Aiempi vastaava työ

Ryhmäkirjaus-optimointi (Attendo / Efima Puhekirjaus): https://sharktal.github.io/attendo-caretech-innovation/

Sama periaate, eri datamuoto: ryhmätilanteessa tieto syötetään kerran ja kohdistetaan usealle. Ruokailuissa sisältö vaihtelee asukkaittain, joten ratkaisu on tilannekohtainen näkymä eikä monivalinta.

## Yhteys

Liu Tao Gao · liutao.gao@gmail.com · https://github.com/SharkTal
