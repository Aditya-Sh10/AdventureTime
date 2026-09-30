// Prologue test story — placeholder until GDD v1. Convention: "Speaker: text", tags "# portrait:id".
VAR touched_sign = 0

=== sign ===
~ touched_sign = touched_sign + 1
{touched_sign > 1: -> sign_again}
Snape: No. Do not touch that. # portrait:snape
Narrator: You touch it.
Snape: ...Of course. # portrait:snape
* [Read the sign]
    Sign: "Whoever reads this is now bound to the Contract."
    Snape: Wonderful. Truly. My evening is ruined. # portrait:snape
* [Apologise]
    Snape: Your apology is noted. And discarded. # portrait:snape
- -> END

= sign_again
Snape: You have read it {touched_sign} times. It has not changed. # portrait:snape
-> END
