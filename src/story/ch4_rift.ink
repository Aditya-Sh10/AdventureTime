// ============================================================================
// Chapter 4: The Multiverse Rift. A neon hub, three tears: Hell's Kitchen (radar sense), Queens (web-zip),
// the Tower (lanterns). Three shards fix the core → it folds into "0" (fragment 4) + clause 5.
// ============================================================================

=== rift_arrive ===
~ rift_seen = true
You step through the crack in the courtroom wall, and the floor stops being a floor. # chapter:ch4 # sfx:whoosh
Neon platforms hang in the dark. Pink, cyan, humming. Below them there is no below.
Snape: Neon. # portrait:snape_annoyed
Snape: It is everywhere. It is in my eyes. I think it is in my robes. # portrait:snape_annoyed
~ snape_sighs++
In the middle of the platform, something sits on a cracked stone pedestal. Something small. Something with ears.
* [Is that... my Batman?]
    Snape: You own that? # portrait:snape_shock
    Snape: Of course you own that. # portrait:snape
* [Why is there a bat?]
    Snape: I was about to ask you the same question, and I resent that you asked it first. # portrait:snape_annoyed
- -> rift_bat

=== rift_bat ===
{
- shards >= 3:
    The Batman soft toy looks at the three shards in your hands. Then at the core. Then, pointedly, back at you.
    -> END
- met_bat:
    { stopping:
    - The Batman soft toy broods. It is very good at it. It has had practice, on your bed.
    - You squeeze it. It does not squeak. It is above squeaking.
    - Snape: The bat is judging me. I recognise the technique. I invented it. # portrait:snape_annoyed
    }
    -> END
}
~ met_bat = true
Your Batman soft toy, sitting on the edge of the multiverse, cape slightly crooked. A tag is safety-pinned to it.
"WRONG UNIVERSE. Please return to, Ishu's bed, left side, next to the pillow. G."
Under it, smaller. "He was guarding this. Don't let him take credit. He will try."
Snape: Why, in the name of everything, is there a bat. # portrait:snape_annoyed
* [WHY is Gamora?]
    Snape: ... # portrait:snape_shock
    Snape: I do not know who Gamora is. I resent the question. I resent its grammar. # portrait:snape_annoyed
    ~ snape_sighs++
* [He's Batman. He doesn't need a reason.]
    Snape: That is precisely the kind of thing a bat would say. # portrait:snape
- The pedestal under it is cracked right through. Three empty sockets glint in it. Red, blue, gold.
Snape: Three sockets. Three tears in reality, glowing at us in matching colours. # portrait:snape
Snape: Someone designed this for a child. Or for you. I apologise, that was redundant. # portrait:snape_smug # quest:c4_shards
-> END

=== rift_core ===
{
- core_done:
    The pedestal is whole again, and very quietly humming. Smug, almost.
    -> END
- shards >= 3:
    -> rift_finale
}
The cracked rift core. {shards == 0:Three empty sockets.|{shards} of three sockets filled. The rest stay dark.}
{ rift_core > 1: -> END }
Snape: Do not touch the core of reality, Miss Ishu. # portrait:snape
* [Touch it anyway.]
    ~ touched_forbidden++
    You poke it. The entire multiverse flickers, like a bulb about to go. Somewhere, very far away, a car alarm starts up.
    Snape: I am adding that to the list. There is a list. # portrait:snape_annoyed
