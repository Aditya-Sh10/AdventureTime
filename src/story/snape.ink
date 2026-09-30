// Snape as a follower: talk to him anytime for a (grudging) contextual hint. Grows warmer by chapter.

=== snape_talk ===
~ snape_sighs++
{
- clue1:
    Snape: {~The Library. West archway. Before I age further.|You have a card with a number on it. Congratulations. Library.|The Library, Miss Ishu. It is the room with the books.} # portrait:snape_annoyed
- heard_riddle:
    Snape: {~Where the brave hang their colours. It is not a difficult riddle.|Red. Gold. Lion. Banner. Must I draw you a diagram?} # portrait:snape_smug
- else:
    Snape: {~The portraits, Miss Ishu. The talking ones.|I am not a hint machine.|(a long, theatrical sigh)} # portrait:snape_annoyed # sfx:sigh
}
-> END
