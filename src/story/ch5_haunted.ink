// ============================================================================
// Chapter 5: The Haunted Wing (+ the Room of Hidden Things, Ch6 merged). Cold corridor, three doors.
// Nursery mirror → her glasses become a lens ("14"); the TV room's tape (the one jumpscare, scare-gated, "10").
// Both done → the middle door turns red → the Red Room: 14 · 10 = her birthday, G. in the mirror, a hidden door
// → the Room of Hidden Things: Lily, Snape's admission, clause 6, the Map points to the Astronomy Tower.
// ============================================================================

=== haunt_arrive ===
~ haunt_seen = true
The Map led you here. A long corridor, wallpaper peeling, portraits in heavy frames. # chapter:ch5 # sfx:door
It is cold. Not forest cold. The kind of cold that comes from inside the walls.
Snape: Stay close to me. # portrait:snape
Snape: That is not affection. That is procedure. # portrait:snape_annoyed
* [Bhoot-woot kuch nahi hota.]
    Snape: I do not know what you just said. The corridor did, though. It got colder. # portrait:snape
* [Are you scared, Professor?]
    Snape: I taught teenagers for sixteen years. Nothing in this corridor frightens me. # portrait:snape_smug
- Three doors. One on the left, one in the middle, and one at the far end, wrapped in chains. # quest:c5_rooms
-> END

=== haunt_steps ===
~ steps_heard = true
You walk. Your footsteps echo down the corridor. Tap. Tap. Tap. # sfx:tap
You stop. The echo stops.
Then, one more. Tap. # sfx:tap
{ scare() >= 2:
    Right behind you. Close enough that the hair on your neck stands up. # sfx:sting
}
{ scare() == 1:
    Somewhere behind you. Not close. Not far, either. # sfx:sting
}
{ scare() == 0:
    Somewhere behind you, the house settles, the way old houses do.
}
Snape: That was me. # portrait:snape
* [It was NOT you.]
    Snape: It was me. I am choosing to believe it was me. You may join me. # portrait:snape
* [Thanks for lying.]
    Snape: I am a professional. # portrait:snape_smug
- -> END

=== haunt_tv_door ===
{ haunt_tv_door == 1:
    A door, slightly open. Blue light flickers under it, the colour of a television nobody is watching.
}
You go in. # sfx:door # warp:haunted:tvIn
-> END

=== haunt_mid_door ===
{ lens && tape_done:
    -> haunt_red_door
}
{ haunt_mid_door == 1:
    The middle door, painted white once. Behind it, very faintly, a music box is playing.
}
You go in. # sfx:door # warp:haunted:nurseryIn
-> END

=== haunt_red_door ===
{ red_seen:
    The red door. Still red. It seems pleased to see you. # sfx:door # warp:haunted:redIn
    -> END
}
The middle door is red now. Not painted red. Red, the way it has always been red, if you were to ask it.
Snape: That door was white. # portrait:snape
Snape: I will not be asking it what happened. # portrait:snape_annoyed
You open it. It is not the nursery. # sfx:door # warp:haunted:redIn
-> END

=== haunt_locked ===
{ stopping:
- Chained, padlocked, and very firmly shut. A label hangs from the padlock. "NOT YET. G."
    Snape: He does love a sign. # portrait:snape_annoyed
- Still chained. Still not yet.
}
-> END

=== haunt_portrait ===
{ tape_done:
    The portrait has turned round. You are looking at the back of a head. Whatever happens next, it does not want to watch.
- else:
    A pale woman in a high collar. Her eyes follow you. Not in the fun Hogwarts way.
    Snape: The portraits in this wing do not talk. It is the only thing I like about it. # portrait:snape
}
-> END

=== haunt_clock ===
A grandfather clock, stopped. Three minutes to midnight.
{ haunt_clock > 1: -> END }
Snape: It has said eleven fifty-seven all night. So has my pocket watch. So did the hourglasses in the Hall, I suspect. # portrait:snape
* [Maybe time stopped for us.]
    Snape: Time does not stop for anyone, Miss Ishu. It would certainly not stop for me. # portrait:snape
    Snape: For you, possibly. Someone seems to have asked it nicely. # portrait:snape_soft
* [Your pocket watch is just broken.]
    Snape: My pocket watch has not been wrong since 1981. # portrait:snape_annoyed
- -> END

// --- The TV room (The Ring) ---

=== tv_tape ===
{ tape_done:
    The screen shows a well in a clearing. Nothing climbs out of it. It has learnt its lesson.
    -> END
}
An old television on a cabinet, a VCR underneath. A tape is already half pushed in. No label. Of course there is no label.
Snape: Do not play the unlabelled tape in the haunted house, Miss Ishu. # portrait:snape
* [Play the tape.]
    ~ touched_forbidden++
    You push it in.
