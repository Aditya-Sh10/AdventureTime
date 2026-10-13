import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { sfx } from '@/game/systems/audio';
import { useSettings, type Scare, type TextSpeed } from '@/store/settingsStore';

/**
 * "The cozy console": settings as a little wooden control board. Volume = 10-pip meters, options = chips,
 * on/off = pixel switches. Every control is keyboard-operable with proper roles (slider / radiogroup / switch).
 * Shared by the title screen and the in-game menu.
 */

const SPEEDS: { id: TextSpeed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
  { id: 'instant', label: 'Instant' },
];
const SCARES: { id: Scare; label: string }[] = [
  { id: 'gentle', label: 'Gentle' },
  { id: 'reduced', label: 'Reduced' },
  { id: 'full', label: 'Full' },
];

export function SettingsPanel() {
  const s = useSettings((x) => x);
  return (
    <div className="space-y-5 font-pixel text-lg text-parch" data-testid="settings-panel">
      <Section icon={<SpeakerIcon />} title="Sound">
        <PipSlider label="Everything" value={s.master} onChange={(v) => s.set({ master: v })} />
        <PipSlider label="Music" value={s.music} onChange={(v) => s.set({ music: v })} />
        <PipSlider label="Sounds" value={s.sfx} onChange={(v) => s.set({ sfx: v })} />
        <Switch label="Character voice blips" value={s.voices} onChange={(v) => s.set({ voices: v })} />
      </Section>
      <Section icon={<QuillIcon />} title="Story">
        <Chips label="Text speed" options={SPEEDS} value={s.textSpeed} onChange={(v) => s.set({ textSpeed: v })} />
        <Switch label="Snape's hints when stuck" value={s.hints} onChange={(v) => s.set({ hints: v })} />
      </Section>
      <Section icon={<CandleIcon />} title="Comfort">
        <Chips label="Spookiness" options={SCARES} value={s.scare} onChange={(v) => s.set({ scare: v })} />
        <Switch label="Reduced motion" value={s.reducedMotion} onChange={(v) => s.set({ reducedMotion: v })} />
        <Switch label="Fancy lighting (off = faster)" value={s.lighting} onChange={(v) => s.set({ lighting: v })} />
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border-2 border-gold/25 bg-black/20 px-4 pt-2 pb-3">
      <h3 className="mb-2 flex items-center gap-2 font-title text-[10px] tracking-widest text-gold uppercase">
        <span aria-hidden="true" className="text-gold">
          {icon}
        </span>
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Row({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <span id={id}>{label}</span>
      {children}
    </div>
  );
}

const idOf = (label: string) => 'set-' + label.toLowerCase().replace(/[^a-z]+/g, '-');

/** 10-pip volume meter. Click or drag across the pips; arrows / Home / End on the keyboard. */
function PipSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pips = Math.round(value * 10);
  const set = (n: number) => {
    const v = Math.max(0, Math.min(10, n)) / 10;
    if (v !== value) {
      onChange(v);
      sfx.play('select');
    }
  };
  const fromPointer = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    set(Math.round(((e.clientX - r.left) / r.width) * 10));
  };
  const onKey = (e: KeyboardEvent) => {
    const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (d) set(pips + d);
    else if (e.key === 'Home') set(0);
    else if (e.key === 'End') set(10);
    else return;
    e.preventDefault();
  };
  const id = idOf(label);
  return (
    <Row label={label} id={id}>
      <div className="flex items-center gap-3">
        <div
          ref={ref}
          role="slider"
          tabIndex={0}
          aria-labelledby={id}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pips * 10}
          aria-valuetext={pips === 0 ? 'off' : `${pips * 10} percent`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => e.buttons && fromPointer(e)}
          className="flex h-8 cursor-pointer touch-none items-end gap-[3px] rounded px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={`w-2.5 rounded-[1px] transition-colors duration-150 ${i < pips ? 'bg-gold shadow-[0_0_6px_rgba(233,196,106,0.5)]' : 'bg-parch/15'}`}
              style={{ height: `${30 + i * 7}%` }}
            />
          ))}
        </div>
        <span className="w-10 text-right font-title text-[9px] text-gold/90 tabular-nums">{pips === 0 ? 'OFF' : pips * 10}</span>
      </div>
    </Row>
  );
}

/** Pixel on/off switch (role=switch), with the state spelled out so colour isn't the only cue. */
function Switch({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const id = idOf(label);
  return (
    <Row label={label} id={id}>
      <button
        role="switch"
        aria-checked={value}
        aria-labelledby={id}
        onClick={() => {
          onChange(!value);
          sfx.play('select');
        }}
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className={`relative inline-block h-6 w-11 shrink-0 rounded-[4px] border-2 transition-colors duration-200 ${value ? 'border-gold bg-gold/30' : 'border-parch/30 bg-black/30'}`}>
          <span
            className={`absolute top-0.5 left-0 block h-4 w-4 rounded-[2px] transition-transform duration-200 ease-out ${value ? 'translate-x-[22px] bg-gold' : 'translate-x-[2px] bg-parch/50'}`}
          />
        </span>
        <span className={`inline-block w-8 text-left font-title text-[9px] ${value ? 'text-gold' : 'text-parch/50'}`}>{value ? 'ON' : 'OFF'}</span>
      </button>
    </Row>
  );
}

/** Single-choice chips (radiogroup): arrow keys move the choice, like native radios. */
function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const id = idOf(label);
  const pick = (v: T) => {
    if (v !== value) sfx.play('select');
    onChange(v);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = (i + d + options.length) % options.length;
    pick(options[next].id);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };
  return (
    <Row label={label} id={id}>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1.5">
        {options.map((o, i) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(o.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`min-h-9 cursor-pointer rounded-[4px] border-2 px-3 text-base transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                on ? 'border-gold bg-gold text-ink' : 'border-parch/25 text-parch/80 hover:border-gold/60 hover:text-gold'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Row>
  );
}

/* Tiny pixel icons (SVG rects, crisp at any size). Decorative: hidden from screen readers by the caller. */
const px = { shapeRendering: 'crispEdges' as const };
function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 7 7" fill="currentColor" style={px}>
      <rect x="0" y="2" width="2" height="3" />
      <rect x="2" y="1" width="1" height="5" />
      <rect x="3" y="0" width="1" height="7" />
      <rect x="5" y="2" width="1" height="3" />
      <rect x="6" y="1" width="1" height="5" opacity="0.6" />
    </svg>
  );
}
function QuillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 7 7" fill="currentColor" style={px}>
      <rect x="5" y="0" width="2" height="1" />
      <rect x="4" y="1" width="2" height="1" />
      <rect x="3" y="2" width="2" height="1" />
      <rect x="2" y="3" width="2" height="1" />
      <rect x="1" y="4" width="2" height="1" />
      <rect x="0" y="5" width="1" height="2" />
    </svg>
  );
}
function CandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 7 7" fill="currentColor" style={px}>
      <rect x="3" y="0" width="1" height="2" opacity="0.8" />
      <rect x="2" y="2" width="3" height="4" />
      <rect x="1" y="6" width="5" height="1" />
    </svg>
  );
}
