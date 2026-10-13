// ============================================================================
// Chapter 3: The Wizengamot. Ishu on trial for touching things (her stats are the charges).
// Divisha defends, Guddu testifies, Snape prosecutes (delighted). OBJECTION duel → Case No. 1 + clause 4.
// ============================================================================

=== court_arrive ===
~ court_seen = true
A gavel bangs, very close. # chapter:ch3 # sfx:gavel
You are standing in a courtroom. Mahogany, gold, and a public gallery full of people in identical curly white wigs.
None of them turn around.
McGonagall: Order. ORDER. # portrait:mcgonagall
McGonagall: The Wizengamot is now in session. The case of the Wizengamot versus the Seeker. # portrait:mcgonagall
* [The Seeker? That's... me?]
    McGonagall: It is, Miss Ishu. Do try to look innocent. # portrait:mcgonagall
* [What am I being charged with?]
    McGonagall: Touching things. Many things. The prosecution has a list. # portrait:mcgonagall
- A slip of parchment appears in Snape's hand. He reads it. His eyebrows climb.
Snape: The court has appointed me... prosecutor. # portrait:snape_shock
Snape: Clause One says I must accompany you. It says nothing whatsoever about defending you. # portrait:snape_smug
Snape: For the first time since that wretched letter, I am enjoying myself. # portrait:snape_smug
McGonagall: The defendant will confer with her counsel. The court resumes when the defence is ready. # portrait:mcgonagall # quest:c3_counsel
-> END

=== divisha ===
{ met_counsel: -> divisha_again }
~ met_counsel = true
By the defence table, someone in glasses and a red top is calmly reading your file. She looks up.
Divisha: Hi. I'm your defence counsel. I've read everything. # portrait:divisha_happy
* [Divisha?! How are YOU here?]
    Divisha: Someone sent me a letter signed "G.", plus a law degree. # portrait:divisha
    Divisha: What, like it's hard? # portrait:divisha_smug
* [Am I in trouble?]
    Divisha: Honestly? Yes. # portrait:divisha
    Divisha: But I'm good. # portrait:divisha_smug
- Divisha: Logically, their case is three claims. We need one piece of evidence for each. # portrait:divisha
Divisha: One, you already have. The contract in your bag. Clause Three. # portrait:divisha
~ ev_clause = true
~ evidence++
Snape: I object to the defence reading my contract. # portrait:snape_annoyed
Divisha: Overruled. You're not the judge. # portrait:divisha_smug
~ snape_sighs++
Divisha: Check the evidence table. And something in the public gallery has your name on it. Literally. # portrait:divisha # quest:c3_evidence
-> END

=== divisha_again ===
{
- verdict:
    Divisha: Not guilty. I'd hug you, but the man in black is watching and I think he'd write it down. # portrait:divisha_happy
- evidence >= 3:
    Divisha: We have everything. Go to the bench. I'll do the talking, you do the objecting. # portrait:divisha
- else:
    Divisha: The evidence table, middle of the room. And the gallery, behind the rail. Logic first, drama later. # portrait:divisha
}
-> END

=== court_evidence_table ===
{ ev_receipt:
    The evidence table. Exhibit 41 is still there. It is one mushroom, pocketed.
    -> END
}
A table of tagged exhibits. Most of them are things you touched. One is labelled "Exhibit 41, one mushroom, pocketed."
{ not met_counsel:
    Snape: Evidence for the prosecution. Hands off, until you have a lawyer. # portrait:snape_smug
    -> END
}
One tag has your name on it. An owl-post record, very official, very stamped.
"The Seeker blocked the Author. It was late. Reasons were given. They were not good reasons."
"The Seeker UNBLOCKED the Author the very next day. The Author, meanwhile, had already blocked her back."
* [I KNEW I was right.]
    Snape: You have been right exactly once. It is on file. In triplicate. # portrait:snape_annoyed
* [He blocked me back! For MONTHS!]
    Snape: And then, presumably, forgot why. # portrait:snape_smug
- You take the record. # give:receipt
~ ev_receipt = true
~ evidence++
-> court_evidence_check

=== court_stool ===
{ ev_stool:
    The spot where the step-stool was. The floor looks a little lonely.
    -> END
}
{ not met_counsel:
    A small folding step-stool sits in the gallery. Snape steps in front of it.
    Snape: Prosecution evidence. Talk to your counsel first. # portrait:snape
    -> END
}
A small folding step-stool sits in the gallery aisle. The label says "Property of the Defendant. Required for most shelves."
* [That IS mine, actually.]
    Snape: The prosecution brought it as evidence of your climbing. # portrait:snape
    Snape: I see now that was a tactical error. # portrait:snape_annoyed
* [Who keeps bringing these?]
    Snape: Everyone who has ever met you, I imagine. # portrait:snape_smug
- You fold it up and tuck it under your arm. It is almost exactly your size. # give:stool
~ ev_stool = true
~ evidence++
-> court_evidence_check

=== court_evidence_check ===
{ evidence >= 3:
    That's everything. Clause, record, step-stool.
    Snape: Then let us begin. I have been rehearsing my face. # portrait:snape_smug # quest:c3_trial
}
-> END

=== court_judge ===
{
- verdict:
    McGonagall: The court has ruled, Miss Ishu. Off you go. Something is leaking through the walls, and it is neon. # portrait:mcgonagall
    -> END
- not met_counsel:
    McGonagall: The defendant will speak to her counsel first. That is how courts work. Mostly. # portrait:mcgonagall
    -> END
- evidence < 3:
    McGonagall: Your counsel tells me the defence is still gathering evidence. The court will wait. The court is very good at waiting. # portrait:mcgonagall
    -> END
- trial_started:
    McGonagall: Shall we resume, Miss Ishu? The prosecution is still standing there looking pleased. # portrait:mcgonagall # puzzle:trial
    -> END
}
-> court_trial

=== court_trial ===
~ trial_started = true
McGonagall: The court will come to order. Prosecution, read the charges. # portrait:mcgonagall # sfx:gavel
Snape: Gladly. # portrait:snape_smug
{ touched_forbidden:
- 0:
    Snape: Since arriving in this castle, the defendant has touched nothing I told her not to touch. # portrait:snape
    Snape: Nothing. Not once. Which is, frankly, the most suspicious thing I have ever heard. # portrait:snape_annoyed
- 1:
    Snape: Since arriving in this castle, the defendant has touched one thing I explicitly told her not to touch. # portrait:snape
- else:
    Snape: Since arriving in this castle, the defendant has touched {touched_forbidden} things I explicitly told her not to touch. # portrait:snape
}
Snape: She has caused me to sigh {snape_sighs} times. I have been counting. I count everything. # portrait:snape_annoyed
Snape: And she has, on several occasions, called me "Snape". Without "Professor". # portrait:snape_shock
The gallery gasps. Every wig, at exactly the same moment.
Somewhere in the back, a spectator leaps up and cries "Tareekh pe tareekh!", then sits down again, embarrassed.
McGonagall: We have talked about this. # portrait:mcgonagall
Snape: The prosecution calls a hostile witness. # portrait:snape_smug
Your little sister strolls into the witness box and slides her sunglasses down. Over her glasses. Indoors.
Guddu: Main baddie hoon. Write that down. # portrait:guddu_smug
* [Guddu?! You're testifying AGAINST me?]
    Guddu: Nothing personal. I just want to see you lose once. # portrait:guddu_smug
* [Take the sunglasses off, you can't see anything.]
    Guddu: I can see everything. That's the whole point. # portrait:guddu
- She throws a rock-on sign at the gallery. The wigs do not react. She does it again, harder.
Snape: The prosecution also calls a certain professor, who has disliked the defendant for some time. # portrait:snape
Divisha: Objection. Relevance. That grudge is about a third party the court has agreed never to mention. # portrait:divisha
McGonagall: Sustained. We are not opening that file. Nobody is opening that file. # portrait:mcgonagall
The professor sits back down without ever reaching the witness box.
Snape: ... Pity. # portrait:snape
McGonagall: Prosecution, make your claims. Defence, object when ready. # portrait:mcgonagall
Divisha: You present the evidence. Point, then shout. Honestly that's most of the job. # portrait:divisha_smug # puzzle:trial
-> END

=== court_verdict ===
~ verdict = true
The courtroom goes silent. Somewhere in the gallery, a wig slides gently off a head.
McGonagall: The Wizengamot has heard enough. # portrait:mcgonagall
McGonagall: On the charge of touching things... # portrait:mcgonagall
McGonagall: Not guilty. Of anything the court can actually prove. # portrait:mcgonagall # sfx:gavel # cam:shake
The gallery applauds, all at exactly the same time. Guddu applauds too, then pretends she didn't.
Guddu: I was a great witness though. # portrait:guddu_happy
Divisha: You were a terrible witness. # portrait:divisha_smug
Snape: ... # portrait:snape
Snape: For the record. Your counsel did well. You did... adequately. # portrait:snape_soft
Snape: Do not repeat that. The court reporter has been instructed to burn it. # portrait:snape_annoyed
McGonagall hands down a slim red file. Stamped across the cover, large, CASE NO. 1. And on the back, a G. # give:case1 # sfx:chime
~ fragments = 3
Snape: One. Four. One. # portrait:snape
Snape: Someone is counting. And they are almost done. # portrait:snape
A cold draught moves through the courtroom. # show:figure # sfx:draught
By the witness box, a hooded figure leans on the rail. Closer than ever. Its head is drooping, gently, like someone who sat down to watch and nodded off.
Then the rail is empty. A note sits where it leaned.
"Plaintiff withdraws. Was asleep for most of it. Well argued. G."
* [He fell asleep at my TRIAL?]
    Snape: Through your objections. Which were loud. That is almost a talent. # portrait:snape_smug
* [Wait. HE was the plaintiff?]
    Snape: He sued you, then napped through the hearing. I am beginning to understand this G. I hate it. # portrait:snape_annoyed
- The Contract grows warm in your bag. # sfx:open
~ clauses = 4
Snape: Clause Four. # portrait:snape
Snape: "In any dispute between the Seeker and the Author, the Seeker is right." # portrait:snape_annoyed
Snape: "Counsel has advised the Author. The Author has been blocked before. He knows." # portrait:snape_shock
~ snape_sighs++
~ house_points += 10
The Map rustles. Fresh ink spills across it, and a crack in the far wall begins to glow. Not gold. Neon. # sfx:map
~ ch3_done = true
Snape: Neon. I loathe neon. # portrait:snape_annoyed # done # end_demo:ch3
-> END

=== guddu ===
{
- verdict:
    Guddu: Okay, fine, you won. Don't make it weird. # portrait:guddu
    Guddu: Main phir bhi baddie hoon. # portrait:guddu_smug
- trial_started:
    Guddu: I've given my testimony. I'm a professional. # portrait:guddu_smug
- else:
    { stopping:
    - Your little sister is leaning on the witness box, sunglasses pushed up on her head like a threat.
      Guddu: Oh. Hi. I'm a witness. For the prosecution. # portrait:guddu_smug
      Guddu: Main baddie hoon. # portrait:guddu_smug
      Snape: She has been here for an hour and has already threatened two wigs. # portrait:snape
      Snape: I like her. # portrait:snape_smug
    - Guddu: Can't talk. Witness stuff. Very secret. Very baddie. # portrait:guddu
    }
}
-> END

// --- flavour ---

=== court_portrait ===
{ stopping:
- A framed portrait of a very famous bearded man, waving at nobody in particular.
  A yellow sticky note on the frame says "Approved. Papa."
  Someone has drawn a tiny frowny face on the note. On the note, not the portrait. Diplomatic.
  Snape: I do not know who that is, and I sense very strongly that I should not ask. # portrait:snape
- The portrait waves. The note still says "Approved. Papa." The frowny face holds its ground.
}
-> END

=== court_clerk ===
{ stopping:
- The clerk's desk. A sign on it reads TAREEKH PE TAREEKH. Underneath, in smaller letters, "date after date after date".
  Snape: A court where nothing ever ends. I have attended staff meetings like this. # portrait:snape
- Date after date after date. The sign is not wrong.
}
-> END

=== court_witness_box ===
{ verdict:
    The witness box rail. Where G. leaned, there is a faint smudge of ink, and a tiny damp spot.
    Snape: He drooled. On the Wizengamot. Disgusting. Almost endearing. Mostly disgusting. # portrait:snape_annoyed
- else:
    The witness box. Polished, waiting. Someone has scratched "G was here" into the rail, then crossed it out.
}
-> END

=== court_gallery ===
{ stopping:
- Rows of spectators in identical curly white wigs. None of them turn around. None of them blink. You check.
  Snape: The public gallery. Paid by the hour to look disapproving. They are very good at it. # portrait:snape
- You wave. Forty wigs do not wave back.
- One of them is knitting. You decide not to think about it.
}
-> END

=== court_door ===
{ verdict:
    The doors are still locked. The Map's new line does not point this way anyway.
- else:
    The doors are locked. A brass plaque says "No one leaves until the verdict. That means YOU, Snape."
    Snape: ... I was not going to. # portrait:snape_annoyed
}
-> END
