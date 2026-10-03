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
INCLUDE snape.ink

-> END

// Fallback so the story also runs in Inky without the game bound.
=== function has(item) ===
~ return false
