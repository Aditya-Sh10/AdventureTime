# Birthday Mystery Game — Design & Implementation Master Plan

## 0. Project Summary

A personalized, browser-based **2D top-down adventure game** made as a birthday gift.

The game should feel like a small handcrafted RPG/adventure rather than a conventional birthday webpage. It will take inspiration from the structure and feel of classic top-down monster/adventure games, while building its own visual identity around:

- Harry Potter / Hogwarts
- Marvel, especially Daredevil and Spider-Man
- Disney princesses
- Horror movies
- Law / courtroom themes
- Bollywood references
- Classic internet memes and inside jokes
- Personal references specific to the birthday girl

### Core premise

The player is the birthday girl.

She arrives in a magical world and is given a mysterious quest:

> Find the hidden treasure.

Each chapter contains:
1. Exploration
2. Environmental storytelling
3. NPC interactions
4. Small puzzles / mini-games
5. Comedy and references
6. Occasional horror sequences
7. A clue leading to the next chapter

The mystery gradually connects the chapters.

The final treasure is **not an ordinary magical artifact**.

It is a **firework celebration**, followed by the final personalized birthday message.

---

# 1. Creative Direction

## Tone

The game should deliberately alternate between different emotional tones.

### Magical / cozy
- Hogwarts-inspired locations
- Warm interiors
- Libraries
- Common-room-like spaces
- Magical particles
- Cozy NPC interactions
- Soft background ambience

### Mystery / thriller
- Locked rooms
- Strange clues
- Missing objects
- Secret passages
- Cryptic notes
- Environmental storytelling
- Recurring symbols
- Unexplained events

### Horror
Used selectively.

The game should NOT be a horror game from beginning to end.

Instead, horror should appear when the player becomes comfortable.

Examples:
- A corridor that was previously safe suddenly becomes empty
- Footsteps following the player
- A light that turns off behind them
- A portrait that changes
- A room that looks different when revisited
- Something briefly appearing at the edge of the screen
- A normally funny NPC behaving strangely
- A sudden silence before a scare

### Comedy / comic relief
Comedy should break tension rather than destroy it.

Examples:
- Snape being forced to help
- Bollywood references
- Meme dialogue
- Daredevil references
- NPCs reacting absurdly to magical situations
- Fake legal objections
- Completely unnecessary dramatic narration

---

# 2. Main Guide / Narrator — Severus Snape

Snape should be the primary guide.

Important:

**He does NOT want to help.**

He is helping because he has no choice.

This creates a recurring comedic relationship between the player and the narrator.

## Possible story explanation

A magical rule / binding / debt forces Snape to guide the birthday girl through the quest.

Example concept:

> An ancient magical contract has been activated.
>
> Whoever possesses the contract must guide the chosen seeker until the hidden treasure is found.
>
> Unfortunately for Snape, the contract has chosen him.

Snape therefore has to:

- Explain mechanics
- Give hints
- Warn the player
- Occasionally save the player
- Explain puzzles
- Reveal lore

But he should constantly make it clear that he is annoyed.

Example tone:

> "If you are quite finished wandering aimlessly, the clue is directly in front of you."

Or:

> "No. Do not touch that."

Player touches it.

> "Of course."

His guidance should become subtly warmer toward the end without turning him into a completely different character.

## Snape progression

### Early
Extremely reluctant.

### Middle
Annoyed but increasingly invested.

### Horror sections
His warnings become genuinely serious.

### Final chapter
He finally drops most of the sarcasm and gives the player a sincere final piece of guidance.

This gives the character an emotional arc.

---

# 3. Why Is Snape Helping?

This needs to be finalized before implementation.

Potential mechanisms:

### Option A — Magical Contract
Snape is magically bound to guide the seeker.

### Option B — Debt
The birthday girl unknowingly possesses something connected to Snape's past, and helping her is repayment of an old magical debt.

### Option C — Hogwarts Assignment
Dumbledore / McGonagall assigned Snape to oversee the quest.

### Option D — Curse
Snape cannot leave the magical realm until the treasure is found.

### Option E — Combination
A magical contract forces Snape to help, but the contract has a deeper connection to the actual mystery.

**Recommended direction:** keep the surface explanation funny and the deeper explanation mysterious.

---

# 4. Game Structure

## Recommended structure

### Prologue
5–8 minutes

### Chapter 1
8–10 minutes

### Chapter 2
8–10 minutes

### Chapter 3
8–10 minutes

### Chapter 4
8–10 minutes

