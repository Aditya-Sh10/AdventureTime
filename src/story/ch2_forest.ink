// ============================================================================
// Chapter 2: The Forbidden Forest. Lantern darkness, tracks, a stalker, G.'s forgotten note,
// and the stalker revealed: a Niffler that wants her earrings. Yields coin "4" + clause 3.
// ============================================================================

=== forest_arrive ===
~ forest_seen = true
The castle doors boom shut behind you. # chapter:ch2 # sfx:door
It is very, very dark.
Snape: The Forbidden Forest. Forbidden, Miss Ishu, as in "not permitted". It is right there in the name. # portrait:snape_annoyed
* [Can't you just... Lumos?]
    Snape: I am a guide. Not a lamp. # portrait:snape
* [I can't see my own feet.]
    Snape: They were never far away. # portrait:snape_smug
- Something on a tree stump nearby is glowing. Warm. Suspiciously convenient. # quest:c2_lantern
-> END

=== forest_too_dark ===
You take two steps into the trees and immediately walk into a branch. # sfx:tap
Snape: There is a lantern on that stump. Glowing. At roughly your eye level, which I assume was deliberate. # portrait:snape_smug
-> END

=== forest_lantern ===
{ lantern:
    The stump. It held a lantern once. It holds a lantern-shaped absence now.
    -> END
}
An old brass lantern sits on the stump, already lit. Tied to the handle is a note.
"For the short one. Hold it high. G."
~ lantern = 1
You pick it up. The dark backs off. A little. # give:lantern # sfx:pickup
Snape: "Hold it high." Ambitious. # portrait:snape_smug
~ snape_sighs++
Snape: Whoever this G. is, they know you well enough to be rude. I find I resent the competition. # portrait:snape_annoyed
The light catches something on the path ahead. Tiny glowing marks, leading west. # quest:c2_tracks
-> END

=== forest_track_1 ===
~ track1 = true
~ tracks++
Footprints, glowing faintly gold in the mud. Tiny ones. Four little toes.
Snape: Smaller than yours. I did not think that was possible. # portrait:snape_smug
They lead west, then north.
-> END

=== forest_track_2 ===
~ track2 = true
~ tracks++
More footprints. They stop here, turn in a little circle, then carry on north.
{ track1:
    Snape: It paused. It looked back. # portrait:snape
    Snape: At you. # portrait:snape
- else:
    Snape: Whatever it is, it walks in circles when it is excited. Like someone I could mention. # portrait:snape_smug
}
-> END

=== forest_stalker ===
~ stalked = true
Snape: Honestly, Miss Ishu, if you held that lantern any lower it would count as a torch for your shoe... # portrait:snape_smug
A twig snaps. Behind you. # sfx:sting
Snape stops talking. That has never happened before.
{ scare() >= 2:
    The lantern gutters. For a long second there is nothing but the dark, and the sound of something small, breathing. # cam:shake
    Two points of light blink, low to the ground, right where you just walked. Then they are gone.
}
{ scare() == 1:
    The lantern dims. Something rustles in the ferns behind you, then goes quiet.
}
{ scare() == 0:
    Something rustles in the ferns. It sounds about as dangerous as a hedgehog with opinions.
}
Snape: ... # portrait:snape
Snape: Lumos. # portrait:snape # sfx:chime # cam:flash
~ lantern = 2
The tip of his wand flares. The dark backs away, properly this time.
* [I thought you weren't a lamp.]
    Snape: I am not. This is an emergency exception. Do not tell anyone. # portrait:snape_annoyed
* [Thank you.]
    Snape: Do not make it a whole thing. # portrait:snape
- A cold draught moves through the trees ahead. # show:figure # sfx:draught
For a heartbeat, a hooded shape stands between the trunks up the path. Closer than last time. Much closer.
Then it is gone.
Snape: Your admirer again. Or stalker. The line is thin and they are dancing on it. # portrait:snape_annoyed # quest:c2_follow
-> END

=== forest_g_note ===
{ g_note:
    G.'s unfinished note. The ink still trails off the page. Somewhere, a pen is still asleep.
    -> END
}
~ g_note = true
Where the hooded figure stood, a scrap of parchment is pinned to a tree.
It says, in hurried handwriting, "Remember to tell her the Niffler has the fo"
And then the ink just... trails off. A long wobbly line, sliding down the page and off the edge.
* [Did G. fall asleep mid-word?]
    Snape: In a haunted forest. Standing up. While writing. # portrait:snape
    Snape: I almost respect it. # portrait:snape_smug
* [The Niffler has the... what?]
    Snape: Clearly G. forgot. Mid-sentence. Remarkable. A goldfish would have finished the word. # portrait:snape_annoyed
- ~ house_points += 5
-> END

=== forest_track_3 ===
~ track3 = true
~ tracks++
The footprints get messier here, then scatter in every direction across a moonlit clearing.
Holes. Three of them. Somebody has been digging.
Snape: Burrows. Something has dug in. Check them, and kindly do not put your hand in any of them. # portrait:snape # quest:c2_burrows
-> END

=== forest_burrow_a ===
{ burrow_a: -> forest_burrow_again }
~ burrow_a = true
-> forest_burrow_check

=== forest_burrow_b ===
{ burrow_b: -> forest_burrow_again }
~ burrow_b = true
-> forest_burrow_check

=== forest_burrow_c ===
{ burrow_c: -> forest_burrow_again }
~ burrow_c = true
-> forest_burrow_check

=== forest_burrow_again ===
{ niffler_found:
    An empty burrow. It smells of mud and ambition.
- else:
    You already checked that one. It is still a hole.
}
-> END

// The Niffler is always in the third burrow checked, whichever that is (frustration-free "search").
=== forest_burrow_check ===
~ burrows++
{ burrows:
- 1:
    You kneel and peer in. Darkness. A spoon. Three bottle caps. Somebody's single sock.
    Snape: A hoard. Its owner has... ambitions. # portrait:snape
- 2:
    You peer in. Empty, except for an extremely shiny button and a smell of mud.
    Snape: One left. Where else could it possibly be. # portrait:snape
- else:
    -> forest_niffler_reveal
}
-> END

=== forest_niffler_reveal ===
~ niffler_found = true
Before you can even look, something launches out of the burrow. # sfx:whoosh # cam:shake
A small, fluffy, black creature with a flat duck bill lands on the stump, and stares. At your ears.
Snape: A Niffler. # portrait:snape
Snape: That is your stalker. It has followed you through an entire forest. For your earrings. # portrait:snape_smug
~ snape_sighs++
Niffler: ...! # portrait:niffler_happy
Something round and gold glints in its pouch. # quest:c2_niffler
-> END

=== niffler ===
{ coin4:
    The Niffler is busy admiring its new treasure in the moonlight. It does not look up. It is in love.
    -> END
}
The Niffler stares at your earrings. Then at you. Then at your earrings again, harder.
In its pouch, something gold catches the moonlight. A coin, with a number stamped on it.
* [Offer it one of your earrings.]
    You unclip an earring and hold it out.
    Niffler: !!! # portrait:niffler_happy
    -> trade
* [Ask Snape for something shiny.]
    Snape: I own nothing shiny. By design. # portrait:snape_annoyed
    Snape: Shiny things attract attention. Also Nifflers. Also, apparently, you. # portrait:snape
    -> niffler
* [Just... take the coin.]
    ~ touched_forbidden++
    You reach for the pouch. The Niffler bites your sleeve, very politely, and does not let go.
    Snape: It is negotiating. It is better at it than you. # portrait:snape_smug
    -> niffler
= trade
It snatches the earring, stuffs it in its pouch, then fishes around and spits a coin into your palm.
A heavy gold coin. Stamped on one side, in fresh ink, a large number four. And a single letter. G. # give:coin4 # sfx:chime
~ coin4 = true
~ fragments = 2
~ house_points += 10
Snape: One, from the castle. Four, from a Niffler. # portrait:snape
Snape: Someone is counting something. # portrait:snape
The Contract in your bag grows warm. # sfx:open
~ clauses = 3
Snape: Clause Three. # portrait:snape
Snape: "The Seeker may tell the Guide to calm down. The Guide may NOT tell the Seeker to calm down." # portrait:snape_annoyed
Snape: "Penalty for doing so... being beaten up. The author writes from experience." # portrait:snape_shock
* [Sounds fair to me.]
    Snape: It is grossly unbalanced. # portrait:snape_annoyed
* [Calm down, Snape.]
    Snape: ... # portrait:snape_annoyed
    Snape: I am perfectly calm. This is my calm face. It is identical to my other face. # portrait:snape
- ~ snape_sighs++
The Map rustles. A fresh line of ink runs north out of the clearing. # sfx:map # quest:c2_exit
-> END

=== forest_clearing_stump ===
{ niffler_found:
    The Niffler's stump. Scratched all over with tiny claw marks and, somehow, a little drawing of a crown.
- else:
    A wide, old stump in the middle of the clearing. The moonlight sits on it like it was saved for someone.
}
-> END

=== forest_exit ===
{ not coin4:
    Snape: We are not leaving without whatever we came for. I refuse to come back here. # portrait:snape_annoyed
    -> END
}
~ ch2_done = true
The trees thin. Somewhere ahead, impossibly, you hear a gavel. # sfx:gavel
Snape: No. # portrait:snape
Snape: Absolutely not. # portrait:snape_annoyed
Snape: That is a courtroom. In a forest. G. has gone too far. # portrait:snape_annoyed # done # end_demo:ch2
-> END

// --- flavour ---

=== forest_pond ===
{ stopping:
    - A still black pond. Your reflection looks up at you. The lantern makes your glasses glow like a very small owl.
      Snape leans over to look. His reflection looks even more disappointed than he does. # portrait:snape
    - The pond. Your reflection waves. You did not wave. Oh, wait. You did.
    - The pond is still a pond.
}
-> END

=== forest_mushrooms ===
{ forest_mushrooms > 1:
    The mushrooms glow, smugly, like they know something.
    -> END
}
A cluster of mushrooms, glowing soft blue-green.
Snape: Do not eat those. Do not lick those. Do not put them in your pocket "for later". # portrait:snape
* [Put one in your pocket for later.]
    ~ touched_forbidden++
    Snape: I said... yes. Of course you did. # portrait:snape_annoyed
* [Leave them.]
    Snape: Growth. Genuine growth. # portrait:snape_smug
- -> END

=== forest_bush ===
{ stopping:
    - A berry bush. The berries are red, round, and almost certainly a test.
      Snape: If you are hungry, there were sandwiches in the castle. Approximately one forest ago. # portrait:snape
    - Still berries. Still a test.
}
-> END
