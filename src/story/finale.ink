// ============================================================================
// Finale: the Astronomy Tower. Chest code 1-4-1-0 → empty → "Really?" → midnight → BOOM (fireworks) →
// G. arrives late (asleep on the stairs, forgot the treasure) → "calm down" / "Do not." → GOLDFISH → hood down,
// it's Adi → Snape's sincere line → end screens (stats, the message, credits).
// ============================================================================

=== tower_arrive ===
~ tower_seen = true
The stairs end in open air. # chapter:finale # sfx:whoosh
The top of the Astronomy Tower. Stars everywhere, close enough to touch, and a good solid wall all the way round.
Snape steps, quite deliberately, between you and the nearest edge.
Snape: Purely to block the view. # portrait:snape
* [Thank you.]
    Snape: I have no idea what you mean. # portrait:snape_soft
* [I wasn't scared.]
    Snape: Of course not. Neither was I. Neither of us will be looking down. # portrait:snape
- In the middle of the tower stands a chest. Old wood, iron bands, and a brass lock with four number wheels. # quest:f_chest
Snape: Four wheels. Four numbers. I wonder where we might find four numbers. # portrait:snape_smug
-> END

=== tower_chest ===
{ chest_open:
    The chest. Still empty. Spectacularly, magnificently empty.
    -> END
}
{ tower_chest == 1:
    The chest. The lock's four wheels are stiff with age, and all set to zero.
}
You kneel by the lock. # puzzle:chest
-> END

=== tower_open ===
~ chest_open = true
One. Four. One. Zero. The lock clicks open. # sfx:open
You lift the lid. It creaks, the way treasure chests are supposed to creak. # sfx:chest
Inside, there is nothing. Not gold, not a letter. A little dust. One very old spider, who leaves.
Snape: ... # portrait:snape
Snape: Really? # portrait:snape_shock
...
Nobody says anything. The wind says something, briefly, and then thinks better of it.
Far below, every stopped clock in the castle starts again, all at once, and strikes midnight. # sfx:chime
It is the fourteenth of October.
BOOM. # show:fireworks # sfx:boom # cam:flash # music:birthday
The sky goes up in gold. Then red, then blue, then green, then gold again, so close over the tower you can feel them in your chest. # show:birthday
Snape: ... # portrait:snape_shock
Snape: Ah. # portrait:snape_soft
Snape: Happy birthday, Miss Ishu. # portrait:snape_soft
~ g_here = true
Footsteps on the stairs behind you. Unhurried. Slightly out of breath. # sfx:gstairs
The hooded figure. G. Not a glimpse this time. Right here.
G.: Sorry, sorry! I'm here. Did it go off? Did I miss it?
G.: I sat down on the stairs for one second. One.
Snape: You fell asleep. # portrait:snape_annoyed
G.: I rested my eyes in a horizontal position. # sfx:gyawn
Snape: The chest, G. The chest is empty. # portrait:snape_annoyed
G.: The chest is... oh no.
G.: I forgot to put the treasure in the chest.
Snape: Really? # portrait:snape_annoyed
G.: No, wait, wait. The fireworks are the treasure. That was the plan. That was always the plan.
G.: Mostly.
* [You FORGOT?]
    G.: I prefer "improvised".
* [This is so typical.]
    G.: That's fair. That's extremely fair.
- G.: Okay, okay, just calm down a sec—
Snape: Do not. # portrait:snape
Snape: Clause Three. The Author may NOT tell the Seeker to calm down. The penalty is being beaten up. I would be delighted to witness it. # portrait:snape_smug
* [Beat him up.]
    You punch him in the arm. Not hard. Not soft, either. # sfx:gow
    G.: Ow. Fair. Deserved. Happy birthday. Ow.
* [Spare him. It's my birthday.]
    G.: Thank you. Happy birthday. I'm still a little bit scared of you.
- The Contract grows warm in your bag, one last time. # sfx:open
You take it out. On the author's line, the smudge that has been clearing all night finally clears all the way.
G. O. L. D. F. I. S. H.
* [Goldfish.]
- He pushes back his hood. The fireworks are behind him, so he is mostly a silhouette. You would know him anywhere.
~ hood_down = true
Adi: Hi.
Adi: It's me. Adi. The goldfish.
Adi: I built you a whole castle and then forgot the treasure. Which, honestly, is the most me thing I could have done.
Snape: For once, I agree with him. # portrait:snape_smug
Snape: Miss Ishu. # portrait:snape_soft
Snape: I was bound to guide you by a contract I did not sign and did not want. # portrait:snape
Snape: I would like it on record that somewhere around the forest, I stopped minding. # portrait:snape_soft
Snape: Don't let the Muggles get you down. Or the goldfish. Or anyone. # portrait:snape_soft
~ snape_sighs++
Snape: And now, Clause One being fulfilled, I am going to go and stand somewhere dark, alone, and not cry. # portrait:snape_annoyed
Adi: One more thing. I wrote it down, so I wouldn't forget.
~ finale_done = true
He holds out a folded letter. # done # end_demo:finale
-> END

=== tower_telescope ===
{ stopping:
- A brass telescope, pointed at a very particular patch of sky. You look. It is pointed at the window of your room.
    Snape: That is either very sentimental or a matter for the authorities. I have not decided which. # portrait:snape
- Your room, far away. The light is still on. The left side of the bed is waiting for a Batman.
}
-> END

=== tower_wall ===
{ chest_open:
    Fireworks, as far as you can see. You do not look down. You do not need to.
- else:
    A good thick wall, almost up to your shoulders. Most walls are.
    Snape: The view is overrated. Stay this side of me. # portrait:snape
}
-> END

=== tower_g ===
{ hood_down:
    Adi: I'm still here. I didn't forget. Well. I almost forgot.
- else:
    G.: Is it too late to say I was keeping the chest empty on purpose? For the drama?
}
-> END
