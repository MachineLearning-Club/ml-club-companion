import { useMemo, useState } from 'react';
import { CalendarDays, LockKeyhole, Check, ArrowRight, Users, Sparkles } from 'lucide-react';
import type { LearningProfile } from '../core/types';
import { evaluateGeneric } from '../core/validation';
import { generatePractice, sharedChallengeSeed, type GeneratorKind } from '../content/generation';

type TrackId = 'foundations' | 'ml-systems' | 'ai-engineering';
type TrackConfig = {
  id: TrackId;
  title: string;
  unlockPuzzle: string;
  unlockLabel: string;
  generators: GeneratorKind[];
  week: number;
};

const TRACKS: TrackConfig[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    unlockPuzzle: 'w1-03',
    unlockLabel: 'Complete the first rules sequence (Week 1) to unlock.',
    generators: ['probability', 'expected-value'],
    week: 1
  },
  {
    id: 'ml-systems',
    title: 'ML Systems',
    unlockPuzzle: 'w2-06',
    unlockLabel: 'Reach Entropy in Week 2 to unlock ML Systems challenges.',
    generators: ['entropy', 'nearest-centroid', 'information-gain', 'knn-classify'],
    week: 3
  },
  {
    id: 'ai-engineering',
    title: 'AI & Engineering',
    unlockPuzzle: 'w5-05',
    unlockLabel: 'Reach Convolution in Week 5 to unlock AI & Engineering challenges.',
    generators: ['convolution-pixel', 'perceptron-step'],
    week: 6
  }
];