### Chapter 5
8–10 minutes

### Chapter 6
8–10 minutes

### Final Chapter
8–12 minutes

## Estimated total

Approximately:

**65–85 minutes for a normal playthrough.**

This is not too long for a personalized birthday game, provided that the player is continuously doing something.

However, the actual target should be:

> **~60–75 minutes for the average run**

with optional exploration and secrets pushing longer.

### Important pacing rule

Do NOT make every chapter exactly 10 minutes.

Some should be:
- 6–7 minutes
- 8 minutes
- 10–12 minutes

depending on their purpose.

The game should feel like it is moving forward rather than artificially filling a runtime.

---

# 5. Chapter Design Philosophy

Every chapter should contain:

### A. A distinct environment
The player should immediately know they entered a new place.

### B. A central mystery
Something is wrong / missing / hidden.

### C. Exploration
The player physically moves through the environment.

### D. 1–2 gameplay interactions
Examples:
- Find objects
- Arrange symbols
- Talk to NPCs
- Follow clues
- Solve a simple puzzle
- Avoid something
- Decode a message
- Find a hidden path

### E. References
At least a few personalized references.

### F. One memorable moment
Every chapter should have a scene the birthday girl remembers.

### G. A clue
The chapter ends with information leading to the next chapter.

---

# 6. Mystery Structure

The treasure should not simply be:

> "Find six keys."

Instead, every chapter should reveal part of a larger mystery.

Example:

### Chapter 1
Find a strange magical object.

### Chapter 2
Discover that the object belonged to someone.

### Chapter 3
Find a hidden message.

### Chapter 4
Discover the message is part of a larger pattern.

### Chapter 5
Learn that someone deliberately scattered the clues.

### Chapter 6
Discover the identity / reason behind the mystery.

### Final Chapter
Understand that the entire quest was constructed specifically for her.

The final reveal:

> The treasure was never really hidden from her.
>
> The entire world was created to lead her toward it.

Then:

**FIREWORKS → BIRTHDAY MESSAGE**

---

# 7. Chapter Themes — Initial Draft

These are placeholders until the questionnaire is completed.

## Prologue — The Letter

Location:
Hogwarts-inspired entrance.

Events:
- Player arrives
- Receives mysterious letter
- Meets Snape
- Snape reluctantly explains the quest
- Player learns about the hidden treasure
- First clue is discovered

Mood:
Magical + mysterious.

---

## Chapter 1 — The Castle

Location:
Hogwarts-inspired castle.

Focus:
Exploration + basic mechanics.

References:
Harry Potter-heavy.

Gameplay:
- Explore corridors
- Talk to NPCs
- Find first clue
- Basic interaction tutorial

Horror:
Very subtle.

Ending:
First major clue.

---

## Chapter 2 — The Forbidden Area

Location:
Forest / abandoned magical area.

Focus:
Mystery + horror.

Gameplay:
- Follow environmental clues
- Limited visibility
- Strange sounds
- Something appears to follow the player

Comedy:
Snape remains sarcastic over the player's decisions.

Ending:
Discovery of a hidden artifact.

---

## Chapter 3 — The Courtroom

Location:
Magical courtroom / Wizengamot-inspired area.

Focus:
Law + comedy.

Gameplay:
- Evidence collection
- Dialogue choices
- Mini courtroom puzzle
- Determine which statements are relevant

References:
Law school + memes + Bollywood.

Ending:
A legal document contains the next clue.

---

## Chapter 4 — The Multiverse

Location:
Unstable magical dimension.

Focus:
Marvel.

Possible characters / references:
- Daredevil
- Spider-Man
- Other Marvel references depending on her favorites

Gameplay:
- Ability-based puzzles
- Character recognition
- Multiverse clues

Tone:
Fast + funny + energetic.

Ending:
A Marvel-themed clue points back toward Hogwarts.

---

## Chapter 5 — The Haunted Wing

Location:
Abandoned Hogwarts wing.

Focus:
Horror.

Gameplay:
- Environmental puzzles
- Strange room changes
- Sound-driven tension
- Minimal UI
- Possible chase sequence

Important:
No constant jumpscares.

The horror should mostly come from:

**sound + anticipation + uncertainty.**

Ending:
The player discovers the biggest piece of the mystery.

---

## Chapter 6 — The Hidden Truth

Location:
Secret magical location.

Focus:
Connecting everything.

The player realizes:
- The previous clues were connected
- The quest was deliberately constructed
- The treasure is close

References from previous chapters return.

