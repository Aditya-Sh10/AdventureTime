// CHAPTER 1 (opening): The Entrance Hall. Snape is bound; first clue behind the Gryffindor banner.

=== hall_intro ===
~ met_snape = true
The Entrance Hall. Torches. Banners. The smell of old stone and older secrets. # chapter:ch1
Someone is already waiting for you. Someone wearing a great deal of black.
Snape: ... # portrait:snape
Snape: So. You are the Seeker. # portrait:snape_annoyed
Snape: I was told to expect someone formidable. # portrait:snape
Snape: I was not told to look down. # portrait:snape_smug
* [Excuse me?]
    Snape: You heard me. Eventually the sound reaches that altitude. # portrait:snape_smug
* [And you are...?]
    Snape: Professor Severus Snape. Potions Master. And, against every fibre of my being, your guide. # portrait:snape_annoyed
* [Say nothing. Glare.]
    Snape: Hm. The glare is adequate. Gryffindor, I presume. # portrait:snape
- Snape: Hold this. # portrait:snape # give:contract
He hands you a long scroll. It is warm, it hums, and it is very clearly a contract.
Snape: The Magically Binding Agreement of Reluctant Guidance. It appeared on my desk this evening. Under my tea. # portrait:snape_annoyed
Snape: Clause One. # portrait:snape
Snape: "The Guide shall accompany the Seeker until the Hidden Treasure is found. The Guide may not resign, retire, feign illness, or go and brew something." # portrait:snape
~ snape_bound = true
~ clauses = 1
~ snape_sighs++
Snape: I have tried all four. # portrait:snape_annoyed # sfx:sigh
It is signed with a single letter. A. The rest is smudged. Deliberately, it seems.
* [Who is A?]
    Snape: If I knew, I would be having a very pointed conversation with them instead of this one. # portrait:snape_annoyed
* [So you HAVE to help me.]
    Snape: I have to accompany you. Help is a strong word. I shall be... adjacent. # portrait:snape_smug
- Snape: The first clue is somewhere in this hall. The portraits gossip. Start with them. # portrait:snape
Snape: And, Miss Ishu? Touch nothing unless I say so. # portrait:snape_annoyed # quest:c1_clue
-> END

=== cauldron ===
~ touched_forbidden++
{ touched_forbidden:
- 1:
    A cauldron, bubbling something green and deeply unwise.
    Snape: No. Do not touch that. # portrait:snape_annoyed
    You touch it. # cam:shake
    ~ snape_sighs++
    Snape: ...Of course. # portrait:snape # sfx:sigh
- 2:
    You touch it again. It burps.
    Snape: Twice. You have touched it twice. # portrait:snape_annoyed
- 3:
    Snape: It is not going to become more interesting the third time. # portrait:snape_annoyed
    It becomes slightly more interesting. A bubble shaped like a tiny crown floats up and pops. # sfx:chime
    Snape: ...That proves nothing. # portrait:snape
- else:
    Snape: {~I am adding this to the list.|That is {touched_forbidden} times. I am keeping count. Someone should.|Miss Ishu. The list grows.} # portrait:snape_annoyed
}
-> END

=== portrait_cadogan ===
{ portrait_cadogan > 1:
    Sir Cadogan: En garde! ...No? Very well. Ask Violet. East wall. Loud.
    -> END
}
Sir Cadogan: Halt! Who goes there? Have at thee, small knave!
Sir Cadogan: ...Oh. You're the Seeker. My apologies. You're shorter than the prophecy suggested.
Snape: Even the paintings noticed. # portrait:snape_smug
Sir Cadogan: I know nothing of clues, fair maiden. But Violet, across the hall, knows EVERYTHING. The woman cannot keep a secret to save her frame.
-> END

=== portrait_violet ===
{ heard_riddle:
    Violet: Where the brave hang their colours, darling. I can't make it plainer without becoming a banner myself.
    -> END
}
Violet: Ooh! The Seeker! Everyone is talking about you, dear. Absolutely everyone.
Violet: Well. The portraits. And the suits of armour. And Peeves, but nobody listens to Peeves.
* [Did you see anyone hide a clue?]
    Violet: Did I! Earlier tonight. Someone in a hood. Very mysterious. Terrible at whispering.
* [Everyone is talking about me?]
    Violet: Oh, yes. Apparently this whole thing was made for you. Whatever that means. Anyway! The hooded one.
    Violet: Very mysterious. Terrible at whispering.
- Violet: They tucked something away where the brave hang their colours. Then they said "she'll love this" and left.
~ heard_riddle = true
Snape: Where the brave hang their colours. How very subtle. # portrait:snape_smug
-> END

=== banner_red ===
{ clue1:
    The Gryffindor banner. Red, gold, and very pleased with itself.
    -> END
}
{ not heard_riddle:
    The Gryffindor banner. Red and gold. Your colours.
    Something crinkles behind it. But you'd need a reason to go rummaging behind school property.
    -> END
}
You lift the corner of the Gryffindor banner.
Tucked behind it is a Chocolate Frog card. # sfx:chime
It's Albus Dumbledore, looking extremely pleased with himself. # give:frogCard
On the back, in fresh ink, someone has written a large number one. And a single letter. A.
~ clue1 = true
~ fragments = 1
~ house_points += 10
Somewhere, an hourglass clinks. Ten points to Gryffindor, apparently. # sfx:chime
Snape: A Chocolate Frog card. The treasure hunt of the century. # portrait:snape_smug
Snape: Dumbledore. Of course it is Dumbledore. The man never met a theatrical clue he didn't like. # portrait:snape_annoyed
A cold draught moves through the hall. The torches bow. # sfx:sting # show:figure
At the far end of the hall, by the west archway, someone in a hood is watching you.
~ figure_seen = true
Then they aren't.
Snape: ... # portrait:snape_shock
Snape: Did you see that? # portrait:snape
* [Yes!]
    Snape: Good. Neither did I. # portrait:snape_annoyed
