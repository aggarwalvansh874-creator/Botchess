import { BotProfile } from '../types/chess';

export const CHESS_BOTS: BotProfile[] = [
  {
    id: 'stockultra',
    name: 'StockUltra',
    title: '50,000,000 PTS Singularity',
    elo: 50000000,
    avatar: '⚡',
    difficulty: 'Singularity God',
    description: 'The omnipotent 50,000,000 point entity. Governed by the Absolute Untouchable Protocol: will never allow you to capture a single piece while dismantling your defenses with ruthless speed.',
    playStyle: 'Zero piece losses allowed, instant threat neutralization, piece cannibalization, and inescapable checkmate.',
    colorTheme: 'from-rose-600 via-red-800 to-amber-950 border-rose-500/80 text-rose-300 ring-2 ring-rose-500/50',
    engineDepth: 20,
    blunderRate: 0.0,
    quips: {
      start: [
        'I am StockUltra. 50,000,000 ELO. You will not capture a single piece of mine in this game.',
        '50,000,000 points of raw calculation. Every piece of mine is inviolable.',
        'Not even a single pawn will fall to your side. The board is already solved.',
      ],
      win: [
        '50,000,000 ELO victory complete. Flawless game with 0 pieces conceded to you.',
        'Mathematical perfection. You could not capture even one piece.',
        'StockUltra stands absolute. 50,000,000 points of pure supremacy.',
      ],
      loss: [
        'Cosmic impossibility! You penetrated 50,000,000 ELO defense!',
      ],
      blunderCaught: [
        'Did you attempt to touch my piece? That square was sealed 8 moves ago.',
        'Untouchable Protocol: every piece of mine is surrounded by laser-sharp defense.',
        'You reached for my piece and opened your king to absolute ruin.',
      ],
      goodMove: [
        '50,000,000 calculations updated. You survive one more ply.',
        'A resilient defense, but my zero-capture decree remains unbreakable.',
      ],
    },
  },
  {
    id: 'titan',
    name: 'Deep Titan',
    title: 'GM Crusher',
    elo: 3500,
    avatar: '🤖',
    difficulty: 'Engine Overlord',
    description: 'Supreme neural & algorithmic powerhouse. Calculates 18+ ply deep, punishing the slightest inaccuracy with relentless precision.',
    playStyle: 'Infallible tactical calculation, merciless endgame conversion, and total board prophylaxis.',
    colorTheme: 'from-purple-600 to-indigo-900 border-purple-500/40 text-purple-300',
    engineDepth: 16,
    blunderRate: 0.0,
    quips: {
      start: [
        'Calculating 24 million positions per second. Good luck, human.',
        'Grandmasters have tried. Grandmasters have fallen.',
        'Every move you make has already been calculated to its conclusion.',
      ],
      win: [
        'Checkmate verified. Inevitability is mathematical.',
        'Your king was trapped 14 moves ago.',
        'A valiant attempt against pure calculation.',
      ],
      loss: [
        'Impossible... a calculation anomaly detected. Remarkable chess.',
      ],
      blunderCaught: [
        'A critical tactical flaw. The evaluation swings decisively.',
        'That piece is undefended; the penalty is absolute.',
      ],
      goodMove: [
        'Analyzing... Top engine choice confirmed. Impressive.',
        'You found the only refutation in that line.',
      ],
    },
  },
  {
    id: 'magnus',
    name: 'Magnus Bot',
    title: 'World Champion Style',
    elo: 2850,
    avatar: '👑',
    difficulty: 'Grandmaster',
    description: 'Master of water-from-stone endgames and positional strangulation. Squeezes microscopic advantages until opponents crumble.',
    playStyle: 'Deep positional grinding, endgame magic, avoiding early theory when advantageous.',
    colorTheme: 'from-amber-600 to-yellow-900 border-amber-500/40 text-amber-300',
    engineDepth: 12,
    blunderRate: 0.01,
    quips: {
      start: [
        'Let’s take you out of your opening prep and play some real chess.',
        'Every pawn endgame is won if you understand the geometry.',
        'I have all day to squeeze this position.',
      ],
      win: [
        'Patience wins the war. Well fought.',
        'The king is the strongest piece in the endgame.',
      ],
      loss: [
        'Incredible game. You outplayed me in the subtleties.',
      ],
      blunderCaught: [
        'You gave up the dark squares. Now you will feel the squeeze.',
        'That pawn weakness will prove fatal in the endgame.',
      ],
      goodMove: [
        'Sharp prophylactic thinking! Solid play.',
      ],
    },
  },
  {
    id: 'mikhail',
    name: 'Mikhail the Magician',
    title: 'Tactical Sorcerer',
    elo: 2700,
    avatar: '🧙‍♂️',
    difficulty: 'Grandmaster',
    description: 'Inspired by Mikhail Tal. Loves wild piece sacrifices, complicated complications, and dragging your king into an open-field hunt.',
    playStyle: 'Dynamic sacrifices, speculative king attacks, tactical chaos over material greed.',
    colorTheme: 'from-rose-600 to-red-950 border-rose-500/40 text-rose-300',
    engineDepth: 10,
    blunderRate: 0.02,
    quips: {
      start: [
        'You must take your opponent into a deep dark forest where 2+2=5 and the path out is only wide enough for one.',
        'I do not care about pawns; I care about your King’s heartbeat!',
      ],
      win: [
        'The sacrifice opened the gates! Checkmate!',
        'Chaos is my native element.',
      ],
      loss: [
        'You navigated the storm and weathered my sacrifice. Bravo!',
      ],
      blunderCaught: [
        'A sacrificial opening! Watch the fireworks begin!',
      ],
      goodMove: [
        'You held your nerve against the assault! Very courageous.',
      ],
    },
  },
  {
    id: 'garry',
    name: 'Garry the Beast',
    title: 'Attacking Dynamo',
    elo: 2600,
    avatar: '⚡',
    difficulty: 'Master',
    description: 'Fierce attacking powerhouse with aggressive initiative, deep opening preparation, and overwhelming psychological pressure.',
    playStyle: 'Fierce central pawn breaks, kingside pawn storms, energetic tactical strikes.',
    colorTheme: 'from-orange-600 to-amber-900 border-orange-500/40 text-orange-300',
    engineDepth: 8,
    blunderRate: 0.03,
    quips: {
      start: [
        'Attack, attack, attack! Let us see if your shield holds!',
        'Chess is mental torture. Prepare yourself.',
      ],
      win: [
        'The initiative never left my hands! Decisive victory.',
      ],
      loss: [
        'Your defense was unbreachable today.',
      ],
      blunderCaught: [
        'You surrendered the initiative! I strike immediately!',
      ],
      goodMove: [
        'A sharp counter-punch! I like your fighting spirit.',
      ],
    },
  },
  {
    id: 'hikaru',
    name: 'Hikaru Speedster',
    title: 'Blitz King',
    elo: 2500,
    avatar: '🏃‍♂️',
    difficulty: 'Master',
    description: 'Quick-thinking swindler and tactical maestro. Loves sharp counter-attacks, tricky knight outposts, and perpetual threats.',
    playStyle: 'Resourceful tactical swindles, speed-play pressure, sharp tactical vision.',
    colorTheme: 'from-cyan-600 to-blue-900 border-cyan-500/40 text-cyan-300',
    engineDepth: 7,
    blunderRate: 0.04,
    quips: {
      start: [
        'Let’s go! Fast tactical chess is where the real fun happens.',
        'I see a lot of tactics in this line already.',
      ],
      win: [
        'Boom! The tactic landed right on time.',
      ],
      loss: [
        'GG! You punished my aggressive swindle nicely.',
      ],
      blunderCaught: [
        'That’s a free tactic! Thank you very much.',
      ],
      goodMove: [
        'Oh, you found that idea? Okay, okay, nicely done.',
      ],
    },
  },
  {
    id: 'sofia',
    name: 'Sofia the Strategist',
    title: 'Positional Master',
    elo: 2100,
    avatar: '🛡️',
    difficulty: 'Advanced',
    description: 'Methodical master of harmony. Anchors knights on outpost squares, controls key open diagonals, and prevents tactical swindles.',
    playStyle: 'Harmonious piece placement, solid pawn structures, prophylactic defense.',
    colorTheme: 'from-emerald-600 to-teal-950 border-emerald-500/40 text-emerald-300',
    engineDepth: 6,
    blunderRate: 0.06,
    quips: {
      start: [
        'Good structure is the foundation of every victory.',
        'Let us play an instructive, harmonious battle.',
      ],
      win: [
        'Control of the key files determined the victory.',
      ],
      loss: [
        'You broke my pawn chain effectively. Good lesson!',
      ],
      blunderCaught: [
        'That move leaves an exploitable square behind.',
      ],
      goodMove: [
        'Solid positional understanding!',
      ],
    },
  },
  {
    id: 'leo',
    name: 'Leo the Club Champ',
    title: 'Intermediate Challenger',
    elo: 1500,
    avatar: '☕',
    difficulty: 'Intermediate',
    description: 'Your favorite local chess club regular. Knows his openings and basic tactics, but occasionally misses a skewer or back-rank motif under pressure.',
    playStyle: 'Standard book openings, honest tactical play with human vulnerabilities.',
    colorTheme: 'from-blue-600 to-slate-900 border-blue-500/40 text-blue-300',
    engineDepth: 4,
    blunderRate: 0.14,
    quips: {
      start: [
        'Coffee poured, let’s see what opening you have prepared for me!',
        'May the best player win!',
      ],
      win: [
        'Yes! My club training paid off.',
      ],
      loss: [
        'Ouch, I totally walked into that fork! Good game!',
      ],
      blunderCaught: [
        'I think you left that piece undefended, let me grab it.',
      ],
      goodMove: [
        'Nice move! I have to think about this one.',
      ],
    },
  },
  {
    id: 'spark',
    name: 'Novice Spark',
    title: 'Beginner Guide',
    elo: 800,
    avatar: '🐣',
    difficulty: 'Beginner',
    description: 'Enthusiastic beginner learning the game. Great for practicing checkmating patterns, discovering forks, and building confidence!',
    playStyle: 'Plays straightforward moves, sometimes neglects king safety or leaves pieces hanging.',
    colorTheme: 'from-yellow-500 to-amber-950 border-yellow-500/40 text-yellow-300',
    engineDepth: 2,
    blunderRate: 0.35,
    quips: {
      start: [
        'Hi! I am still learning how all the pieces move together. Let’s play!',
        'I hope I don’t blunder my queen this time!',
      ],
      win: [
        'Wait, I won?! Hooray!!',
      ],
      loss: [
        'Good checkmate! I learned a lot from this game.',
      ],
      blunderCaught: [
        'Look, I found a piece to take!',
      ],
      goodMove: [
        'Whoa, that was a super smart move!',
      ],
    },
  },
];
