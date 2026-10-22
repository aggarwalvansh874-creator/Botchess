import React from 'react';
import { PieceColor, PieceSymbol } from '../types/chess';

interface ChessPieceProps {
  type: PieceSymbol;
  color: PieceColor;
  className?: string;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#FFFFFF' : '#1E1E24';
  const stroke = isWhite ? '#2B2B36' : '#E2E8F0';
  const highlight = isWhite ? '#E2E8F0' : '#334155';

  switch (type) {
    case 'p': // Pawn
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {isWhite && (
            <path
              d="M 22.5,10 A 3,3 0 0 0 19.5,13 A 3,3 0 0 0 20.2,14.7 C 18.5,15.8 17.5,17.7 17.5,21 c 0,1.8 0.7,3.3 1.9,4.4 C 16.5,26.5 12.8,30.8 12.5,38 l 20,0 c -0.3,-7.2 -4,-11.5 -6.9,-12.6 1.2,-1.1 1.9,-2.6 1.9,-4.4 0,-3.3 -1,-5.2 -2.7,-6.3 a 3,3 0 0 0 0.7,-1.7 3,3 0 0 0 -3,-3 z"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="0.8"
            />
          )}
        </svg>
      );

    case 'n': // Knight
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <path
            d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,7.4 17.2,5.2 19,5 C 20.78,5.2 24,6.4 24,10.5 C 24,10.5 24,14 24,18 z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="12.5" r="1.5" fill={isWhite ? '#1E1E24' : '#FFFFFF'} />
        </svg>
      );

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 z" />
            <path d="M 12,36 C 12.27,34.88 12.29,32.74 13,31 C 14.5,27.5 17,25.5 17,23 C 17,20.5 15,19.5 15,16 C 15,11.5 18.5,8 22.5,8 C 26.5,8 30,11.5 30,16 C 30,19.5 28,20.5 28,23 C 28,25.5 30.5,27.5 32,31 C 32.71,32.74 32.73,34.88 33,36 z" />
            <circle cx="22.5" cy="6" r="2" />
          </g>
          <path
            d="m 17.5,16 10,0 M 22.5,11 22.5,21"
            fill="none"
            stroke={isWhite ? '#2B2B36' : '#E2E8F0'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'r': // Rook
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 z" />
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 z" />
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 z" />
            <path d="M 34,14 L 31,17 L 14,17 L 11,14 z" />
            <path d="M 13,17 L 14.5,32 L 30.5,32 L 32,17 z" />
            <path d="M 14,29 L 31,29" fill="none" stroke={highlight} strokeWidth="1" />
          </g>
        </svg>
      );

    case 'q': // Queen
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14,11 L 14,25 L 7,14 L 9,26 z" />
            <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 L 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 L 9,26 z" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="14" cy="9" r="2" />
            <circle cx="22.5" cy="8" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="39" cy="12" r="2" />
          </g>
        </svg>
      );

    case 'k': // King
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <path
            d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 22.5,11.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 z" />
            <path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 34,35 34,33 33,30.5 C 31,27 28.5,26.5 28.5,24 C 28.5,21.5 30.5,20.5 30,17.5 C 29,12 25,12 22.5,12 C 20,12 16,12 15,17.5 C 14.5,20.5 16.5,21.5 16.5,24 C 16.5,26.5 14,27 12,30.5 C 11,33 11,35 11.5,37 z" />
            <path d="M 11.5,30 C 17,27 28,27 33.5,30" fill="none" stroke={highlight} strokeWidth="1" />
            <path d="M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5" fill="none" stroke={highlight} strokeWidth="1" />
            <path d="M 11.5,37 C 17,34 28,34 33.5,37" fill="none" stroke={highlight} strokeWidth="1" />
          </g>
        </svg>
      );
  }
};
