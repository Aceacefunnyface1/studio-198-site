# Poster System Audit

## Summary

- Total review entries: 215
- Entries with any posterPath: 215
- Entries using /posters/imported/: 43
- Entries using /posters/batch-17/: 1
- Entries using /posters/updating-placeholder.png: 168
- Entries using custom/static poster paths: 3
- Entries with no poster at all: 0
- Source poster files provided: 109
- Files copied into public/posters/imported: 45
- Imported files attached to live reviews: 43
- Imported files present but unused: 2

## Root Cause

- Previous Blob merge behavior only treated `/posters/batch-17/` as low quality.
- A stale Blob review record using `/posters/updating-placeholder.png` would beat a newer verified repo poster under `/posters/imported/` or another repo-managed `/posters/...` path.
- That made repo-managed verified posters vulnerable to being ignored in production merges.
- Repo-managed poster paths vulnerable under the previous merge logic: 46
- This was a merge-priority bug, not a comments/likes/admin-content bug.

## Merge Fix Applied

- Repo-managed `/posters/...` assets now win over Blob records that are missing, placeholder, batch-17, or stale repo-managed poster paths.
- Admin-managed uploads and external poster URLs still win and are preserved.
- Comments, likes, admin body text, and Blob save behavior were not changed.

## Posters Correctly Attached

- 1917 (1917) -> /posters/imported/1917.jpg
- 3 Idiots (3-idiots) -> /posters/imported/3-idiots.jpg
- Alien (alien) -> /posters/imported/alien.jpg
- Aliens (aliens) -> /posters/imported/aliens.jpg
- Amadeus (amadeus) -> /posters/imported/amadeus.jpg
- American Beauty (american-beauty) -> /posters/imported/american-beauty.jpg
- American History X (american-history-x) -> /posters/imported/american-history-x.png
- Apocalypse Now (apocalypse-now) -> /posters/imported/apocalypse-now.jpg
- Avengers: Endgame (avengers-endgame) -> /posters/imported/avengers-endgame.jpg
- Braveheart (braveheart) -> /posters/imported/braveheart.jpg
- Casablanca (casablanca) -> /posters/imported/casablanca.jpg
- City Lights (city-lights) -> /posters/imported/city-lights.jpg
- Coco (coco) -> /posters/imported/coco.jpg
- Django Unchained (django-unchained) -> /posters/imported/django-unchained.jpg
- Dr. Strangelove (dr-strangelove) -> /posters/imported/dr-strangelove.jpg
- Dune: Part Two (dune-part-two) -> /posters/imported/dune-part-two.png
- Good Will Hunting (good-will-hunting) -> /posters/imported/good-will-hunting.jpg
- Harakiri (harakiri) -> /posters/imported/harakiri.png
- Joker (joker) -> /posters/imported/joker.jpg
- Jurassic Park (jurassic-park) -> /posters/imported/jurassic-park.jpg
- Léon: The Professional (l-on-the-professional) -> /posters/imported/leon-the-professional.jpg
- Memento (memento) -> /posters/imported/memento.jpg
- Modern Times (modern-times) -> /posters/imported/modern-times.jpg
- Oldboy (oldboy) -> /posters/imported/oldboy.jpg
- Once Upon a Time in America (once-upon-a-time-in-america) -> /posters/imported/once-upon-a-time-in-america.jpg
- Paths of Glory (paths-of-glory) -> /posters/imported/paths-of-glory.jpg
- Princess Mononoke (princess-mononoke) -> /posters/imported/princess-mononoke.jpg
- Project Hail Mary (project-hail-mary) -> /posters/imported/project-hail-mary.jpg
- Raiders of the Lost Ark (raiders-of-the-lost-ark) -> /posters/imported/raiders-of-the-lost-ark.jpg
- Rear Window (rear-window) -> /posters/imported/rear-window.jpg
- Reservoir Dogs (reservoir-dogs) -> /posters/imported/reservoir-dogs.jpg
- Singin' in the Rain (singin-in-the-rain) -> /posters/imported/singin-in-the-rain.jpg
- Spider-Man: Into the Spider-Verse (spider-man-into-the-spider-verse) -> /posters/imported/spider-man-into-the-spider-verse.jpg
- Star Wars: Episode VI - Return of the Jedi (star-wars-episode-vi-return-of-the-jedi) -> /posters/imported/star-wars-episode-vi-return-of-the-jedi.jpg
- Sunset Boulevard (sunset-boulevard) -> /posters/imported/sunset-boulevard.jpg
- The Departed (the-departed) -> /posters/imported/the-departed.png
- The Great Dictator (the-great-dictator) -> /posters/imported/the-great-dictator.jpg
- The Lives of Others (the-lives-of-others) -> /posters/imported/the-lives-of-others.jpg
- The Prestige (the-prestige) -> /posters/imported/the-prestige.png
- The Shining (the-shining) -> /posters/imported/the-shining.png
- Toy Story (toy-story) -> /posters/imported/toy-story.jpg
- WALL·E (wall-e) -> /posters/imported/wall-e.jpg
- Witness for the Prosecution (witness-for-the-prosecution) -> /posters/imported/witness-for-the-prosecution.jpg
- Next Review Slot (next-review-slot) -> /posters/next-review-slot.svg
- Terrifier 3 (terrifier-3) -> /posters/terrifier-3.svg
- The Batman (the-batman) -> /posters/the-batman.svg

