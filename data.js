/*
  SMOKEDOPLE DATA

  Drop files in covers/ and audio/, then `npm run scan` — files are matched to the titles below
  by name ("smokedope2016 - ", "(feat. …)", track numbers, "_spotdown.org", "(1)" copies etc. are
  ignored). Files that aren't listed here are still picked up automatically (album subfolders,
  same-named cover = single). Only songs/covers that have a file are in the game.

  starts: optional manual clip start overrides in seconds, e.g. { "Banshee": 31.5 }

  Tracklists from the user's Spotify screenshots (Nov 2026).
*/
window.FENG_DATA = {
  artist: "smokedope2016",
  game: "smokedople",
  icon: "2016LYFE",      // which release's cover becomes the browser tab icon

  releases: [
    { id: "bando",     title: "BANDO",          type: "album", year: 2023 },
    { id: "ss2",       title: "SMOKESHOP 2",    type: "album", year: 2023 },
    { id: "2016",      title: "2016",           type: "album", year: 2023 },
    { id: "comeup",    title: "THE COMEUP",     type: "album", year: 2024 },
    { id: "peak",      title: "THE PEAK",       type: "album", year: 2025 },
    { id: "comedown",  title: "THE COMEDOWN",   type: "album", year: 2026 },

    { id: "s-imnotgod",  title: "IM NOT GOD BUT I WISH I WAS", type: "single", year: 2022 },
    { id: "s-greyhound", title: "GREYHOUND",                   type: "single", year: 2022 },
    { id: "s-knowdat",   title: "KNOW DAT",                    type: "single", year: 2023 },
    { id: "s-whiteowls", title: "White Owls",                  type: "single", year: 2024 },
    { id: "s-khalifa",   title: "Khalifa",                     type: "single", year: 2024 },
    { id: "s-gnarly",    title: "Gnarly",                      type: "single", year: 2024 },
    { id: "s-iceysoles", title: "Icey Soles",                  type: "single", year: 2024 },
    { id: "s-2016lyfe",  title: "2016LYFE",                    type: "single", year: 2025 },
  ],

  songs: [
    // BANDO (2023)
    { title: "BUMPSTOCK",   release: "bando" },
    { title: "BANDO",       release: "bando" },
    { title: "TAHOE",       release: "bando" },
    { title: "AIRSTREAKS",  release: "bando" },
    { title: "RUDY",        release: "bando" },
    { title: "LAG SWITCH",  release: "bando" },
    { title: "ON MY LEVEL", release: "bando" },

    // SMOKESHOP 2 (2023)
    { title: "GHILLIE",     release: "ss2" },
    { title: "RED RING",    release: "ss2" },
    { title: "TRIPLE",      release: "ss2" },
    { title: "THIRSTY",     release: "ss2" },
    { title: "LEBRON 9s",   release: "ss2" },
    { title: "INDEPENDENT", release: "ss2" },
    { title: "CHAINZ",      release: "ss2" },
    { title: "UAV",         release: "ss2" },

    // 2016 (2023)
    { title: "On My Roof",     release: "2016" },
    { title: "Nike",           release: "2016" },
    { title: "2016",           release: "2016" },
    { title: "Damian Lillard", release: "2016" },
    { title: "Know Dat",       release: "2016" },
    { title: "Mobile",         release: "2016" },
    { title: "Poppy",          release: "2016" },
    { title: "Trill",          release: "2016" },

    // THE COMEUP (2024)
    { title: "Drank",                release: "comeup" },
    { title: "White Owls",           release: "comeup" },
    { title: "Glock",                release: "comeup" },
    { title: "Merch",                release: "comeup" },
    { title: "No Water",             release: "comeup" },
    { title: "Frat",                 release: "comeup" },
    { title: "Foamposite Interlude", release: "comeup" },
    { title: "My Style",             release: "comeup" },
    { title: "Ball Out",             release: "comeup" },
    { title: "Khalifa",              release: "comeup" },
    { title: "High",                 release: "comeup" },
    { title: "Mall",                 release: "comeup" },
    { title: "Too Gone",             release: "comeup" },

    // THE PEAK (2025)
    { title: "Back2Back",         release: "peak" },
    { title: "Icey Soles",        release: "peak" },
    { title: "Taipei / Waterbed", release: "peak" },
    { title: "Elite Socks",       release: "peak" },
    { title: "Goyard",            release: "peak" },
    { title: "Dope Love",         release: "peak" },
    { title: "Draft Night",       release: "peak" },
    { title: "Gnarly",            release: "peak" },
    { title: "Trust",             release: "peak" },
    { title: "In Da Party",       release: "peak" },
    { title: "Hypebeast",         release: "peak" },
    { title: "Eastbay",           release: "peak" },
    { title: "Off Tha Cid",       release: "peak" },

    // THE COMEDOWN (2026)
    { title: "Banshee",          release: "comedown" },
    { title: "My Chalice",       release: "comedown" },
    { title: "Wild'N Out",       release: "comedown" },
    { title: "Smoking Kills",    release: "comedown" },
    { title: "Flocc",            release: "comedown" },
    { title: "How I Bled",       release: "comedown" },
    { title: "Forgiato",         release: "comedown" },
    { title: "Be My Zombie",     release: "comedown" },
    { title: "Ozweego",          release: "comedown" },
    { title: "Famous",           release: "comedown" },
    { title: "Lips Sealed",      release: "comedown" },
    { title: "Lay My Body Down", release: "comedown" },
    { title: "Closing Time",     release: "comedown" },

    // standalone singles
    { title: "IM NOT GOD BUT I WISH I WAS", release: "s-imnotgod" },
    { title: "GREYHOUND",                   release: "s-greyhound" },
    { title: "2016LYFE",                    release: "s-2016lyfe" },
  ],

  starts: {},
};