Snape becomes less sarcastic.

Ending:
The final location is revealed.

---

# 8. Final Chapter — The Treasure

The final chapter should slow down.

The player reaches the treasure location.

There should be a final interaction.

Possibly:

> **"Open the chest."**

Player opens it.

Nothing.

Snape:

> "Really?"

A pause.

Then:

**BOOM.**

The sky lights up.

Fireworks begin.

The environment transforms.

Music changes from mysterious to celebratory.

Then:

> **Happy Birthday, [NAME] ❤️**

Followed by the personal message.

Potentially display:
- Her name
- A personalized title
- Funny statistics from the game
- Favorite references
- A final Snape line

---

# 9. Personalization — REQUIRED QUESTIONNAIRE

Claude should ask these questions before implementing the actual game.

If the answer is:

- "maybe"
- "I think"
- "not sure"
- "idk"

Claude should treat that as **uncertain information**, not as a confirmed fact.

It should ask follow-up questions where necessary.

## A. Basic

1. Her first name / nickname?
2. Birthday date?
3. Age?
4. How long have you known each other?
5. How would you describe your relationship?
6. Should the game be romantic, platonic, teasing, or completely ambiguous?
7. Are there any topics that should absolutely NOT appear?

## B. Harry Potter

8. Favorite Harry Potter character?
9. Favorite Hogwarts house?
10. Does she have a favorite professor?
11. Favorite movie?
12. Favorite book, if known?
13. Favorite magical creature?
14. Favorite spell?
15. Favorite HP quote?
16. Does she like the books more than the movies?
17. Does she collect HP merchandise?
18. Favorite Hogwarts location?
19. Does she have a Patronus / wand / Pottermore result?
20. Which Harry Potter characters does she dislike besides Snape?

## C. Snape

21. Why does she dislike Snape?
22. Is it genuine dislike or mostly joking?
23. Does she enjoy Snape memes?
24. Would she enjoy Snape roasting her?
25. Are there any specific Snape jokes between you two?

## D. Marvel

26. Favorite Marvel character?
27. Why does she like Daredevil?
28. Favorite Daredevil actor / version?
29. Favorite Spider-Man?
30. Favorite Marvel movie?
31. Favorite Marvel series?
32. Favorite villain?
33. Does she like MCU references generally or specific characters?
34. Any Marvel jokes / memes she repeatedly makes?

## E. Disney

35. Favorite Disney princess?
36. Favorite Disney movie?
37. Any Disney character she strongly identifies with?
38. Favorite Disney song?
39. Does she like modern Disney or mostly older movies?

## F. Horror

40. Favorite horror movies?
41. Favorite horror franchises?
42. Does she prefer supernatural horror, psychological horror, slashers, found footage, etc.?
43. Does she enjoy jumpscares?
44. How scary should the game actually become?
45. Any horror movie she absolutely loves?
46. Any horror movie she absolutely hates?
47. Any horror character she likes?

## G. Law

48. What area of law does she like?
49. Favorite law subject?
50. Does she enjoy courtroom dramas?
51. Favorite legal movie/show?
52. Any law-school jokes you share?
53. Does she like being teased about being a lawyer?
54. Any professor / class / assignment stories that are safe to reference?
55. Any recurring legal phrases or jokes she uses?

## H. Bollywood

56. Favorite Bollywood actors?
57. Favorite movies?
58. Favorite comedy movies?
59. Favorite dialogue references?
60. Favorite meme-worthy Bollywood scenes?
61. Does she like old Bollywood or newer Bollywood more?
62. Any movie she quotes constantly?

## I. Memes / Internet

63. What type of memes does she send?
64. Favorite meme formats?
65. Any recurring reaction images?
66. Any phrases she constantly uses?
67. Any cursed / absurd memes she would immediately recognize?
68. Any inside jokes between you two?

## J. Personality

69. Is she introverted, extroverted, or somewhere between?
70. Competitive?
71. Easily scared?
72. Curious?
73. Likes solving puzzles?
74. Likes exploration?
75. Gets frustrated quickly with games?
76. Does she enjoy reading clues?
77. Does she prefer story or gameplay?
78. Would she replay the game to find secrets?

## K. Personal Memories

79. Where did you first meet?
80. What is one funny memory involving her?
81. What is one embarrassing/funny thing she has done?
82. What is one thing she says all the time?
83. Any memorable trips?
84. Any memorable college moments?
85. Any shared jokes?
86. Any shared songs?
87. Any nicknames?
88. Any memorable conversations?
89. Any objects/items strongly associated with her?

