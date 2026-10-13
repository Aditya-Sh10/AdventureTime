// PROLOGUE: The Letter. Ishu's room, 11:57 PM, 13 October.

=== p_opening ===
~ p_started = true
October 13th. 11:57 PM. # chapter:prologue
Three minutes until your birthday. Somewhere under a pile of law books, a fourth-year law student is pretending to read case law.
tap. # sfx:tap
tap. tap.
Something is tapping on the window. # quest:p_window
-> END

=== room_window ===
{ got_letter:
    The owl is gone. It did not wait for a tip. Rude.
    -> END
}
An owl. At your window. At midnight.
It is holding a letter and wearing an expression of deep professional impatience.
Owl: Hoo. # sfx:owl
* [Open the window and take the letter]
    ~ got_letter = true
    You take the letter. The owl leaves immediately, like it has somewhere better to be. # give:letter # sfx:whoosh
    -> read_letter
* [Pretend you didn't see it]
    You look away. The tapping gets louder, and somehow more passive-aggressive. # sfx:tap
    -> END

= read_letter
The envelope is addressed in emerald ink.
"Miss Ishu. The Bedroom. Third Pillow From The Left. Behind The Suspiciously Large Pile Of Merch."
Whoever wrote this is suspiciously well-informed.
You open it.
"Dear Seeker. You have been selected to find the Hidden Treasure."
"It is hidden somewhere you have always wanted to go. A guide has been... arranged. He will be thrilled."
"P.S. Happy almost-birthday. G."
Behind you, something on the wall begins to glow. # sfx:chime # quest:p_frame
-> END

=== room_frame ===
{ not got_letter:
    Your framed Hogwarts acceptance letter. Still waiting for the owl to come back with the train ticket.
    -> END
}
The framed letter is glowing. The ink is moving.
"We are pleased to inform you..." rearranges itself into "We are pleased to inform you that you are LATE."
* [Touch the frame]
    The glass is warm. The room folds like paper. # cam:flash # sfx:whoosh # done # warp:hall:arrive
    -> END
* [Not yet]
    The letter glows patiently. It has waited years. It can wait a minute.
    -> END

=== room_merch ===
{ stopping:
    - Your figure shelf. Harry, Ginny, a tiny Dumbledore, and a Golden Snitch that has never once tried to escape.
    - Ginny's figure looks ready for a fight. Respect.
    - Tiny Dumbledore seems to know something you don't. As usual.
}
-> END

=== room_wands ===
{ stopping:
    - Your wand collection. Five wands. Zero spells successfully cast.
    - ...Yet.
    - You try a swish and flick. It's Levi-O-sa. Nothing floats. The desk lamp looks nervous.
}
-> END

=== room_mirror ===
{ stopping:
    - You. Glasses on. Hair doing its own wavy thing. Earrings, excellent.
    - The mirror politely suggests standing on your toes. You ignore the mirror.
    - The mirror says nothing. It has learned.
}
-> END

=== room_bed ===
{ got_letter:
    Sleep can wait. Probably.
- else:
    Tempting. Very tempting. But something is tapping on the window.
}
-> END

=== room_tee ===
Your Gryffindor t-shirt, draped over the chair. Brave. Bold. Slightly wrinkled.
-> END

=== room_desk ===
{ stopping:
    - Three hundred pages of case law. You have read the first paragraph four times.
    - The case law judges you silently. You judge it back. Objection sustained.
    - Still three hundred pages. They're not going anywhere. Unlike you, apparently.
}
-> END

=== room_plant ===
A plant. Still alive. Honestly, impressive.
-> END
