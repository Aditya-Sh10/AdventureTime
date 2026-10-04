// CHAPTER 1 (part two): The Library. Four glowing books spell the Restricted Section password; the Map + clause 2.
// The "Muggle" books on the shelves were planted by G. (Pince didn't order them).

=== library_arrive ===
~ library_seen = true
The Library. Shelves taller than reason, candles drifting over the reading tables, and the smell of ten thousand old pages.
Snape: You are smiling at the bookshelves. # portrait:snape
Snape: Stop it. It is unsettling. # portrait:snape_annoyed
Four books, scattered across the shelves, are glowing faintly. As if they have been waiting for you. # sfx:chime
Snape: Hm. Someone has been here before us. Again. # portrait:snape # quest:c1_books
-> END

=== library_exit ===
{ not got_map:
    Snape: We are not finished here. I can tell, because I am still here. # portrait:snape_annoyed
    -> END
}
Snape: Out. Before she shushes us into dust. # portrait:snape # sfx:door # warp:hall:library
-> END

=== pince ===
{ pince > 1:
    Madam Pince: {~Shh.|SHHH.|Shh. The books are sleeping.|Four glowing books. Read them. Quietly.} # portrait:pince_annoyed
    -> END
}
Madam Pince: Shh. # portrait:pince_annoyed
* [I didn't say anything.]
    Madam Pince: Shh. # portrait:pince_annoyed
    Snape: She means it pre-emptively. # portrait:snape
* [Whisper. "Hello."]
    Madam Pince: ...Hm. Acceptable volume. # portrait:pince
- Madam Pince: Someone was in here tonight. Hooded. Polite. Returned every book on time. # portrait:pince
Madam Pince: Most suspicious person I have ever met. # portrait:pince_annoyed
Madam Pince: They left four books glowing, and a great many books I did NOT order. # portrait:pince_annoyed
Madam Pince: And they asked me to let "the short one" read whatever she likes. Their words. # portrait:pince
Snape: Even the hooded stranger has noticed. # portrait:snape_smug
Madam Pince: Shh. # portrait:pince_annoyed
-> END

=== pince_desk ===
Madam Pince's desk. A list of overdue books, written in very angry handwriting.
Gilderoy Lockhart. "Magical Me." Fourteen copies. All signed. None returned.
At the bottom, H. Granger. Zero overdue books. Someone has drawn a small gold star next to her name.
-> END

// --- the four glowing books (spine number = letter order) ---

=== book_1 ===
{ book1:
    Hair Care for Tower Dwellers. Spine number 1, letter I.
    -> END
}
A glowing book with a gold "1" on the spine. # sfx:chime
"Hair Care for Tower Dwellers. Braids, Frying Pans, and You."
Chapter one is titled "Seventy Feet of Hair and Still No Plan."
Pressed between the pages is a slip of paper with a single letter on it. I.
Snape: A frying pan is a deeply underrated weapon. I will deny having said that. # portrait:snape
~ book1 = true
-> book_found

=== book_2 ===
{ book2:
    Wizarding Law, Fourth Year. Spine number 2, letter S.
    -> END
}
A glowing book with a gold "2" on the spine. # sfx:chime
"Wizarding Law, Fourth Year. Now With More Goblins."
It is roughly the size of a small cauldron.
Tucked inside the cover is a slip of paper with a single letter on it. S.
Snape: Your field, I am told. You have my condolences. # portrait:snape
Snape: And, very grudgingly, my respect. Do not quote me. # portrait:snape_annoyed
~ book2 = true
-> book_found

=== book_3 ===
{ book3:
    Hogwarts, A History. Spine number 3, letter H.
    -> END
}
A glowing book with a gold "3" on the spine. # sfx:chime
"Hogwarts, A History." The most borrowed, least read book in the castle.
A slip of paper flutters out of it. A single letter. H.
Snape: Everyone claims to have read it. Nobody has read it. # portrait:snape_smug
~ book3 = true
-> book_found

=== book_4 ===
{ book4:
    The red book with no title. Spine number 4, letter U.
    -> END
}
A glowing book with a gold "4" on the spine. # sfx:chime
It is blood red, with two small horns on the cover and no title at all.
The pages are blank. Somehow it still feels like it is listening to you.
Inside the back cover, a slip of paper with a single letter. U.
Snape: That book is not from here. I do not like things that are not from here. # portrait:snape
Snape: Present company is... under review. # portrait:snape_smug
~ book4 = true
-> book_found

=== book_found ===
~ books++
{ books >= 4:
    Snape: That is four. Four letters, numbered one to four. # portrait:snape
    Snape: And over there, an iron gate with a lock that wants a word. I wonder. # portrait:snape_smug # quest:c1_gate
- else:
    Snape: {books} of four. {~Keep going.|Onward. Slowly, apparently.|The shelves will not read themselves.} # portrait:snape
}
-> END

// --- flavour shelves (G.'s plants) ---

=== shelf_law ===
A shelf of Muggle law books that the Library definitely did not order.
Wedged between them, something pink and sparkly. "Legally Blonde." The novel.
Someone has bookmarked the page about getting into law school.
Snape: What, like it's hard? # portrait:snape_smug
Snape: ...I do not know why I said that. The shelf made me. # portrait:snape_annoyed
-> END

=== shelf_romance ===
A whole shelf, hand-labelled ROMCOMS. MUGGLE. 2000s.
"Jaane Tu... Ya Jaane Na." "Main Hoon Na." "I Hate Luv Storys." Somebody's favourites, clearly.
{ shelf_romance > 1:
    Snape: I still refuse. # portrait:snape_annoyed
- else:
    Snape: I refuse to have an opinion about this shelf. # portrait:snape
}
-> END

=== shelf_snape ===
A battered film script, shelved under Dark Arts for some reason. "Welcome."
Someone has underlined one line four times. "Control, Uday. Control."
Snape: ... # portrait:snape
Snape: Sound advice. I shall be repeating it to myself for the remainder of this evening. # portrait:snape_annoyed
~ snape_sighs++
-> END

=== reading_table ===
{ reading_table > 1:
    The essay is still there. Eleven footnotes. Snape is very carefully not looking at it.
    -> END
}
A reading table. Someone has left an essay behind.
"Why Professor Snape Was Deeply Unfair To Harry Potter. With Footnotes."
Snape: ... # portrait:snape
Snape: Eleven footnotes. Thorough. # portrait:snape
He does not say anything else for a while.
-> END

=== library_window ===
Through the window, the dark edge of the Forbidden Forest.
Something out there blinks. Twice. Then it doesn't.
Snape: Do not wave at it. # portrait:snape_annoyed
-> END

// --- the Restricted Section ---

=== restricted_gate ===
An iron gate. RESTRICTED SECTION. A brass lock with four letter wheels.
{ books < 4:
    Snape: You have found {books} of the glowing books. The lock will not be impressed. # portrait:snape
}
Snape: Go on, then. # portrait:snape # puzzle:restricted
-> END

=== restricted_unlocked ===
~ restricted_open = true
~ house_points += 10
The lock clicks. The gate swings open with a long, offended creak. # sfx:door
Snape: Your own name. # portrait:snape
Snape: Whoever G. is, they have all the subtlety of a Howler. # portrait:snape_annoyed
Snape: The Restricted Section. Touch nothing that is chained, whispering, or both. # portrait:snape # quest:c1_map
-> END

=== restricted_lectern ===
{ got_map:
    The lectern is empty now. The parchment chose you.
    -> END
}
A single sheet of blank parchment on the lectern, held down by a paperweight shaped like a Snitch.
You pick it up. It is warm. # sfx:whoosh
Ink blooms across it. Corridors. The Entrance Hall. The Library. # give:map
A little dot labelled "Ishu", and a smaller one right behind it labelled "Snape (sulking)".
~ got_map = true
Snape: I am not sulking. # portrait:snape_annoyed
More appears. A forest. A courtroom. Something that will not hold still.
And in the top corner, nothing at all. Only a small question mark.
The Contract in your bag grows warm. # cam:flash # sfx:chime
~ clauses = 2
Snape: Oh, no. # portrait:snape_shock
Snape: Clause Two. "The Guide shall remark upon the Seeker's height no more than once per room." # portrait:snape
Snape: "Note. The Guide has already exceeded this." # portrait:snape_annoyed
~ snape_sighs++
Snape: This contract is becoming personal. # portrait:snape_annoyed # sfx:sigh
Another letter of the smudged signature has cleared. Still not enough to read.
~ ch1_done = true
Snape: We are done here. Back to the Entrance Hall. # portrait:snape # quest:c1_return
-> END

=== chained_book ===
~ touched_forbidden++
{ chained_book:
- 1:
    A book bound in chains. It is whispering, very quietly, and it sounds a lot like your name.
    Snape: Do not touch that. # portrait:snape_annoyed
    You touch it. It SCREAMS. # cam:shake # sfx:sting
    ~ snape_sighs++
    Madam Pince: SHHHHHHHH! # portrait:pince_annoyed
    Snape: I did say. # portrait:snape # sfx:sigh
- else:
    The book screams again, but half-heartedly. It is tired of you too. # sfx:sting
    Snape: That is {touched_forbidden}, Miss Ishu. I am still counting. # portrait:snape_annoyed
}
-> END
