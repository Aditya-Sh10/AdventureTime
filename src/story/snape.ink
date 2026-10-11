// Snape as a follower: talk to him anytime for a (grudging) contextual hint. Grows warmer by chapter.

=== snape_talk ===
~ snape_sighs++
{
- tower_seen && not chest_open:
    Snape: {~The chest, Miss Ishu. One, four, one, zero. I am not going to pretend you do not know.|It is three minutes to midnight. It has been three minutes to midnight for some time. Open the chest.} # portrait:snape
- haunt_seen && not ch5_done && not lens:
    Snape: {~Two of these doors open. Try them. Quietly.|Stay in the lantern light. I am not saying that for your sake.} # portrait:snape
- haunt_seen && not ch5_done && not tape_done:
    Snape: {~The television room. I am told it is educational.|Whatever made that footstep, I outrank it.} # portrait:snape
- haunt_seen && not ch5_done:
    Snape: {~Look at the walls, Miss Ishu. Through those glasses of yours.|Something has changed out there. I can feel it in my teeth.} # portrait:snape
- rift_seen && not core_done:
    Snape: {~I want it noted that I despise neon.|Three tears. Three shards. Even you can count to three.|If one more person in a mask greets me cheerfully, I shall resign. I cannot resign. Clause One.} # portrait:snape_annoyed
- court_seen && not verdict:
    Snape: {~I am the prosecution. I cannot help you. I would not, regardless.|Your counsel seems competent. Ask her.} # portrait:snape_smug
- forest_seen && not ch2_done:
    Snape: {~Stay in the light. I do not intend to explain your disappearance to anyone.|The forest is dark, Miss Ishu. That is its principal feature.} # portrait:snape
- clue1 && not ch1_done:
    Snape: {~The Library. West archway. Before I age further.|You have a card with a number on it. Congratulations. Library.|The Library, Miss Ishu. It is the room with the books.} # portrait:snape_annoyed
- heard_riddle:
    Snape: {~Where the brave hang their colours. It is not a difficult riddle.|Red. Gold. Lion. Banner. Must I draw you a diagram?} # portrait:snape_smug
- else:
    Snape: {~The portraits, Miss Ishu. The talking ones.|I am not a hint machine.|(a long, theatrical sigh)} # portrait:snape_annoyed # sfx:sigh
}
-> END
