"""
Trim, fade and loudness-normalise the raw sounds in src/sounds → src/sounds/sfx/<name>.mp3 (mono, 96k).
Usage (needs ffmpeg on PATH):  python scripts/process_sounds.py src/sounds src/sounds/sfx
Add a row to JOBS for a new sound, then set its in-game level in src/data/sounds.ts (SAMPLE_GAIN).
"""
import subprocess, sys, math, array, os
SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
# name: (source, start, dur or None, fade_in, fade_out[, extra ffmpeg filter])
JOBS = {
  'chime':      ('chime.mp3', 0, 1.0, 0, 0.25),
  'pickup':     ('pickup.mp3', 0, None, 0, 0.05),
  'select':     ('select.mp3', 0.14, 0.35, 0, 0.15),
  'open':       ('open.mp3', 0.05, 1.25, 0, 0.3),
  'door':       ('door.mp3', 0, 1.9, 0, 0.6),
  'sting':      ('scary-sting.mp3', 0.18, 3.0, 0, 0.8),
  'boom':       ('boom.mp3', 0, None, 0, 0.2),
  'sigh':       ('sigh.mp3', 0, 1.2, 0, 0.2),
  'firework':   ('firework.mp3', 1.6, 2.9, 0.2, 0.7),
  'map':        ('map-rustle.mp3', 0, None, 0, 0.15),
  'draught':    ('draught.mp3', 0.8, 3.2, 0.4, 1.2),
  'scream':     ('book-scream.mp3', 0.35, 1.6, 0, 0.45),
  'owl':        ('owl.mp3', 0, 1.95, 0, 0.2),
  'gavel':      ('gavel.mp3', 0, 1.75, 0, 0.35),
  'objection':  ('objection.mp3', 0, 1.7, 0, 0.4),
  'thwip':      ('web-thwip.mp3', 0.08, None, 0, 0.1),
  'vhs':        ('vhs-noise.mp3', 0, 4.5, 0.3, 1.0),
  'musicbox':   ('music-box.mp3', 0.08, 8.0, 0, 1.5),
  'woof':       ('dog-woof-woof.mp3', 0, 1.2, 0, 0.1),
  'chest':      ('chest-open.mp3', 0, 1.0, 0, 0.2),
  'page':       ('page-flip.mp3', 0.05, 0.8, 0, 0.15),
  'amb-fire':   ('amb-fire.mp3', 0, None, 0, 0),
  # crickets only: the raw file is mostly low rumble, which reads as ocean waves
  'amb-forest': ('amb-forest-night.mp3', 0.08, 8.85, 0, 0, 'highpass=f=1500,highpass=f=1500'),
}
for i, t in enumerate([1.1, 1.83, 3.05, 3.82]): JOBS[f'step-grass-{i+1}'] = ('step-grass.mp3', t - 0.03, 0.32, 0.005, 0.12)
for i, t in enumerate([1.55, 3.42, 4.35, 5.34]): JOBS[f'step-wood-{i+1}'] = ('step-wood.mp3', t - 0.03, 0.34, 0.005, 0.12)

TARGET_RMS, PEAK_CAP = -18.0, -1.0

def decode(path, filt):
    raw = subprocess.run(['ffmpeg','-v','error','-i',path,'-af',filt,'-ac','1','-ar','44100','-f','s16le','-'],capture_output=True).stdout
    a = array.array('h'); a.frombytes(raw); return a

def active_rms_peak(a, sr=44100):
    n = int(sr*0.02); wins=[]
    for i in range(0, len(a), n):
        s = a[i:i+n]
        if s: wins.append(math.sqrt(sum(x*x for x in s)/len(s))/32768)
    top = max(wins); act = [w for w in wins if w > top*0.03]  # within 30 dB of the loudest window
    rms = math.sqrt(sum(w*w for w in act)/len(act))
    peak = max(abs(x) for x in a)/32768
    return 20*math.log10(rms), 20*math.log10(peak)

for name, (src, start, dur, fi, fo, *extra) in JOBS.items():
    path = os.path.join(SRC, src)
    total = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',path],capture_output=True,text=True).stdout)
    d = min(dur, total - start) if dur else total - start
    f = [f'atrim=start={start}:duration={d}', 'asetpts=PTS-STARTPTS']
    f += extra
    if fi: f.append(f'afade=t=in:d={fi}')
    if fo: f.append(f'afade=t=out:st={max(0, d - fo)}:d={fo}')
    base = ','.join(f)
    rms, peak = active_rms_peak(decode(path, base))
    gain = min(TARGET_RMS - rms, PEAK_CAP - peak)
    out = os.path.join(OUT, name + '.mp3')
    subprocess.run(['ffmpeg','-v','error','-y','-i',path,'-af',base + f',volume={gain:.2f}dB','-ac','1','-ar','44100','-b:a','96k',out],check=True)
    print(f'{name:14} {d:5.2f}s  rms {rms:6.1f} peak {peak:6.1f}  gain {gain:+6.1f} dB  -> {os.path.getsize(out)//1024} KB')