## L. Birthday Message

90. Should the ending be emotional?
91. Funny?
92. Both?
93. Do you want a sincere paragraph?
94. Should Snape deliver part of the ending?
95. Should the game reveal that the entire quest was made specifically for her?

---

# 10. Asset Request System

Claude should NOT randomly ask for assets.

It should maintain an asset checklist and request files only when implementation reaches the relevant stage.

## Character sprites

Preferred format:

**PNG**

Recommended:
- Transparent background
- 32×32 or 48×48 base sprite
- 4-direction movement
- 3–4 walking frames per direction

If using larger artwork:

**64×64 or 96×96**

Claude should preserve pixel-art consistency.

---

## Tiles

Preferred:

**PNG spritesheet**

Recommended tile size:

**32×32 px**

Possible tiles:
- Grass
- Stone
- Wood
- Water
- Walls
- Doors
- Bookshelves
- Trees
- Torches
- Hogwarts-style architecture
- Forest
- Dungeon
- Courtroom
- Haunted area

---

## Portraits

Preferred:

**PNG or WebP**

For dialogue boxes.

Suggested:
- 256×256
- Transparent background where appropriate

Characters:
- Snape
- Player
- Important NPCs
- Marvel cameo characters if used

---

## Background illustrations

Preferred:

**WebP**

Use sparingly.

Recommended maximum target dimensions:

~1600×900.

Do not use huge 4K assets unless absolutely necessary.

---

## UI assets

Preferred:

**SVG**

For:
- Icons
- Buttons
- Symbols
- Clue markers
- Quest markers

---

# 11. Sound Design

Sound is a major part of the experience.

Do NOT rely entirely on music.

Use layered ambience.

## Categories

### Ambient

- Hogwarts room ambience
- Wind
- Rain
- Fireplace
- Forest
- Distant birds
- Castle ambience
- Library ambience

### Player

- Footsteps
- Door interaction
- Item pickup
- Movement
- Spell interaction

### Mystery

- Magical chimes
- Whisper
- Paper movement
- Clock
- Distant knock
- Low rumble

### Horror

- Distant footsteps
- Breathing
- Door creak
- Sudden impact
- Whisper
- Static/noise
- Low drone
- Silence

### Comedy

- Small UI sounds
- Comedic sting
- Record scratch
- Dramatic hit

### Final

- Magical buildup
- Firework launch
- Fireworks
- Celebration music

---

# 12. Sound Asset Questionnaire

Ask the user for:

1. Which ambient tracks are available?
2. Which tracks are loops?
3. Which are one-shot effects?
4. Length of each sound?
5. File format?
6. Mono or stereo where relevant?
7. Are the sounds original, royalty-free, or otherwise licensed?
8. Which sounds should loop?
9. Which sounds should play once?
10. Which sounds should crossfade?
11. Which chapter should each sound belong to?

Recommended format:

**WAV** for development/master sound effects.

**OGG** for browser delivery where practical.

MP3 can be used as a fallback.

---

# 13. Performance Targets

The game must run smoothly on low-to-mid-range laptops.

Target:

### Rendering
2D Canvas preferred for the game world.

Avoid unnecessary DOM elements for every tile.

### Target
- 60 FPS on normal hardware
- Graceful fallback toward 30 FPS

### Avoid
- 3D rendering
- WebGL-heavy effects
- giant sprite sheets
- huge background videos
- hundreds of simultaneous particles
- excessive blur
- excessive shadows
- real-time physics

### Use
- Sprite batching
- Small maps
- Camera culling
- Limited particles
- Lightweight shaders/effects only if absolutely necessary
- Compressed assets
- Lazy loading between chapters

---

# 14. Recommended Technical Architecture

## Frontend

React + TypeScript + Vite.

However, the actual game loop should remain separate from ordinary React rendering.

Recommended structure:

```text
src/
├── game/
│   ├── engine/
│   ├── entities/
│   ├── systems/
│   ├── scenes/
│   ├── maps/
│   ├── dialogue/
│   ├── quests/
│   ├── audio/
│   └── save/
│
├── components/
│   ├── DialogueBox
│   ├── QuestLog
│   ├── Inventory
│   ├── PauseMenu
│   └── GameOverlay
│
├── data/
│   ├── characters
│   ├── dialogue
│   ├── chapters
│   ├── items
│   └── clues
│
└── assets/
    ├── sprites
    ├── tiles
    ├── audio
    ├── portraits
    └── ui
```

