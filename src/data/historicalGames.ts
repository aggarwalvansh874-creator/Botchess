import { HistoricalGame } from '../types/chess';

export const HISTORICAL_GAMES: HistoricalGame[] = [
  {
    id: 'fischer-byrne-1956',
    title: 'The Game of the Century',
    subtitle: '13-Year-Old Fischer’s Immortal Queen Sacrifice',
    event: 'Rosenwald Memorial Tournament, New York',
    year: 1956,
    white: { name: 'Donald Byrne', title: 'IM' },
    black: { name: 'Bobby Fischer', title: '13-Year-Old Master' },
    result: '0-1',
    eco: 'D92',
    openingName: 'Grünfeld Defence, Russian Variation',
    description: 'Considered one of the most brilliant chess games ever played. Thirteen-year-old Bobby Fischer plays the immortal 17...Be6!!, sacrificing his queen for a decisive tactical counter-attack.',
    pgn: `1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`,
    keyMoments: [
      {
        moveIndex: 22, // 11...Na4!
        title: '11...Na4! The Tactical Provocation',
        description: 'Fischer invites complications. Rather than retreating passively, Black attacks the white queen and prepares to dismantle the white pawn center.',
        whyBrilliant: 'Exposes White’s uncastled king and creates immediate tactical pressure on the e-file.',
        alternativesConsidered: '11...Re8 was playable, but allows White to solidify with Be2 and castling.',
      },
      {
        moveIndex: 33, // 17...Be6!!
        title: '17...Be6!! The Queen Sacrifice',
        description: 'The crowning move of modern chess. Fischer ignores the attack on his queen and calmly develops his light-squared bishop to e6!',
        whyBrilliant: 'If White plays 18.Bxb6, Black continues with 18...Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+! discovering check and winning both rooks, minor pieces, and delivering unstoppable mating net.',
        alternativesConsidered: '17...Qc7 would concede all initiative to Byrne’s bishop pair and centralized rooks.',
      },
      {
        moveIndex: 40, // 21...Ne2+ windmill
        title: 'The Windmill Destruction',
        description: 'Fischer orchestrates a devastating discovered check carousel, picking up pawns and material while keeping Byrne’s king helpless.',
        whyBrilliant: 'Classic windmill pattern executed with supreme precision by a 13-year-old against one of America’s strongest masters.',
        alternativesConsidered: 'Taking the rook prematurely would give White breathing room to reorganize.',
      },
    ],
  },
  {
    id: 'anderssen-kieseritzky-1851',
    title: 'The Immortal Game',
    subtitle: 'Anderssen Sacrifices Both Rooks and His Queen',
    event: 'London Casual Game, Simpson’s-in-the-Strand',
    year: 1851,
    white: { name: 'Adolf Anderssen', title: 'Romantic Master' },
    black: { name: 'Lionel Kieseritzky', title: 'Top European Master' },
    result: '1-0',
    eco: 'C33',
    openingName: 'King’s Gambit Accepted',
    description: 'The epitome of 19th-century Romantic chess. Adolf Anderssen sacrifices a bishop, both rooks, and finally his queen to deliver checkmate with his remaining minor pieces.',
    pgn: `1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
    keyMoments: [
      {
        moveIndex: 34, // 18.Bd6!
        title: '18.Bd6! Offering the Corner Rooks',
        description: 'Anderssen leaves both of his rooks hanging to seize total control of the dark-square diagonals around the black king.',
        whyBrilliant: 'Recognized that piece coordination and mating vectors trump material count completely.',
        alternativesConsidered: '18.Rc1 defends the rook, but allows Black to consolidate with 18...Qc6.',
      },
      {
        moveIndex: 42, // 22.Qf6+!!
        title: '22.Qf6+!! The Final Queen Sacrifice',
        description: 'Anderssen deflects the black knight on g8 from defending the e7 square, setting up the unforgettable mate.',
        whyBrilliant: 'Forces 22...Nxf6, clearing the final obstacle for 23.Be7# checkmate with two knights and a bishop!',
        alternativesConsidered: 'Any defensive move allows Black’s queen to enter the defense.',
      },
    ],
  },
  {
    id: 'kasparov-topalov-1999',
    title: 'Kasparov’s Immortal',
    subtitle: 'The Greatest Modern King Hunt in Chess History',
    event: 'Hoogovens Wijk aan Zee, Netherlands',
    year: 1999,
    white: { name: 'Garry Kasparov', title: 'World Champion' },
    black: { name: 'Veselin Topalov', title: 'Grandmaster' },
    result: '1-0',
    eco: 'B07',
    openingName: 'Pirc Defence, 150 Attack',
    description: 'Garry Kasparov considers this his finest game. A profound rook sacrifice on d4 sets off a forced 15-move king hunt dragging Black’s monarch from g8 down to the enemy 1st rank.',
    pgn: `1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`,
    keyMoments: [
      {
        moveIndex: 46, // 24.Rxd4!!
        title: '24.Rxd4!! The Deep Sacrifice',
        description: 'Kasparov shocks Topalov by giving up a whole rook on d4 with 24.Rxd4!!, followed immediately by 25.Re7+!!.',
        whyBrilliant: 'Calculated all the way to move 37! Every square on the board becomes a snare for Topalov’s king.',
        alternativesConsidered: '24.Qxd6+ leads to a dry endgame with minimal winning chances for White.',
      },
      {
        moveIndex: 56, // 29.Ra7!
        title: '29.Ra7! The Quiet Deflection',
        description: 'A breathtaking quiet move in the middle of a blazing tactical tempest. Kasparov threatens mate while paralyzing Black’s bishop.',
        whyBrilliant: 'Restricts Black’s pieces from returning to assist their trapped king.',
        alternativesConsidered: '29.Bf1 allows Black king escape routes via b5.',
      },
    ],
  },
  {
    id: 'morphy-opera-1858',
    title: 'The Opera Game',
    subtitle: 'Paul Morphy’s Definitive Demonstration of Development',
    event: 'Paris Opera House, France',
    year: 1858,
    white: { name: 'Paul Morphy', title: 'American Genius' },
    black: { name: 'Duke of Brunswick & Count Isouard', title: 'Consultation' },
    result: '1-0',
    eco: 'C41',
    openingName: 'Philidor Defence',
    description: 'Played during a performance of Norma at the Italian Opera in Paris. Morphy demonstrates how every piece must be activated with tempo, culminating in a queen sacrifice and back-rank mate.',
    pgn: `1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
    keyMoments: [
      {
        moveIndex: 18, // 10.Nxb5!
        title: '10.Nxb5! Demolishing the Pawns',
        description: 'Morphy sacrifices a knight to shatter Black’s defense and open the fatal c and d files against the uncastled monarch.',
        whyBrilliant: 'Time and open lines are worth far more than static material.',
        alternativesConsidered: '10.Bd3 leaves the game balanced and allows Black to castle.',
      },
      {
        moveIndex: 30, // 16.Qb8+!!
        title: '16.Qb8+!! The Legendary Queen Deflection',
        description: 'Morphy gives up his queen to deflect the only defender of the back rank (16...Nxb8), sealing the game with 17.Rd8# checkmate!',
        whyBrilliant: 'The textbook example of back-rank weakness and double pin exploitation.',
        alternativesConsidered: '16.Qa4+ also wins, but 16.Qb8+ is the fastest, cleanest finish.',
      },
    ],
  },
  {
    id: 'alphazero-stockfish-2017',
    title: 'AlphaZero vs Stockfish (Game 1)',
    subtitle: 'The Neural Network Revolution in Chess',
    event: 'London AI Benchmark Match',
    year: 2017,
    white: { name: 'AlphaZero', title: 'DeepMind AI' },
    black: { name: 'Stockfish 8', title: 'World Computer Champion' },
    result: '1-0',
    eco: 'C11',
    openingName: 'French Defence, Steinitz Variation',
    description: 'AlphaZero stunned the world by playing like a romantic grandmaster, sacrificing a piece and restricting Stockfish’s heavy pieces to pure passivity before a slow, asphyxiating crush.',
    pgn: `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. e5 Nfd7 5. f4 c5 6. Nf3 cxd4 7. Nxd4 Nc6 8. Be3 Bc5 9. Qd2 O-O 10. O-O-O a6 11. h4 Nxd4 12. Bxd4 b5 13. Rh3 Be7 14. Bd3 b4 15. Ne2 a5 16. f5 exf5 17. Nf4 Nc5 18. Bxc5 Bxc5 19. Be2 Ra7 20. Qxd5 Qb6 21. Kb1 Rd7 22. Qf3 Rxd1+ 23. Bxd1 Rd8 24. Nd5 Qe6 25. Nf6+ Kh8 26. Be2 gxf6 27. Qh5 fxe5 28. Rg3 Be7 29. b3 Qf6 30. Bc4 Be6 31. Bxe6 fxe6 32. Rg5 e4 33. Qe2 Qc3 34. Rg3 Qxg3 35. Qc4 Rd1+ 36. Kb2 Bf6+ 1-0`,
    keyMoments: [
      {
        moveIndex: 20, // 11.h4!
        title: '11.h4! The Modern Kingside Thrust',
        description: 'AlphaZero initiates a kingside thrust without hesitation, setting up a rook lift via h3 that dominates both flanks.',
        whyBrilliant: 'Demonstrates deep positional compensation that standard alpha-beta engines historically undervalued.',
        alternativesConsidered: '11.Kb1 is the standard human continuation.',
      },
    ],
  },
  {
    id: 'deepblue-kasparov-1997',
    title: 'Deep Blue vs Garry Kasparov (Game 6)',
    subtitle: 'The Day a Computer Conquered the Human World Champion',
    event: 'Equitable Center, New York',
    year: 1997,
    white: { name: 'Deep Blue', title: 'IBM Supercomputer' },
    black: { name: 'Garry Kasparov', title: 'Reigning World Champion' },
    result: '1-0',
    eco: 'B17',
    openingName: 'Caro-Kann Defence, Steinitz Variation',
    description: 'The decisive final game of the historic 1997 rematch. Deep Blue plays the bold speculative knight sacrifice 8.Nxe6!, shattering Kasparov’s preparation and scoring a 19-move victory.',
    pgn: `1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7 5. Ng5 Ngf6 6. Bd3 e6 7. N1f3 h6 8. Nxe6 Qe7 9. O-O fxe6 10. Bg6+ Kd8 11. Bf4 b5 12. a4 Bb7 13. Re1 Nd5 14. Bg3 Kc8 15. axb5 cxb5 16. Qd3 Bc6 17. Bf5 exf5 18. Rxe7 Bxe7 19. c4 1-0`,
    keyMoments: [
      {
        moveIndex: 14, // 8.Nxe6!
        title: '8.Nxe6! The Decisive Knight Sacrifice',
        description: 'Deep Blue plays a daring piece sacrifice that humans previously thought computers were incapable of playing for positional compensation.',
        whyBrilliant: 'Traps the black king in the center and guarantees lethal diagonal penetration.',
        alternativesConsidered: '8.Ne4 avoids complications, but allows Black to castle comfortably.',
      },
    ],
  },
];