function utcDay() { return new Date().toISOString().slice(0, 10); }
function utcWeek() {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

export function Challenges({ profile, guest, onComplete }: { profile: LearningProfile; guest: boolean; onComplete: (id: string, xp: number) => void }) {
  const day = utcDay();
  const week = utcWeek();
  const [trackId, setTrackId] = useState<TrackId>('foundations');
  const [dailyInput, setDailyInput] = useState('');
  const [dailyFeedback, setDailyFeedback] = useState<'valid' | 'invalid' | null>(null);
  const [weeklyInputs, setWeeklyInputs] = useState<[string, string]>(['', '']);
  const [weeklyFeedback, setWeeklyFeedback] = useState<'valid' | 'invalid' | null>(null);

  const track = TRACKS.find(t => t.id === trackId) ?? TRACKS[0];
  const eligible = guest || !!profile.completed[track.unlockPuzzle];

  const dailySeed = useMemo(() => sharedChallengeSeed(day, track.id, track.week), [day, track.id, track.week]);
  const dailyPuzzle = useMemo(() => {
    const kind = track.generators[dailySeed % track.generators.length];
    return generatePractice(kind, dailySeed, track.week);
  }, [dailySeed, track]);

  const weeklySeedA = useMemo(() => sharedChallengeSeed(week, `${track.id}-w1`, track.week), [week, track.id, track.week]);
  const weeklySeedB = useMemo(() => sharedChallengeSeed(week, `${track.id}-w2`, Math.min(15, track.week + 1)), [week, track.id, track.week]);
  const weeklyPuzzles = useMemo(() => {
    const kindA = track.generators[weeklySeedA % track.generators.length];
    const kindB = track.generators[(weeklySeedB + 1) % track.generators.length];
    return [
      generatePractice(kindA, weeklySeedA, track.week),
      generatePractice(kindB, weeklySeedB, track.week)
    ] as const;
  }, [weeklySeedA, weeklySeedB, track]);

  const dailyId = `daily:${day}:${track.id}`;
  const weeklyId = `weekly:${week}:${track.id}`;
  const dailyClaimed = !!profile.xpAwards[`challenge:${dailyId}`];
  const weeklyClaimed = !!profile.xpAwards[`challenge:${weeklyId}`];

  const selectTrack = (id: TrackId) => {
    setTrackId(id);
    setDailyInput('');
    setDailyFeedback(null);
    setWeeklyInputs(['', '']);
    setWeeklyFeedback(null);
  };

  const checkDaily = () => {
    const parsed = Number(dailyInput);
    if (dailyInput.trim() === '' || !Number.isFinite(parsed)) {
      setDailyFeedback('invalid');
      return;
    }
    const res = evaluateGeneric(dailyPuzzle, { numberValue: parsed });
    if (res.valid) {
      setDailyFeedback('valid');
      onComplete(dailyId, 40);
    } else {
      setDailyFeedback('invalid');
    }
  };

  const checkWeekly = () => {
    const a = Number(weeklyInputs[0]);
    const b = Number(weeklyInputs[1]);
    if (weeklyInputs[0].trim() === '' || weeklyInputs[1].trim() === '' || !Number.isFinite(a) || !Number.isFinite(b)) {
      setWeeklyFeedback('invalid');
      return;
    }
    const okA = evaluateGeneric(weeklyPuzzles[0], { numberValue: a }).valid;
    const okB = evaluateGeneric(weeklyPuzzles[1], { numberValue: b }).valid;
    if (okA && okB) {
      setWeeklyFeedback('valid');
      onComplete(weeklyId, 80);
    } else {
      setWeeklyFeedback('invalid');
    }
  };

  return (
    <div className="screen-stack">
      <div className="section-title">
        <div>
          <div className="eyebrow">SHARED PRACTICE</div>
          <h1>Challenges</h1>
          <p>Deterministic offline problems shared by learners at the same curriculum level.</p>
        </div>
        <div className="header-emblem"><CalendarDays size={24} /></div>
      </div>

      <div className="seg-tabs" role="tablist" aria-label="Challenge tracks">
        {TRACKS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={trackId === t.id}
            className={trackId === t.id ? 'active' : ''}
            onClick={() => selectTrack(t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="challenge-card">
        <div className="eyebrow">DAILY · {day} UTC · {track.title.toUpperCase()}</div>
        <div className="section-row"><h2>{dailyPuzzle.title}</h2><span>+40 XP</span></div>
        <p>{dailyPuzzle.instruction}</p>
        {eligible ? (
          <>
            <div className="numeric-editor">
              <label className="field-label" htmlFor="daily-answer">YOUR ANSWER</label>
              <input
                id="daily-answer"
                className="project-title-input"
                type="number"
                step="any"
                disabled={dailyClaimed || dailyFeedback === 'valid'}
                value={dailyInput}
                onChange={e => { setDailyInput(e.target.value); setDailyFeedback(null); }}
                placeholder="Enter numeric answer…"
              />
            </div>
            {dailyClaimed || dailyFeedback === 'valid' ? (
              <div className="completion-box"><Check size={19} /> Completed — reward saved for this date.</div>
            ) : (
              <>
                <button className="action-button full" disabled={!dailyInput.trim()} onClick={checkDaily}>
                  Check daily challenge <ArrowRight size={16} />
                </button>
                {dailyFeedback === 'invalid' && <p className="feedback wrong" role="status">{dailyPuzzle.hint}</p>}
              </>
            )}
          </>
        ) : (
          <div className="not-ready"><LockKeyhole size={18} /><p>{track.unlockLabel}</p></div>
        )}
      </div>

      <div className="chapter-detail">
        <div className="eyebrow">WEEKLY · STARTING {week} UTC · {track.title.toUpperCase()}</div>
        <div className="section-row"><h2>Applied Weekly Problem Set</h2><span>+80 XP</span></div>
        {eligible ? (
          <>
            <p className="small-muted">Solve both deterministic tasks from this week&apos;s {track.title} seed.</p>
            <div className="numeric-editor">
              <label className="field-label" htmlFor="weekly-a">1. {weeklyPuzzles[0].title}</label>
              <p>{weeklyPuzzles[0].instruction}</p>
              <input
                id="weekly-a"
                className="project-title-input"
                type="number"
                step="any"
                disabled={weeklyClaimed || weeklyFeedback === 'valid'}
                value={weeklyInputs[0]}
                onChange={e => { setWeeklyInputs([e.target.value, weeklyInputs[1]]); setWeeklyFeedback(null); }}
                placeholder="Task 1 numeric answer…"
              />
            </div>
            <div className="numeric-editor">
              <label className="field-label" htmlFor="weekly-b">2. {weeklyPuzzles[1].title}</label>
              <p>{weeklyPuzzles[1].instruction}</p>
              <input
                id="weekly-b"
                className="project-title-input"
                type="number"
                step="any"
                disabled={weeklyClaimed || weeklyFeedback === 'valid'}
                value={weeklyInputs[1]}
                onChange={e => { setWeeklyInputs([weeklyInputs[0], e.target.value]); setWeeklyFeedback(null); }}
                placeholder="Task 2 numeric answer…"
              />
            </div>
            {weeklyClaimed || weeklyFeedback === 'valid' ? (
              <div className="completion-box"><Sparkles size={19} /> Weekly problem set solved — +80 XP recorded.</div>
            ) : (
              <>
                <button className="action-button full" disabled={!weeklyInputs[0].trim() || !weeklyInputs[1].trim()} onClick={checkWeekly}>
                  Check weekly set <ArrowRight size={16} />
                </button>
                {weeklyFeedback === 'invalid' && <p className="feedback wrong" role="status">Check both calculations and tolerances, then try again.</p>}
              </>
            )}
          </>
        ) : (
          <div className="not-ready"><LockKeyhole size={18} /><p>{track.unlockLabel}</p></div>
        )}
        <span className="pill"><Users size={14} /> Solution Gallery · future online release</span>
      </div>

      <p className="small-muted">Daily and weekly problems are generated deterministically offline from UTC dates. No leaderboard, penalty streaks, or internet access required.</p>
    </div>
  );
}
