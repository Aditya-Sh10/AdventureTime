// ============================================================================
// The Hidden Treasure: master story. ONE ink Story so every flag/stat saves together.
// Conventions (see CLAUDE.md §9):
//   Speaker lines   "Snape: text"   (speaker must exist in src/data/speakers.ts, else it's narration)
//   Narration       plain text. NEVER put a colon in the first 24 chars of narration.
//   Tags            # portrait:snape_annoyed  # give:item  # quest:id  # sfx:name  # chapter:id
//                   # show:figure  # cam:shake|flash  # warp:map:spawn  # end_demo[:chapter]  # done
//                   # puzzle:id (opens a modal after the box closes; data/puzzles.ts)
// ============================================================================

EXTERNAL has(item)
EXTERNAL scare()

// --- progress flags ---
VAR p_started = false
VAR got_letter = false
VAR met_snape = false
VAR snape_bound = false
VAR heard_riddle = false
VAR clue1 = false
VAR figure_seen = false
VAR library_seen = false
VAR book1 = false
VAR book2 = false
VAR book3 = false
VAR book4 = false
VAR books = 0
VAR restricted_open = false
VAR got_map = false
VAR ch1_done = false
VAR hall_empty_seen = false

// --- chapter 2 ---
VAR lantern = 0
VAR forest_seen = false
VAR track1 = false
VAR track2 = false
VAR track3 = false
VAR tracks = 0
VAR stalked = false
VAR g_note = false
VAR burrow_a = false
VAR burrow_b = false
VAR burrow_c = false
VAR burrows = 0
VAR niffler_found = false
VAR coin4 = false
VAR ch2_done = false

// --- chapter 3 ---
VAR court_seen = false
VAR met_counsel = false
VAR ev_receipt = false
VAR ev_stool = false
VAR ev_clause = false
VAR evidence = 0
VAR trial_started = false
VAR verdict = false
VAR ch3_done = false

// --- chapter 4 ---
VAR rift_seen = false
VAR met_bat = false
VAR met_matt = false
VAR radar = false
VAR sai_seen = false
VAR shard_red = false
VAR met_spidey = false
VAR web = false
VAR shard_blue = false
VAR met_rapunzel = false
VAR lamp_a = false
VAR lamp_b = false
VAR lamp_c = false
VAR lamps = 0
VAR shard_gold = false
VAR shards = 0
VAR core_done = false
VAR ch4_done = false

// --- chapter 5 (+ Room of Hidden Things) ---
VAR haunt_seen = false
VAR steps_heard = false
VAR lens = false
VAR seen14 = false
VAR tape_done = false
VAR seen10 = false
VAR red_seen = false
VAR date_seen = false
VAR mirror_g = false
VAR hidden_seen = false
VAR met_lily = false
VAR ch5_done = false

// --- finale ---
VAR tower_seen = false
VAR chest_open = false
VAR g_here = false
VAR hood_down = false
VAR finale_done = false

// --- mystery spine ---
VAR clauses = 0
VAR fragments = 0

// --- stats (finale + Ch3 trial) ---
VAR touched_forbidden = 0
VAR snape_sighs = 0
VAR house_points = 0

INCLUDE prologue.ink
INCLUDE ch1_hall.ink
INCLUDE ch1_library.ink
INCLUDE ch2_forest.ink
INCLUDE ch3_court.ink
INCLUDE ch4_rift.ink
INCLUDE ch5_haunted.ink
INCLUDE finale.ink
INCLUDE snape.ink

-> END

// Fallback so the story also runs in Inky without the game bound.
=== function has(item) ===
~ return false

=== function scare() ===
~ return 2