## Posters Missing

- Count: 169
- These are still using placeholder or batch-17 paths and need verified poster assignment work:
- Whiplash (whiplash) -> /posters/batch-17/whiplash.jpeg
- Kill Bill: The Whole Bloody Affair (kill-bill-the-whole-bloody-affair) -> /posters/updating-placeholder.png
- Spider-Man: Across the Spider-Verse (spider-man-across-the-spider-verse) -> /posters/updating-placeholder.png
- Cinema Paradiso (cinema-paradiso) -> /posters/updating-placeholder.png
- The Intouchables (the-intouchables) -> /posters/updating-placeholder.png
- The Usual Suspects (the-usual-suspects) -> /posters/updating-placeholder.png
- Once Upon a Time in the West (once-upon-a-time-in-the-west) -> /posters/updating-placeholder.png
- Avengers: Infinity War (avengers-infinity-war) -> /posters/updating-placeholder.png
- Inglourious Basterds (inglourious-basterds) -> /posters/updating-placeholder.png
- High and Low (high-and-low) -> /posters/updating-placeholder.png
- The Dark Knight Rises (the-dark-knight-rises) -> /posters/updating-placeholder.png
- Your Name. (your-name) -> /posters/updating-placeholder.png
- Das Boot (das-boot) -> /posters/updating-placeholder.png
- Capernaum (capernaum) -> /posters/updating-placeholder.png
- Come and See (come-and-see) -> /posters/updating-placeholder.png
- Requiem for a Dream (requiem-for-a-dream) -> /posters/updating-placeholder.png
- Toy Story 3 (toy-story-3) -> /posters/updating-placeholder.png
- Ikiru (ikiru) -> /posters/updating-placeholder.png
- The Hunt (the-hunt) -> /posters/updating-placeholder.png
- Incendies (incendies) -> /posters/updating-placeholder.png
- Eternal Sunshine of the Spotless Mind (eternal-sunshine-of-the-spotless-mind) -> /posters/updating-placeholder.png
- The Apartment (the-apartment) -> /posters/updating-placeholder.png
- Lawrence of Arabia (lawrence-of-arabia) -> /posters/updating-placeholder.png
- Heat (heat) -> /posters/updating-placeholder.png
- 2001: A Space Odyssey (2001-a-space-odyssey) -> /posters/updating-placeholder.png
- Scarface (scarface) -> /posters/updating-placeholder.png
- Double Indemnity (double-indemnity) -> /posters/updating-placeholder.png
- Up (up) -> /posters/updating-placeholder.png
- North by Northwest (north-by-northwest) -> /posters/updating-placeholder.png
- Like Stars on Earth (like-stars-on-earth) -> /posters/updating-placeholder.png
- Full Metal Jacket (full-metal-jacket) -> /posters/updating-placeholder.png
- M (m) -> /posters/updating-placeholder.png
- Amélie (am-lie) -> /posters/updating-placeholder.png
- Citizen Kane (citizen-kane) -> /posters/updating-placeholder.png
- Vertigo (vertigo) -> /posters/updating-placeholder.png
- A Separation (a-separation) -> /posters/updating-placeholder.png
- Die Hard (die-hard) -> /posters/updating-placeholder.png
- To Kill a Mockingbird (to-kill-a-mockingbird) -> /posters/updating-placeholder.png
- Indiana Jones and the Last Crusade (indiana-jones-and-the-last-crusade) -> /posters/updating-placeholder.png
- The Sting (the-sting) -> /posters/updating-placeholder.png
- A Clockwork Orange (a-clockwork-orange) -> /posters/updating-placeholder.png
- Metropolis (metropolis) -> /posters/updating-placeholder.png
- Snatch (snatch) -> /posters/updating-placeholder.png
- L.A. Confidential (l-a-confidential) -> /posters/updating-placeholder.png
- Downfall (downfall) -> /posters/updating-placeholder.png
- The Wolf of Wall Street (the-wolf-of-wall-street) -> /posters/updating-placeholder.png
- Dangal (dangal) -> /posters/updating-placeholder.png
- The Truman Show (the-truman-show) -> /posters/updating-placeholder.png
- Bicycle Thieves (bicycle-thieves) -> /posters/updating-placeholder.png
- Oppenheimer (oppenheimer) -> /posters/updating-placeholder.png
- Green Book (green-book) -> /posters/updating-placeholder.png
- Shutter Island (shutter-island) -> /posters/updating-placeholder.png
- Judgment at Nuremberg (judgment-at-nuremberg) -> /posters/updating-placeholder.png
- Batman Begins (batman-begins) -> /posters/updating-placeholder.png
- Hamilton (hamilton) -> /posters/updating-placeholder.png
- For a Few Dollars More (for-a-few-dollars-more) -> /posters/updating-placeholder.png
- Taxi Driver (taxi-driver) -> /posters/updating-placeholder.png
- Some Like It Hot (some-like-it-hot) -> /posters/updating-placeholder.png
- There Will Be Blood (there-will-be-blood) -> /posters/updating-placeholder.png
- The Kid (the-kid) -> /posters/updating-placeholder.png
- The Father (the-father) -> /posters/updating-placeholder.png
- All About Eve (all-about-eve) -> /posters/updating-placeholder.png
- The Sixth Sense (the-sixth-sense) -> /posters/updating-placeholder.png
- Ran (ran) -> /posters/updating-placeholder.png
- Casino (casino) -> /posters/updating-placeholder.png
- No Country for Old Men (no-country-for-old-men) -> /posters/updating-placeholder.png
- The Thing (the-thing) -> /posters/updating-placeholder.png
- Top Gun: Maverick (top-gun-maverick) -> /posters/updating-placeholder.png
- Prisoners (prisoners) -> /posters/updating-placeholder.png
- I Swear (i-swear) -> /posters/updating-placeholder.png
- Kill Bill: Vol. 1 (kill-bill-vol-1) -> /posters/updating-placeholder.png
- Pan's Labyrinth (pan-s-labyrinth) -> /posters/updating-placeholder.png
- Unforgiven (unforgiven) -> /posters/updating-placeholder.png
- A Beautiful Mind (a-beautiful-mind) -> /posters/updating-placeholder.png
- The Treasure of the Sierra Madre (the-treasure-of-the-sierra-madre) -> /posters/updating-placeholder.png
- Howl's Moving Castle (howl-s-moving-castle) -> /posters/updating-placeholder.png
- Finding Nemo (finding-nemo) -> /posters/updating-placeholder.png
- Klaus (klaus) -> /posters/updating-placeholder.png
- Yojimbo (yojimbo) -> /posters/updating-placeholder.png
- The Great Escape (the-great-escape) -> /posters/updating-placeholder.png
- The Elephant Man (the-elephant-man) -> /posters/updating-placeholder.png
- Monty Python and the Holy Grail (monty-python-and-the-holy-grail) -> /posters/updating-placeholder.png
- Dial M for Murder (dial-m-for-murder) -> /posters/updating-placeholder.png
- The Best of Youth (the-best-of-youth) -> /posters/updating-placeholder.png
- Demon Slayer: Kimetsu No Yaiba Infinity Castle (demon-slayer-kimetsu-no-yaiba-infinity-castle) -> /posters/updating-placeholder.png
- The Secret in Their Eyes (the-secret-in-their-eyes) -> /posters/updating-placeholder.png
- Gone with the Wind (gone-with-the-wind) -> /posters/updating-placeholder.png
- Chinatown (chinatown) -> /posters/updating-placeholder.png
- Lock, Stock and Two Smoking Barrels (lock-stock-and-two-smoking-barrels) -> /posters/updating-placeholder.png
- V for Vendetta (v-for-vendetta) -> /posters/updating-placeholder.png
- Catch Me If You Can (catch-me-if-you-can) -> /posters/updating-placeholder.png
- Inside Out (inside-out) -> /posters/updating-placeholder.png
- Rashomon (rashomon) -> /posters/updating-placeholder.png
- Three Billboards Outside Ebbing, Missouri (three-billboards-outside-ebbing-missouri) -> /posters/updating-placeholder.png
- Trainspotting (trainspotting) -> /posters/updating-placeholder.png
- The Bridge on the River Kwai (the-bridge-on-the-river-kwai) -> /posters/updating-placeholder.png
- Harry Potter and the Deathly Hallows: Part 2 (harry-potter-and-the-deathly-hallows-part-2) -> /posters/updating-placeholder.png
- Dead Poets Society (dead-poets-society) -> /posters/updating-placeholder.png
- The Wild Robot (the-wild-robot) -> /posters/updating-placeholder.png
- Warrior (warrior) -> /posters/updating-placeholder.png
- Barry Lyndon (barry-lyndon) -> /posters/updating-placeholder.png
- Fargo (fargo) -> /posters/updating-placeholder.png
- Ben-Hur (ben-hur) -> /posters/updating-placeholder.png
- Raging Bull (raging-bull) -> /posters/updating-placeholder.png
- The Chaos Class Failed the Class (the-chaos-class-failed-the-class) -> /posters/updating-placeholder.png
- Million Dollar Baby (million-dollar-baby) -> /posters/updating-placeholder.png
- Mad Max: Fury Road (mad-max-fury-road) -> /posters/updating-placeholder.png
- Children of Heaven (children-of-heaven) -> /posters/updating-placeholder.png
- Hacksaw Ridge (hacksaw-ridge) -> /posters/updating-placeholder.png
- My Neighbor Totoro (my-neighbor-totoro) -> /posters/updating-placeholder.png
- Gran Torino (gran-torino) -> /posters/updating-placeholder.png
- Ratatouille (ratatouille) -> /posters/updating-placeholder.png
- 12 Years a Slave (12-years-a-slave) -> /posters/updating-placeholder.png
- The Grand Budapest Hotel (the-grand-budapest-hotel) -> /posters/updating-placeholder.png
- Before Sunrise (before-sunrise) -> /posters/updating-placeholder.png
- Memories of Murder (memories-of-murder) -> /posters/updating-placeholder.png
- Blade Runner (blade-runner) -> /posters/updating-placeholder.png
- How to Train Your Dragon (how-to-train-your-dragon) -> /posters/updating-placeholder.png
- Spider-Man: No Way Home (spider-man-no-way-home) -> /posters/updating-placeholder.png
- Gone Girl (gone-girl) -> /posters/updating-placeholder.png
- Monsters, Inc. (monsters-inc) -> /posters/updating-placeholder.png
- Jaws (jaws) -> /posters/updating-placeholder.png
- In the Name of the Father (in-the-name-of-the-father) -> /posters/updating-placeholder.png
- Ford v Ferrari (ford-v-ferrari) -> /posters/updating-placeholder.png
- Wild Tales (wild-tales) -> /posters/updating-placeholder.png
- The Gold Rush (the-gold-rush) -> /posters/updating-placeholder.png
- Mary and Max (mary-and-max) -> /posters/updating-placeholder.png
- Sherlock Jr. (sherlock-jr) -> /posters/updating-placeholder.png
- The Deer Hunter (the-deer-hunter) -> /posters/updating-placeholder.png
- The Wages of Fear (the-wages-of-fear) -> /posters/updating-placeholder.png
- The General (the-general) -> /posters/updating-placeholder.png
- Logan (logan) -> /posters/updating-placeholder.png
- Rocky (rocky) -> /posters/updating-placeholder.png
- Mr. Smith Goes to Washington (mr-smith-goes-to-washington) -> /posters/updating-placeholder.png
- Tokyo Story (tokyo-story) -> /posters/updating-placeholder.png
- On the Waterfront (on-the-waterfront) -> /posters/updating-placeholder.png
- Pirates of the Caribbean: The Curse of the Black Pearl (pirates-of-the-caribbean-the-curse-of-the-black-pearl) -> /posters/updating-placeholder.png
- A Silent Voice: The Movie (a-silent-voice-the-movie) -> /posters/updating-placeholder.png
- Wild Strawberries (wild-strawberries) -> /posters/updating-placeholder.png
- Spotlight (spotlight) -> /posters/updating-placeholder.png
- La haine (la-haine) -> /posters/updating-placeholder.png
- The Terminator (the-terminator) -> /posters/updating-placeholder.png
- Jai Bhim (jai-bhim) -> /posters/updating-placeholder.png
- The Sound of Music (the-sound-of-music) -> /posters/updating-placeholder.png
- Maharaja (maharaja) -> /posters/updating-placeholder.png
- The Third Man (the-third-man) -> /posters/updating-placeholder.png
- The Big Lebowski (the-big-lebowski) -> /posters/updating-placeholder.png
- The Best Years of Our Lives (the-best-years-of-our-lives) -> /posters/updating-placeholder.png
- The Seventh Seal (the-seventh-seal) -> /posters/updating-placeholder.png
- Before Sunset (before-sunset) -> /posters/updating-placeholder.png
- Chainsaw Man - The Movie: Reze Arc (chainsaw-man-the-movie-reze-arc) -> /posters/updating-placeholder.png
- Room (room) -> /posters/updating-placeholder.png
- Hotel Rwanda (hotel-rwanda) -> /posters/updating-placeholder.png
- The Incredibles (the-incredibles) -> /posters/updating-placeholder.png
- Platoon (platoon) -> /posters/updating-placeholder.png
- Hachi: A Dog's Tale (hachi-a-dog-s-tale) -> /posters/updating-placeholder.png
- The Exorcist (the-exorcist) -> /posters/updating-placeholder.png
- Rush (rush) -> /posters/updating-placeholder.png
- The Iron Giant (the-iron-giant) -> /posters/updating-placeholder.png
- The Wizard of Oz (the-wizard-of-oz) -> /posters/updating-placeholder.png
- Stand by Me (stand-by-me) -> /posters/updating-placeholder.png
- The Passion of Joan of Arc (the-passion-of-joan-of-arc) -> /posters/updating-placeholder.png
- My Father and My Son (my-father-and-my-son) -> /posters/updating-placeholder.png
- The Battle of Algiers (the-battle-of-algiers) -> /posters/updating-placeholder.png
- The Handmaiden (the-handmaiden) -> /posters/updating-placeholder.png
- Network (network) -> /posters/updating-placeholder.png
- Drishyam (drishyam) -> /posters/updating-placeholder.png
- Gangs of Wasseypur (gangs-of-wasseypur) -> /posters/updating-placeholder.png
- The Grapes of Wrath (the-grapes-of-wrath) -> /posters/updating-placeholder.png