* [You play it, Professor.]
    Snape: Absolutely not. # portrait:snape_annoyed
    You push it in yourself. Snape makes a small noise, like a kettle giving up.
    ~ snape_sighs++
- -> tv_scare

=== tv_scare ===
~ tape_done = true
Click. Whirr. The screen goes from black to snow. # sfx:tap
Static. Then a ring of white light. Then a well, in a clearing, in grainy black and white.
Something moves at the bottom of the well.
{ scare() >= 2:
    ~ lantern = 0
    Your lantern goes out. # sfx:sting
    In the dark, the screen is the only light. A hand comes over the lip of the well. Then another. Long, wet, black hair.
    It climbs out. It walks toward you. It gets bigger, and bigger, and it is AT THE GLASS. # cam:shake # sfx:boom
}
{ scare() == 1:
    ~ lantern = 1
    Your lantern dims. On the screen a figure climbs out of the well, slowly, and stops just short of the glass. # sfx:sting
}
{ scare() == 0:
    On the screen a figure climbs halfway out of the well, looks around, and seems unsure of itself. # sfx:sting
}
Then a damp, tired voice comes out of the speaker. "Hello? Is this the house with the VCR?"
~ lantern = 2
Your lantern flares back up. # cam:flash
The girl on the screen is sitting on the edge of her well, wringing out her hair. She looks exhausted.
"Sorry. Wrong house. Nobody has a VCR any more, do you know how hard my job is now?"
* [Honestly? I'm a huge fan.]
    "Really? Nobody ever says that." She sniffs. "Thank you. I'll tell the well."
* [You nearly gave me a heart attack!]
    "That's literally the job. Glad it still works on someone."
- The phone on the cabinet rings. It is not plugged in. # sfx:chime
Snape picks it up before you can stop him. He listens.
Snape: ... # portrait:snape
Snape: It said, "Seven days." # portrait:snape_shock
Snape: Then it said, "Sorry, no, wrong script. Three minutes." Then it hung up. Very rude. I would have hung up first. # portrait:snape_annoyed
The girl waves and climbs back down her well. The picture stays on the screen, waiting for the next house.
-> haunt_rooms_check

=== tv_reels ===
{ tv_reels > 1:
    "G., asleep. Volume 1 of 400." It is a very heavy reel.
    -> END
}
A box of old film reels, labelled in neat handwriting. "Family Fun." "Pool Party." "Barbecue."
You get a very bad feeling about these and decide not to watch them.
Snape: Wise. For once. # portrait:snape
At the bottom of the box, one newer reel, in a different hand. "G., asleep. Volume 1 of 400."
Snape: Four hundred volumes of a man sleeping. # portrait:snape
Snape: Finally, a film I could sit through. # portrait:snape_smug
-> END

=== tv_ten ===
~ seen10 = true
Scratched into the wallpaper, glowing faintly through your glasses, a number. "10".
Under it, smaller. "The second half. G."
-> haunt_numbers

=== tv_exit ===
Back into the corridor. # sfx:door # warp:haunted:tvOut
-> END

// --- The nursery (Bly Manor) ---

=== nursery_mirror ===
{ lens:
    The mirror has cleared. It is just a mirror now. You look fine. Short, but fine.
    -> END
}
A tall mirror, fogged from the inside, as if someone very close to the glass had been breathing on it.
Written in the fog, with one finger, two words. "perfectly splendid"
The music box stops.
Snape: I do not like that. # portrait:snape
* [Perfectly splendid.]
    You say it out loud. The whole nursery seems to relax, as if it had been waiting for someone to say it back.
* [Wipe the mirror.]
    You wipe it with your sleeve. Nothing happens. The fog is on the other side.
- Your glasses have fogged up too. You take them off and wipe them on your top.
When you put them back on, the room looks different. Sharper. As if the glass had learnt something. # cam:flash # sfx:chime
On the wall under the window, writing glows. Writing that was not there a second ago.
~ lens = true
Snape: What are you looking at? # portrait:snape
Snape: There is nothing there. # portrait:snape_shock
Snape: ... There is something there, isn't there. I hate your glasses. # portrait:snape_annoyed
-> haunt_rooms_check

=== nursery_fourteen ===
~ seen14 = true
Under the window, in light only your glasses catch, a number. "14".
Under it, smaller. "The first half. G."
-> haunt_numbers

=== haunt_numbers ===
{ seen14 && seen10:
    Fourteen. Ten. You have seen those numbers before, tonight. You have been carrying them.
    Snape: Fourteen, and ten. It means nothing to me. As I have said. Repeatedly. # portrait:snape_smug
}
-> END

=== nursery_crib ===
{ stopping:
- An empty crib. A blanket inside it, folded very neatly, as if somebody expects it back.
- The blanket is folded differently now. You are almost sure.
    Snape: Do not. # portrait:snape
}
-> END

=== nursery_dolls ===
{ nursery_dolls == 1:
    A shelf of porcelain dolls. All of them are facing the door.
- else:
    { scare() >= 1:
        The dolls are facing you now.
        Snape: They were always facing you. Choose to believe that. I have. # portrait:snape
    - else:
        The dolls are still facing the door. Good dolls.
    }
}
-> END

=== nursery_box ===
A music box, its tiny dancer turning. The tune is one you almost know, slowed down until it is sad.
{ nursery_box == 1:
    Snape: If that dancer turns to look at us, I am leaving. Contract or no contract. # portrait:snape
}
-> END

=== nursery_exit ===
Back into the corridor. # sfx:door # warp:haunted:nurseryOut
-> END

=== haunt_rooms_check ===
{ tape_done && lens:
    Somewhere out in the corridor, a door slams. When the echo stops, the house is quieter than before. # sfx:door
    Snape: Something out there has changed. I can feel it in my teeth. # portrait:snape # quest:c5_red
}
-> END

// --- The Red Room (Hill House) ---

=== red_arrive ===
~ red_seen = true
Red. The walls, the floor, the light. A room that has been waiting a long time for somebody, and is pleased it is you. # sfx:sting
Snape: This is not the nursery. # portrait:snape
* [Rule one. You never go into the red room.]
    Snape: Then why are we IN it? # portrait:snape_shock
* [It's kind of cosy, actually.]
    Snape: That is precisely what it wants you to think. # portrait:snape
- The door you came in by is still there. That is something. # quest:c5_door
-> END

=== red_date ===
{ date_seen:
    "14 · 10". Glowing, patient, the most obvious secret in the world.
    -> END
}
~ date_seen = true
On the top wall, in light only your glasses can find, two numbers. "14 · 10".
Fourteen. Ten. One, four, one, zero. The Frog Card, the coin, Case Number One, the Zero.
* [It's a date.]
    A date you know better than any other.
* [Wait. That's my birthday.]
    Of course it is.
- It is your birthday. The fourteenth of October.
Snape: ... # portrait:snape_shock
Snape: The code to the treasure is your birthday. # portrait:snape
Snape: And all night, every clock in this castle has said three minutes to midnight. # portrait:snape
Snape: Someone is being extremely sentimental, Miss Ishu. For once in my life I am confident it is not me. # portrait:snape_smug
Beside the numbers, the outline of a door begins to glow. # sfx:chime
-> END

=== red_mirror ===
{
- mirror_g:
    Just you in the mirror. And Snape, pretending not to check his hair.
    -> END
- not date_seen:
    A tall gold mirror. You in it, and the red room behind you. Just you.
    -> END
}
~ mirror_g = true
You look in the tall mirror. You, in the red room. Snape, behind you, scowling.
And behind Snape, close enough to touch him, a hooded figure. # show:figure # sfx:sting
You spin round. Nothing. # cam:flash
Snape: What. What did you see? # portrait:snape_shock
On the floor where it stood, a folded note.
"Don't be scared. It's only me. I came in here to tell you something very important and I have completely forgotten what it was. G."
* [He forgot. Of course he forgot.]
    Snape: A man who forgets what he came in for, in a house that never forgets anything. Fitting. # portrait:snape_smug
* [Goldfish.]
    Snape: I beg your pardon? # portrait:snape
    Snape: ... No. Do not explain. I suspect I am about to find out. # portrait:snape_annoyed
- -> END

=== red_hidden_door ===
{ not mirror_g:
    The outline of a door, glowing. It does not open. It seems to be waiting for you to look at something first.
    Snape: The mirror, presumably. It is always the mirror. # portrait:snape
    -> END
}
The outline brightens under your hand, and the red paper peels back from a door that was always there. # sfx:open
Snape: After you. # portrait:snape
Snape: That is not manners. That is self-preservation. # portrait:snape_smug # done # warp:haunted:hidden
-> END

=== red_exit ===
Back into the corridor. # sfx:door # warp:haunted:nurseryOut
-> END

// --- The Room of Hidden Things (Ch6, merged) ---

=== hidden_arrive ===
~ hidden_seen = true
Warm. That is the first thing. After the corridor and the red room, the air in here is warm, like a kitchen, like a blanket.
The room is full. Shelves to the ceiling, piles taller than you. Most things are. Lost things. Kept things.
Snape: The Room of Hidden Things. # portrait:snape
{ touched_forbidden > 0:
    Snape: Everything you touched tonight that I told you not to touch. All {touched_forbidden} of them. In here. Kept. # portrait:snape_annoyed
- else:
    Snape: Everything you were told not to touch tonight. You touched none of it. I do not believe that for a second. # portrait:snape_smug
}
Something moves behind the biggest pile. Something with a tail. # sfx:tap
-> lily_meet

=== lily ===
{ not met_lily:
    -> lily_meet
}
{ shuffle:
- Lily rolls onto her back, all four paws in the air. This is a request.
- Lily: Woof! # portrait:lily_happy
- Lily leans on Snape's leg. Snape allows it. Snape has not stopped allowing it.
}
-> END

=== lily_meet ===
~ met_lily = true
A golden retriever bursts out from behind the pile, all tail and ears, and runs straight at you.
It's Lily. Your Lily. Here, somehow.
She bumps into your knees, spins in a full circle, and sits on your feet, very pleased with herself.
Lily: Woof! # portrait:lily_happy
* [LILY! What are you doing here?!]
    Lily: Woof. # portrait:lily_happy
    Which roughly translates as, "everywhere you go, obviously."
* [Who's a good girl? You are. YOU ARE.]
    Lily: WOOF. # portrait:lily_happy
    She agrees completely.
- She has something in her mouth. A torn corner of parchment, slightly soggy.
Snape takes one very large step backwards.
Snape: Miss Ishu. There is a dog. # portrait:snape_shock
Snape: Make it stop looking at me like that. # portrait:snape_annoyed
Lily trots over to Snape, sits on his foot, and leans her whole weight against his leg.
Snape: ... # portrait:snape_shock
Snape: What is its name? # portrait:snape
* [Lily.]
- Snape goes completely still.
Snape: Lily. # portrait:snape_soft
For a long moment he says nothing at all. Then, carefully, as if he has forgotten how, he puts a hand on her head.
Lily thumps her tail against the floor.
Snape: That is a good name. # portrait:snape_soft
Snape: ... # portrait:snape_soft
Snape: You dislike me, Miss Ishu. I am aware. You have read the books, so you know why. # portrait:snape
Snape: I was unfair to the boy. # portrait:snape_soft
Snape: For years. He had her eyes, and I punished him for the rest of his face. It was beneath me. # portrait:snape_soft
* [Thank you for saying that.]
    Snape: Do not thank me. It was overdue by about seven books. # portrait:snape
* [Who are you, and what have you done with Snape?]
    Snape: I am still here. I am simply being honest, which you will find is much worse. # portrait:snape_smug
- Snape: Tell anyone, and I shall deny it under oath. I have experience with courts now. # portrait:snape_annoyed
Lily drops the soggy corner of parchment at your feet.
-> hidden_map

=== hidden_map ===
It is the missing corner of your Map. It fits exactly. The little "?" smudges, and ink runs out of it, fast. # sfx:whoosh
A staircase. A tower, the tallest one in the castle. And at the very top, a tiny drawing of a chest.
Snape: The Astronomy Tower. # portrait:snape
* [The top of the tallest tower. Wonderful. Love that for me.]
    Snape: There is a railing. And I will be standing between you and the edge. Purely to block the view. # portrait:snape_soft
* [That's where the treasure is.]
    Snape: That is where something is. Whether it is treasure depends entirely on G. I would not get your hopes up. # portrait:snape
- The Contract grows warm in your bag. # sfx:open
~ clauses = 6
Snape: Clause Six. # portrait:snape
Snape: "Lily outranks the Guide. In all matters. Including the sofa, the last biscuit, and the left side of the bed." # portrait:snape
Lily looks up at him, tail going.
Snape: ... Agreed. # portrait:snape_soft
~ snape_sighs++
~ house_points += 10
~ ch5_done = true
Snape: Three minutes to midnight, Miss Ishu. Shall we? # portrait:snape # done # end_demo:ch5
-> END

=== hidden_stool ===
Another step-stool, identical to yours. And another behind it. And another. A whole stack of them.
A note on top. "Bought in bulk. You're welcome. G."
-> END

=== hidden_pile ===
{ stopping:
- A pile of lost and found. On top, in a little glass case, "Exhibit 41, one mushroom, pocketed."
    Snape: They kept the mushroom. Of course they kept the mushroom. # portrait:snape_annoyed
- Under the mushroom, a crumpled note from the forest. Still unfinished. It has been unfinished all night.
}
-> END

=== hidden_shelf ===
{ stopping:
- Shelves of everything anyone ever lost. A crown. Several wands. A jar, very firmly sealed, labelled "CALM DOWN (confiscated)".
    Snape: Whoever confiscated that deserves a medal. # portrait:snape_smug
- The jar rattles. It would very much like to tell you to calm down. It cannot. It has been confiscated.
}
-> END

=== hidden_exit ===
The door you came in by has gone. Only forward now. Lily is already sitting by your feet, ready.
-> END