Potentially use a lightweight 2D engine such as Phaser if it makes implementation substantially easier.

Before choosing the engine, benchmark a tiny prototype.

---

# 15. Core Gameplay Systems

Build these before creating all chapters:

## Player

- 4-direction movement
- Collision
- Animation
- Interaction range
- Camera

## Interaction

```text
Press E / Space
↓
Detect nearby interactable
↓
Open dialogue / inspect object
```

## Dialogue

Support:

- Speaker
- Portrait
- Text
- Choices
- Conditional dialogue
- Snape hints

## Quest system

Each chapter should have:

```text
Quest
→ Objective
→ Progress
→ Completion
→ Reward / clue
→ Next chapter
```

## Inventory

Keep it simple.

Possible items:

- Letters
- Keys
- Magical artifacts
- Evidence
- Clue fragments

## Save system

Browser-local save.

Store:

- Current chapter
- Quest state
- Inventory
- Choices
- Secrets discovered

Provide:

**Continue**

and

**New Game**

---

# 16. Accessibility

Include:

- Adjustable text speed
- Skip dialogue
- Volume controls
- Music volume
- SFX volume
- Reduced motion
- High contrast where necessary
- Keyboard controls
- Mouse-friendly interaction where practical

Do not make horror dependent entirely on sound.

---

# 17. Map Design

Maps should be small but dense.

Instead of:

> Huge empty Hogwarts

Prefer:

> Small explorable Hogwarts rooms with lots of interactive objects.

Every area should have a reason to exist.

Example:

```text
Entrance
   ↓
Main Hall
 ↙     ↘
Library  Corridor
   ↓
Secret Room
```

Use locked areas to control progression.

---

# 18. References Strategy

References should be layered.

### Level 1 — Obvious

Anyone who knows the franchise gets it.

### Level 2 — Fan

Specific HP / Marvel / Disney details.

### Level 3 — Personal

Only she understands.

### Level 4 — Inside jokes

Only you two understand.

The Level 4 references are likely to create the strongest emotional payoff.

---

# 19. Horror Design Rules

Never make horror constant.

Recommended rhythm:

```text
Comedy
↓
Exploration
↓
Mystery
↓
Comfort
↓
Something slightly wrong
↓
Tension
↓
Horror
↓
Relief
↓
Comedy
```

This emotional contrast is important.

If everything is scary, nothing is scary.

If everything is funny, nothing feels meaningful.

---

# 20. Music / Ambience System

Use layered audio:

```text
BASE AMBIENCE
+
AREA AMBIENCE
+
MUSIC
+
EVENT SFX
+
CHARACTER SFX
```

Example:

Haunted Wing:

```text
Wind loop
+
distant creaking
+
very low drone
+
occasional footsteps
+
event-based scare sound
```

Do NOT loop every sound continuously.

Randomize some environmental one-shots.

---

# 21. Development Roadmap

## Phase 0 — Discovery

Before coding:

- Complete questionnaire
- Finalize story
- Finalize chapter order
- Finalize Snape's role
- Create reference list
- Create asset list
- Create sound list

Deliverable:

**Game Design Document v1**

---

## Phase 1 — Technical Prototype

Build:

- Player movement
- Collision
- Camera
- One map
- One NPC
- Dialogue
- Basic interaction
- Basic audio

Deliverable:

**Playable 5-minute prototype**

---

## Phase 2 — Core Systems

Implement:

- Quest system
- Inventory
- Dialogue choices
- Save system
- Chapter transitions
- Audio manager
- Settings
- Interaction system

Deliverable:

**Playable vertical slice**

---

## Phase 3 — Art Pipeline

Create/import:

- Tiles
- Player
- Snape
- NPCs
- Objects
- UI
- Portraits

Establish consistent art direction.

---

## Phase 4 — Chapter 1

Fully complete one chapter.

Do NOT build six unfinished chapters simultaneously.

Test:

- pacing
- controls
- readability
- performance
- dialogue
- ambience

---

## Phase 5 — Chapters 2–6

Build sequentially.

For each:

1. Map
2. NPCs
3. Gameplay
4. Puzzle
5. References
6. Horror/comedy beat
7. Clue
8. Audio
9. Testing

---

## Phase 6 — Final Chapter

Build separately.

Focus on:

- emotional pacing
- treasure reveal
- fireworks
- birthday message
- final Snape dialogue
- music transition

This is the payoff.

---

## Phase 7 — Optimization

Test:

