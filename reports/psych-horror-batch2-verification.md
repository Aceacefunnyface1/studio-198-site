# Psych Horror Batch 2 Verification

## Result

- Verified pairings: 21 / 21
- Mismatches: 0
- Missing poster files: 0
- Reviews pointing at the wrong poster path: 0

## Pairings

| Row | Title | Slug | Poster File Path |
| --- | --- | --- | --- |
| 1 | The Lost Boys | `the-lost-boys-1987` | `/posters/imported/the-lost-boys-1987.jpeg` |
| 2 | Lights Out | `lights-out-2016` | `/posters/imported/lights-out-2016.jpeg` |
| 3 | Angst | `angst-1983` | `/posters/imported/angst-1983.jpeg` |
| 4 | Deep Red | `deep-red-1975` | `/posters/imported/deep-red-1975.jpeg` |
| 5 | Häxan | `haxan-1922` | `/posters/imported/haxan-1922.jpeg` |
| 6 | Creep | `creep-2014` | `/posters/imported/creep-2014.jpeg` |
| 7 | Mute Witness | `mute-witness-1995` | `/posters/imported/mute-witness-1995.jpeg` |
| 8 | The Tenant | `the-tenant-1976` | `/posters/imported/the-tenant-1976.jpeg` |
| 9 | Trick 'r Treat | `trick-r-treat-2007` | `/posters/imported/trick-r-treat-2007.jpeg` |
| 10 | The Brood | `the-brood-1979` | `/posters/imported/the-brood-1979.jpeg` |
| 11 | The Cat o' Nine Tails | `the-cat-o-nine-tails-1971` | `/posters/imported/the-cat-o-nine-tails-1971.jpeg` |
| 12 | Ju-on: The Grudge | `ju-on-the-grudge-2002` | `/posters/imported/ju-on-the-grudge-2002.jpeg` |
| 13 | Blood and Black Lace | `blood-and-black-lace-1964` | `/posters/imported/blood-and-black-lace-1964.jpeg` |
| 14 | Night of the Comet | `night-of-the-comet-1984` | `/posters/imported/night-of-the-comet-1984.jpeg` |
| 15 | Planet Terror | `planet-terror-2007` | `/posters/imported/planet-terror-2007.jpeg` |
| 16 | Basket Case | `basket-case-1982` | `/posters/imported/basket-case-1982.jpeg` |
| 17 | The Howling | `the-howling-1981` | `/posters/imported/the-howling-1981.jpeg` |
| 18 | Eden Lake | `eden-lake-2008` | `/posters/imported/eden-lake-2008.jpeg` |
| 19 | Phenomena | `phenomena-1985` | `/posters/imported/phenomena-1985.jpeg` |
| 20 | The Mist | `the-mist-2007` | `/posters/imported/the-mist-2007.jpeg` |
| 21 | Christine | `christine-1983` | `/posters/imported/christine-1983.jpeg` |

## Merge Safety Check

- Each of the 21 reviews currently points to its expected imported poster path in `data/site-data.json`.
- Each of the 21 imported poster files exists in `public/posters/imported`.
- None of the 21 pairings show a title mismatch between spreadsheet row and stored review entry.
- Current merge rules normalize the old placeholder path to empty, prefer valid repo-managed poster paths over stale batch/internal paths, and allow newer repo review data to beat older Blob review data by `updatedAt`.

## Issues

- None found.

## Note

- The spreadsheet row for `Ju-on: The Grudge` uses slug `ju-on-the-grudge-2002`. The Word doc text showed `2003`, but the imported review matches the spreadsheet slug/title pair exactly, which is what was verified here.