## Posters Overwritten Or Lost

- Confirmed restored: `1917` now uses `/posters/imported/1917.jpg` after the audit found a safe source-file match and an empty poster path in the dataset.
- Titles with imported files available but still showing placeholder or no poster: none in the current repo dataset after the `1917` fix.
- Manual/imported poster assignments most likely lost in production were the 46 repo-managed poster entries listed in "Posters Correctly Attached"; under the previous merge logic, any stale Blob record holding a placeholder, batch-17 path, empty value, or older repo-managed `/posters/...` path could overwrite or suppress them.
- Imported files present in `public/posters/imported` but not attached to any live review:
- et-the-extra-terrestrial.jpg
- glass.jpg
- Exact live production overwrite count cannot be proven from this environment because the Blob token is not available here.
- Exact titles vulnerable to production overwrite under the previous merge logic: 46 repo-managed poster entries (all items in "Posters Correctly Attached").

## Files Present But Unused

- et-the-extra-terrestrial.jpg
- glass.jpg
- Source files still only in the provided folder and not copied into repo: 64

## Safe Matches

- Applied: `1e3dc5e94ddbb3512d4d68816191727c.jpg` -> `1917` (`1917`)
- No additional safe normalized-title matches were found among the currently unused imported files.

## Uncertain Matches

- `84c1af469ae84e395e8a4d5f1254778c.jpg` -> possible `The Wolf of Wall Street` based on OCR only; not applied.
- `xl_ready-or-not-2-here-i-come-movie-poster_c7f4dc3c.jpg` -> OCR suggested `Heat`, but filename clearly conflicts; not applied.
- `xl_zootopia-2-movie-poster_b47e3469.png` -> OCR suggested `Heat`, but filename clearly conflicts; not applied.
- `et-the-extra-terrestrial.jpg` exists in `public/posters/imported`, but there is no matching review entry in the dataset.
- `glass.jpg` exists in `public/posters/imported`, but there is no matching review entry in the dataset.

## Source Comparison

- Repo dataset inspected: `data/site-data.json`
- Production merge logic inspected: `lib/site-data.ts`
- Imported poster folder inspected: `public/posters/imported`
- Remaining placeholder/batch usage inspected directly from dataset values.
- Live Blob contents were not inspectable from this environment because `BLOB_READ_WRITE_TOKEN` is not set.