- Low-end laptop
- Mid-range laptop
- Chrome
- Edge
- Firefox if practical
- 1366×768
- 1920×1080
- 100% browser zoom
- 125% browser zoom

Check:

- FPS
- memory
- loading time
- audio issues
- asset loading
- input lag

---

## Phase 8 — Deployment

Recommended:

**Vercel**

Requirements:

- Public URL
- No installation
- No login
- No download
- Works directly in browser

Final link should ideally be something memorable.

Example:

```text
birthdayquest.vercel.app
```

or a custom domain if desired.

---

# 22. Claude Collaboration Workflow

Claude should NOT attempt the entire game in one giant generation.

Work in milestones.

### Rule

**One system at a time.**

Claude should:

1. Ask required questions
2. Confirm assumptions
3. Request assets only when necessary
4. Implement
5. Test
6. Fix
7. Commit
8. Move to next milestone

Claude should never silently invent personal information.

If information is uncertain:

```text
KNOWN
LIKELY
UNCERTAIN
UNKNOWN
```

Use those states internally when designing the game.

---

# 23. Asset Request Format

When Claude needs an asset, it should ask specifically.

Bad:

> "Send some Hogwarts images."

Good:

> "I need the Chapter 2 forest tileset.
>
> Format: PNG
> Tile size: 32×32
> Transparent background: No
> Required tiles: grass, dirt, tree trunk, tree canopy, rocks, path, water edge.
> Approximate sheet size: 256×256–512×512.
>
> Please provide one spritesheet rather than individual files if possible."

Same rule applies to sound.

---

# 24. Sound Request Format

Example:

> **Asset needed: Chapter 5 haunted-wing ambience**
>
> Type: seamless loop
> Format: WAV or OGG
> Duration: 30–90 seconds
> Content: low wind + distant building creaks
> No dialogue
> No sudden jumpscare
> Should loop cleanly
>
> Intended volume: background ambience

For one-shot:

> Type: SFX
> Duration: 0.5–3 seconds
> Format: WAV
> Usage: door suddenly slams during horror event

---

# 25. Content / Copyright Strategy

The game is a personal birthday project.

However, avoid unnecessarily copying large amounts of copyrighted material.

Prefer:

- Original pixel art
- Original UI
- Original dialogue
- Original environments inspired by themes
- Short references
- Parody-like jokes
- User-supplied/licensed assets

Do not rip entire soundtrack files, game assets, movie clips, or character sprites from copyrighted games/movies.

For music and sound effects, use original, licensed, or appropriately permitted assets.

---

# 26. Testing Checklist

## Gameplay

- [ ] Player cannot walk through walls
- [ ] Player cannot become permanently stuck
- [ ] Every quest can be completed
- [ ] Every chapter transition works
- [ ] No soft locks
- [ ] Save/load works
- [ ] Restart works

## Dialogue

- [ ] No missing dialogue
- [ ] No text overflow
- [ ] Skip works
- [ ] Choices work
- [ ] Snape hints trigger correctly

## Audio

- [ ] Music loops cleanly
- [ ] SFX volume balanced
- [ ] Horror sounds trigger correctly
- [ ] No overlapping audio bugs
- [ ] Mute works

## Performance

- [ ] Low-end laptop test
- [ ] No massive memory spikes
- [ ] No unnecessary animations
- [ ] Assets lazy-load where practical

## Responsive

- [ ] 1366×768
- [ ] 1920×1080
- [ ] Smaller laptop screens
- [ ] Browser zoom
- [ ] Touch / trackpad friendliness where relevant

---

# 27. Final Quality Bar

The goal is NOT:

> "I made a Harry Potter game."

The goal is:

> **"I made a game that could only have been made for her."**

The Harry Potter setting gets her attention.

The mystery keeps her playing.

The horror creates memorable moments.

The comedy keeps it fun.

The Marvel / Disney / Bollywood / law references make it personal.

The final reveal makes the whole thing click.

And the birthday message makes it a gift rather than simply a game.

---

# 28. Immediate Next Step

Before implementation begins, complete the **Personalization Questionnaire**.

Do not start building all six chapters yet.

Once the answers are available, create:

1. Character profile
2. Story premise
3. Snape's exact role
4. Chapter-by-chapter synopsis
5. Mystery/clue chain
6. NPC list
7. Puzzle list
8. Reference list
9. Horror beats
10. Comedy beats
11. Asset manifest
12. Sound manifest
13. Technical architecture
14. Implementation tickets

Only then begin the technical prototype.