* [See what?]
    Snape: Precisely. Nothing. We saw nothing. # portrait:snape
- Snape: The Library. West archway. Now. # portrait:snape # quest:c1_library
-> END

=== banner_blue ===
The Ravenclaw banner. There's a riddle stitched on the back. It's a very good riddle.
You don't have time. You're not a Ravenclaw.
-> END

=== banner_yellow ===
The Hufflepuff banner. Behind it, a little note.
"Nothing here! But thank you so much for checking. Have a lovely day!"
-> END

=== banner_green ===
Snape: Leave my house's banner alone. # portrait:snape_annoyed
You leave his house's banner alone. For now.
-> END

=== great_hall_doors ===
{ ch1_done:
    The doors to the Great Hall are locked. Behind them, nothing at all. Not even whispering.
    -> END
}
The doors to the Great Hall are locked.
Behind them, whispering. Something is being prepared. Something you are not allowed to see.
Yet.
-> END

=== hourglass ===
{ house_points == 0:
    Gryffindor's house-point hourglass. Zero points tonight. The rubies look disappointed in you specifically.
- else:
    Gryffindor's house-point hourglass. {house_points} points tonight. The rubies look smug.
}
-> END

=== stairs ===
The grand staircase has moved. It does that. It's moody.
Snape: Relatable. # portrait:snape
-> END

=== mcgonagall ===
{ mcgonagall > 1:
    { clue1:
        McGonagall: The Library, Miss Ishu. And do keep an eye on Severus. He gets lost in thought. Mostly dark ones. # portrait:mcgonagall_smug
    - else:
        McGonagall: {heard_riddle: Colours, dear. The brave keep theirs close.|Try the portraits. Violet in particular. She hasn't kept a secret in four hundred years.} # portrait:mcgonagall
    }
    -> END
}
McGonagall: Miss Ishu. Welcome to Hogwarts. We've been expecting you. # portrait:mcgonagall_soft
McGonagall: Severus, do try to be pleasant. # portrait:mcgonagall
Snape: I am being pleasant. This is my pleasant face. # portrait:snape_annoyed
McGonagall: Heaven help us all. # portrait:mcgonagall_annoyed
~ house_points += 10
McGonagall: A Gryffindor, I see. Ten points, simply for arriving in a better mood than him. # portrait:mcgonagall_smug # sfx:chime
-> END

=== ginny ===
{ ginny > 1:
    Ginny: {~Still following you around, is he? Bat-Bogey Hex. Just say the word.|Go on, then. The treasure won't find itself.|If you find anything good, I want to hear everything.} # portrait:ginny_happy
    -> END
}
Ginny: You're the Seeker? Brilliant. Everyone's been whispering about you all night. # portrait:ginny_happy
Ginny: If he gives you any trouble... # portrait:ginny_smug
She twirls her wand meaningfully.
Ginny: My Bat-Bogey Hex is very reliable. # portrait:ginny_smug
Snape: I heard that, Miss Weasley. # portrait:snape_annoyed
Ginny: You were meant to, Professor. # portrait:ginny_happy
Ginny: Oh, and my brother told me to tell you something. Don't let the Muggles get you down. # portrait:ginny_soft
Ginny: He says it to everyone. But I think he meant it for you. # portrait:ginny_soft
-> END

=== library_door ===
{ not clue1:
    A dark archway. A sign reads LIBRARY, and underneath, smaller, "Silence. This means you."
    Snape: The Library will not help you until you have something worth looking up. # portrait:snape
    -> END
}
{ ch1_done:
    Snape: We have had quite enough of the Library. The Library has had quite enough of you. # portrait:snape
    -> END
}
The Library doors creak open. Somewhere inside, a page turns by itself. # sfx:door
Snape: After you. Obviously. # portrait:snape_smug # warp:library:entry
-> END

=== hall_empty ===
~ hall_empty_seen = true
The Entrance Hall is empty. # sfx:sting
No McGonagall. No Ginny. No whispering behind the Great Hall doors.
The torch by the stairs has gone out.
Snape: ... # portrait:snape
Snape: Stay close. # portrait:snape
* [Are you... worried?]
    Snape: I am alert. It is different. It involves more frowning. # portrait:snape_annoyed
* [Was that a request?]
    Snape: It was not. # portrait:snape
- The Map in your bag rustles. A new line of ink crawls out of the castle doors and down towards the trees. # sfx:whoosh
Snape: The Forbidden Forest. At night. Naturally. # portrait:snape_annoyed
~ snape_sighs++
Snape: After you, Miss Ishu. I insist. Purely for tactical reasons. # portrait:snape_smug # done # end_demo:ch1
-> END
