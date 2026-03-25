# Poster Renderability Audit

Reality check against user report: current local workspace renders **68** posters by app logic, versus the reported live/manual count of **117**.

## Summary

- Total reviews: `236`
- Reviews with actually renderable posters: `68`
- Reviews with broken/missing local poster files: `0`
- Reviews with empty/null posterPath: `168`
- Reviews with paths in data that do not resolve correctly: `0`
- Placeholder poster paths still in use: `0`
- Reported live/manual visible poster count: `117`
- Gap between current workspace renderable count and live/manual count: `49`

## Source Breakdown

- `/posters/imported/`: `64`
- custom/static `/posters/...`: `3`
- external/admin-uploaded URLs or `/media`/`/uploads`: `0`
- `/posters/batch-17/`: `1`

## Old Audit Overcount

Titles that a non-empty-`posterPath` audit would count, but the app would not currently render as posters: `0`.

No overcounted titles were found in the current workspace.

## Broken Local Poster Files

No broken local poster file references were found.

## Paths In Data That Do Not Resolve

No non-empty poster paths failed resolution.

## Titles With Working Render Paths

Count: `68`

| Title | Slug | Poster path | Source |
| --- | --- | --- | --- |
|  | 1917 | /posters/imported/1917.jpg | custom |
|  | 3-idiots | /posters/imported/3-idiots.jpg | custom |
|  | alien | /posters/imported/alien.jpg | custom |
|  | aliens | /posters/imported/aliens.jpg | custom |
|  | amadeus | /posters/imported/amadeus.jpg | custom |
|  | american-beauty | /posters/imported/american-beauty.jpg | custom |
|  | american-history-x | /posters/imported/american-history-x.png | custom |
|  | angst-1983 | /posters/imported/angst-1983.jpeg | custom |
|  | apocalypse-now | /posters/imported/apocalypse-now.jpg | custom |
|  | avengers-endgame | /posters/imported/avengers-endgame.jpg | custom |
|  | basket-case-1982 | /posters/imported/basket-case-1982.jpeg | custom |
|  | blood-and-black-lace-1964 | /posters/imported/blood-and-black-lace-1964.jpeg | custom |
|  | braveheart | /posters/imported/braveheart.jpg | custom |
|  | casablanca | /posters/imported/casablanca.jpg | custom |
|  | christine-1983 | /posters/imported/christine-1983.jpeg | custom |
|  | city-lights | /posters/imported/city-lights.jpg | custom |
|  | coco | /posters/imported/coco.jpg | custom |
|  | creep-2014 | /posters/imported/creep-2014.jpeg | custom |
|  | deep-red-1975 | /posters/imported/deep-red-1975.jpeg | custom |
|  | django-unchained | /posters/imported/django-unchained.jpg | custom |
|  | dr-strangelove | /posters/imported/dr-strangelove.jpg | custom |
|  | dune-part-two | /posters/imported/dune-part-two.png | custom |
|  | eden-lake-2008 | /posters/imported/eden-lake-2008.jpeg | custom |
|  | good-will-hunting | /posters/imported/good-will-hunting.jpg | custom |
|  | harakiri | /posters/imported/harakiri.png | custom |
|  | haxan-1922 | /posters/imported/haxan-1922.jpeg | custom |
|  | joker | /posters/imported/joker.jpg | custom |
|  | ju-on-the-grudge-2002 | /posters/imported/ju-on-the-grudge-2002.jpeg | custom |
|  | jurassic-park | /posters/imported/jurassic-park.jpg | custom |
|  | l-on-the-professional | /posters/imported/leon-the-professional.jpg | custom |
|  | lights-out-2016 | /posters/imported/lights-out-2016.jpeg | custom |
|  | memento | /posters/imported/memento.jpg | custom |
|  | modern-times | /posters/imported/modern-times.jpg | custom |
|  | mute-witness-1995 | /posters/imported/mute-witness-1995.jpeg | custom |
|  | next-review-slot | /posters/next-review-slot.svg | custom |
|  | night-of-the-comet-1984 | /posters/imported/night-of-the-comet-1984.jpeg | custom |
|  | oldboy | /posters/imported/oldboy.jpg | custom |
|  | once-upon-a-time-in-america | /posters/imported/once-upon-a-time-in-america.jpg | custom |
|  | paths-of-glory | /posters/imported/paths-of-glory.jpg | custom |
|  | phenomena-1985 | /posters/imported/phenomena-1985.jpeg | custom |
|  | planet-terror-2007 | /posters/imported/planet-terror-2007.jpeg | custom |
|  | princess-mononoke | /posters/imported/princess-mononoke.jpg | custom |
|  | project-hail-mary | /posters/imported/project-hail-mary.jpg | custom |
|  | raiders-of-the-lost-ark | /posters/imported/raiders-of-the-lost-ark.jpg | custom |
|  | rear-window | /posters/imported/rear-window.jpg | custom |
|  | reservoir-dogs | /posters/imported/reservoir-dogs.jpg | custom |
|  | singin-in-the-rain | /posters/imported/singin-in-the-rain.jpg | custom |
|  | spider-man-into-the-spider-verse | /posters/imported/spider-man-into-the-spider-verse.jpg | custom |
|  | star-wars-episode-vi-return-of-the-jedi | /posters/imported/star-wars-episode-vi-return-of-the-jedi.jpg | custom |
|  | sunset-boulevard | /posters/imported/sunset-boulevard.jpg | custom |
|  | terrifier-3 | /posters/terrifier-3.svg | custom |
|  | the-batman | /posters/the-batman.svg | custom |
|  | the-brood-1979 | /posters/imported/the-brood-1979.jpeg | custom |
|  | the-cat-o-nine-tails-1971 | /posters/imported/the-cat-o-nine-tails-1971.jpeg | custom |
|  | the-departed | /posters/imported/the-departed.png | custom |
|  | the-great-dictator | /posters/imported/the-great-dictator.jpg | custom |
|  | the-howling-1981 | /posters/imported/the-howling-1981.jpeg | custom |
|  | the-lives-of-others | /posters/imported/the-lives-of-others.jpg | custom |
|  | the-lost-boys-1987 | /posters/imported/the-lost-boys-1987.jpeg | custom |
|  | the-mist-2007 | /posters/imported/the-mist-2007.jpeg | custom |
|  | the-prestige | /posters/imported/the-prestige.png | custom |
|  | the-shining | /posters/imported/the-shining.png | custom |
|  | the-tenant-1976 | /posters/imported/the-tenant-1976.jpeg | custom |
|  | toy-story | /posters/imported/toy-story.jpg | custom |
|  | trick-r-treat-2007 | /posters/imported/trick-r-treat-2007.jpeg | custom |
|  | wall-e | /posters/imported/wall-e.jpg | custom |
|  | whiplash | /posters/batch-17/whiplash.jpeg | batch-17 |
|  | witness-for-the-prosecution | /posters/imported/witness-for-the-prosecution.jpg | custom |

## Titles Still Missing Posters

Count: `168`

- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 