* [Fine. I won't.]
    Snape: I have it in writing now. Hold still while I frame this moment. # portrait:snape_smug
- -> END

=== rift_majnu ===
{ rift_majnu > 1:
    The horse is still in its field. It has not moved. It never will. That is the genius of it.
    -> END
}
A painting floats on an easel in the void. A horse, in a sunny field, with tremendous confidence. Signed in the corner, "Majnu".
Snape: That is the worst painting I have ever seen. And I have taught in a castle full of moving portraits. # portrait:snape_annoyed
* [Majnu bhai ki painting hai. Respect karo.]
    Snape: I do not know what you said, but I feel I have been threatened by a horse. # portrait:snape_shock
* [Control, Uday. CONTROL.]
    Snape: Who is Uday? # portrait:snape
    Snape: Why am I Uday? # portrait:snape_annoyed
    ~ snape_sighs++
- -> END

// --- Hell's Kitchen (red tear): radar sense ---

=== matt ===
{
- shard_red:
    Matt: Your heart's calmer than when you arrived. Good. # portrait:daredevil
    Matt: Tell your friend his skipped again. Just now. When you laughed at the painting. # portrait:daredevil_smug
    Snape: Age. It is age. # portrait:snape_annoyed
    -> END
- met_matt:
    Matt: Glasses off. Stop looking. Listen. Then walk toward whatever sounds wrong. # portrait:daredevil
    -> END
}
~ met_matt = true
A dark rooftop. Rain that isn't falling. A man in a black cloth mask stands at the edge, head tilted, as if the city were talking to him.
Matt: Three heartbeats. One very fast, one very small, and one that's pretending it isn't there. # portrait:daredevil
Snape: I am simply a calm person. # portrait:snape_annoyed
Matt: You're a lawyer, right? Law student. I can tell. You've got that fourth-year tired in your breathing. # portrait:daredevil_smug
* [How can you possibly tell that?]
    Matt: Same reason I can tell your friend hasn't slept since 1998. # portrait:daredevil
* [Are you a lawyer too?]
    Matt: By day. Small firm. Two partners, one desk, no money. Very ethical. # portrait:daredevil_happy
- Matt: Something fell out of your rift onto this roof. Something that hums. I can hear it. You can't see it. # portrait:daredevil
Matt: So stop seeing. Take your glasses off. # portrait:daredevil
* [Take your glasses off.]
    You take your glasses off. The world goes soft and smeary, like a painting left in the rain.
* [Without my glasses I can't see ANYTHING.]
    Matt: Perfect. Now you're qualified. # portrait:daredevil_smug
    You take them off anyway. The world goes soft and smeary, like a painting left in the rain.
- Then you stop trying to see. You listen. # cam:flash # sfx:chime
Sounds draw shapes in red. A water tank, ringing faintly. Wind across a chimney. And low down, by the far parapet, a hum that does not belong to this city.
~ radar = true
Snape: You have removed your glasses and are now walking toward a noise. In the dark. On a roof. # portrait:snape
Snape: I will be standing here, holding no responsibility whatsoever. # portrait:snape_smug
-> END

=== hk_tower ===
{ not radar:
    A water tower. In the dark, it is mostly a shape, and the shape is mostly rust.
    -> END
}
~ sai_seen = true
The water tower rings in red. Something is stuck in its side. A long, three-pronged blade, buried almost to the hilt.
Wrapped around the grip, a red ribbon, and a slip of paper. "Some people are worth the whole mess."
* [Elektra was here.]
    Matt: ... # portrait:daredevil
    Matt: Leave it. Please. # portrait:daredevil_soft
* [That is the most romantic thing on this roof.]
    Snape: It is a knife, Miss Ishu. # portrait:snape
    Snape: ... It is a romantic knife. Fine. # portrait:snape_annoyed
- -> END

=== hk_chimney ===
{ radar:
    The chimney echoes in red. Inside it, very faintly, someone is snoring. It stops when you lean closer.
    Snape: Do not tell me. I do not wish to know. # portrait:snape_annoyed
- else:
    A brick chimney, cold. Something inside it sounds like breathing. Probably wind.
}
-> END

=== hk_shard ===
~ shard_red = true
~ shards++
By the parapet, glowing red where your ears say it should be, a jagged crystal shard. It hums at exactly the pitch of the rift. # give:shardRed # sfx:pickup
You put your glasses back on. The world sharpens. The shard is still there, being smug.
Matt: There. You hear the world for one minute, and it gets a lot louder. # portrait:daredevil_soft
-> rift_shard_check

// --- Queens (blue tear): web-zip ---

=== spidey ===
{
- shard_blue:
    Spider-Man: You did the swing! First try! I fell off my first one. Twice. Don't tell anyone. # portrait:spidey_happy
    -> END
- web:
    Spider-Man: Point at the gap, flick your wrist. If it goes wrong, it was the web's fault. That's what I say. # portrait:spidey
    -> END
}
~ met_spidey = true
A boy in a red-and-blue suit sits on the parapet, legs swinging over a drop that doesn't end. He waves with his whole arm.
Spider-Man: Oh, hey! Hi! You fell out of the sky too? Same. Kind of my whole thing. # portrait:spidey_happy
Spider-Man: There's, like, three of me in the multiverse right now. I'm one of the three. # portrait:spidey
Spider-Man: The best one, according to a very reliable source. # portrait:spidey_smug
* [You ARE the best one. I've always said so.]
    Spider-Man: See? Reliable. Very reliable source. # portrait:spidey_happy
    Snape: Unbearable. # portrait:snape_annoyed
* [Which one are you?]
    Spider-Man: The one with the best hair under the mask. And the most apologies. Sorry. See, there's one. # portrait:spidey_smug
- Snape: Do you always talk this much? # portrait:snape_annoyed
Spider-Man: When I'm nervous! Also when I'm not. Hey, quick question, which princess would you be? # portrait:spidey
Spider-Man: Me? Cinderella. 'Cause she broke. # portrait:spidey_smug
Spider-Man: ... Homie, lemme borrow twenty dollars. # portrait:spidey_happy
Snape: I am going to lie down on this roof and never get up. # portrait:snape_shock
~ snape_sighs++
Spider-Man: Something blue landed on the roof over there. Across the gap. I'd get it, but my aunt says I should let people solve their own problems. # portrait:spidey
Spider-Man: Here. Spare web-shooter. Point at the gap, flick your wrist. # portrait:spidey_happy # give:webShooter
~ web = true
Snape: You are not swinging across a void on a string made by a teenager. # portrait:snape
Snape: ... You are. I can see it on your face. # portrait:snape_annoyed
-> END

=== q_zip_there ===
{ not web:
    A gap between the rooftops. On the far side, something glints blue. It is too far to jump, especially for you.
    Snape: Do not even consider it. Your legs are not a long-range option. # portrait:snape_smug
    -> END
}
You point at the far roof and flick your wrist. # sfx:whoosh
THWIP.
The web catches. Your stomach stays behind. For a single, wonderful second, you are flying over the multiverse. # cam:shake # warp:rift:far
-> END

=== q_zip_back ===
{ not web:
    A gap, and the near roof beyond it.
    -> END
}
You aim back at the near roof. THWIP. Your stomach, having just caught up, is left behind again. # sfx:whoosh # warp:rift:near
-> END

=== q_graffiti ===
{ q_graffiti == 1:
    On the side of the water tower, in huge spray-painted letters, "WHY IS GAMORA?"
    Underneath, in different paint, someone has answered. "nobody knows."
    Underneath that, smaller. "G. also doesn't know. G. has never known."
- else:
    "WHY IS GAMORA?" Still unanswered. Possibly unanswerable.
}
-> END

=== q_shard ===
~ shard_blue = true
~ shards++
In a puddle of city light on the far roof lies a jagged blue shard, humming like a tuning fork. # give:shardBlue # sfx:pickup
Snape is beside you. You did not see him cross. He is very slightly out of breath, and he is not looking at you.
Snape: I took the stairs. # portrait:snape
There are no stairs.
-> rift_shard_check

// --- The Tower (gold tear): lanterns ---

=== rapunzel ===
{
- shard_gold:
    Rapunzel: Come back and visit! I'll have repainted everything by then. Twice. # portrait:rapunzel_happy
    -> END
- met_rapunzel:
    Rapunzel: The lanterns! Around the room. Let them go, all three, and see what comes back down. # portrait:rapunzel
    -> END
}
~ met_rapunzel = true
The top of a stone tower, every inch of wall painted. Suns, vines, flowers. A girl with an absolutely unreasonable amount of golden hair spins round, holding a frying pan.
Rapunzel: Who are you and how did you get into my tower? # portrait:rapunzel_shock
Snape: Through a hole in the universe. Please lower the pan. # portrait:snape
Rapunzel lowers the pan. Slightly.
* [I really like your walls.]
    Rapunzel: Really? Thank you! I ran out of wall years ago. Now I just paint over the old wall. # portrait:rapunzel_happy
* [How long is your hair, exactly?]
    Rapunzel: Seventy feet. Ish. It's a lot of brushing. # portrait:rapunzel
    Snape: Seventy feet. Between the two of you, you might reach the average height of a doorway. # portrait:snape_smug
- Rapunzel: Do you read? I've read every book in this tower. Three times. One of them is about geology. # portrait:rapunzel
* [Every book. More than once. I'm a book person too.]
    Rapunzel: I KNEW it. You have the face of someone who reads under the covers with a torch. # portrait:rapunzel_happy
* [Geology is a brave choice.]
    Rapunzel: It was the only one left. I know a LOT about rocks now. # portrait:rapunzel
- Rapunzel: Okay. Something gold fell up into the sky tonight. That's backwards, but so's everything since the hole opened. # portrait:rapunzel
Rapunzel: There are three lanterns in here. Let them go, and whatever's up there might float back down to you. # portrait:rapunzel_happy
Snape: Let me be clear. I do not do lanterns. # portrait:snape
-> END

=== tower_lamp_a ===
~ lamp_a = true
-> tower_lamp

=== tower_lamp_b ===
~ lamp_b = true
-> tower_lamp

=== tower_lamp_c ===
~ lamp_c = true
-> tower_lamp

=== tower_lamp ===
~ lamps++
{ not met_rapunzel:
    ~ touched_forbidden++
    Snape: That is someone else's lantern, Miss Ishu. Add it to the list. # portrait:snape_annoyed
}
{ lamps:
- 1:
    You light the lantern and let it go. It rises, slow and golden, into the dark. # sfx:chime
- 2:
    The second lantern follows the first. Rapunzel has stopped painting to watch. # sfx:chime
- else:
    -> tower_lamp_done
}
-> END

=== tower_lamp_done ===
The third lantern rises to meet the other two. Then, from much higher up, hundreds more. # sfx:chime
The whole void fills with slow gold lights, drifting upward, as if someone, somewhere, did this every year on one particular day.
Rapunzel: Oh. # portrait:rapunzel_soft
Rapunzel: Oh, it's even better than I imagined. # portrait:rapunzel_soft
Snape is watching too. He has his arms folded, and he is not saying anything at all.
* [You're smiling.]
    Snape: I am squinting. It is very bright. # portrait:snape_soft
* [Say something mean. Quick. It's getting weird.]
    Snape: ... You are short. # portrait:snape_soft
    Snape: There. Order is restored. # portrait:snape
- Something gold drifts down out of the lights, turning slowly, and lands in your open hand. A warm shard. # give:shardGold # sfx:pickup
~ shard_gold = true
~ shards++
Rapunzel: It came back down for you! That's how you know it's yours. # portrait:rapunzel_happy
-> rift_shard_check

=== tower_bruno ===
{ tower_bruno > 1:
    The door marked BRUNO. You are not talking about it. Nobody is talking about it.
    -> END
}
A green door, firmly shut. The sign on it says BRUNO.
Rapunzel: We don't talk about that door. # portrait:rapunzel
Snape: Then do not. # portrait:snape
* [Hum it.]
    You start humming. Rapunzel starts humming. Spider-Man, from another universe, faintly, starts humming.
    Snape: STOP. # portrait:snape_shock
    ~ snape_sighs++
* [Leave it.]
    You leave it. Behind the door, someone sighs with relief.
- -> END

=== tower_sun ===
A painted sun, its rays wavy and gold. It is on every wall, in every size. Under the biggest one, tiny letters in a different hand. "G. was here. Hid the paint."
Rapunzel: I've been looking for that paint for a WEEK. # portrait:rapunzel_annoyed
-> END

// --- The core ---

=== rift_shard_check ===
{ shards >= 3:
    Three shards. Red, blue, gold. They hum at each other across your bag, impatient.
    Snape: Back to the hub. To the bat, and its rock. Before something else tries to befriend us. # portrait:snape # quest:c4_core
}
-> END

=== rift_finale ===
~ core_done = true
You set the shards into the sockets. Red. Blue. Gold. # take:shardRed # take:shardBlue # take:shardGold # sfx:open
For a moment nothing happens. Then the crack in the pedestal glows, and seals, and the glow keeps going. # cam:flash # sfx:boom
The neon bends. The tears around the hub fold toward the core like pages closing. Matt's rooftop, Queens, the painted tower, all of it, folding in.
Everything shrinks into a single ring of light, small enough to hold. It drops into your palm. Warm. Perfectly round.
A zero. # give:zero # sfx:chime
~ fragments = 4
Snape: One. Four. One. Zero. # portrait:snape
* [Wait. One, four, one, zero... that's...]
    Snape: A very small number? A very large one? It means nothing to me. # portrait:snape
    Snape: You look as if it means something to you. Interesting. # portrait:snape_smug
* [Means nothing to me either.]
    Snape: Liar. Your face is doing something. # portrait:snape_smug
- A cold draught moves across the platform. # show:figure # sfx:whoosh
For a breath you can see into every tear at once before they finish closing. In each one, a hooded figure, asleep. One against the water tank. One on the parapet. One curled up beside the tower door.
Variants. All of them asleep.
On the pedestal, where the core was cracked, a folded note.
"Checked every universe. You find it in all of them. Sorry about the bat, he insisted. G."
* [He let my Batman guard his rift.]
    Snape: And the bat did a better job than he did. He was asleep in four universes at once. # portrait:snape_annoyed
* [Every universe...]
    Snape: Do not go soft on me now. We are not finished. # portrait:snape_soft
- You pick up the Batman soft toy. It fits exactly where it always does, under your arm. # give:batplush
The Contract grows warm in your bag. # sfx:open
~ clauses = 5
Snape: Clause Five. # portrait:snape
Snape: "The Seeker's preferred Spider-Man is the correct Spider-Man. The Guide shall not debate this." # portrait:snape_annoyed
Snape: "The Author tried once. The Author lost." # portrait:snape_shock
Snape: I was not going to debate it. I do not know who any of these people are. # portrait:snape_annoyed
~ snape_sighs++
~ house_points += 10
The Map rustles. New ink runs across it, a long corridor, and the parchment goes cold under your fingers. # sfx:whoosh
~ ch4_done = true
Snape: Cold. Good. Finally, a place with some taste. # portrait:snape_smug # done # end_demo:ch4
-> END
