import { Token, PokerCard, Round, DeckCard } from "./gameTypes";

export enum RoomPhase {
    SETUP = "setup",
    BIDDING = "bidding",
    SCORING = "scoring",
}

export interface SetupPlayer {
    name: string;
}

export interface Config {
    withJokers: boolean;
}

export interface SetupState {
    phase: RoomPhase.SETUP;
    players: SetupPlayer[];
    config: Config;
}

export const NEW_ROOM: SetupState = {
    phase: RoomPhase.SETUP,
    players: [],
    config: { withJokers: false },
};

export interface StartedPlayer<PlayerCard> {
    name: string;
    hand: PlayerCard[];
    pastTokens: Token[];
    token: Token | null;
}

// 0-indexed
export type PlayerNumber = number;

export interface JokerLogEntry {
    player: PlayerNumber;
}

export interface RoundLogEntry {
    player: PlayerNumber;
    action:
        | {
              // Taking a token from another player or from the centre
              take: Token;
              from: PlayerNumber | null; // null if taking from the centre
              put: Token | null; // What token the player previously had
          }
        | {
              // Putting a token back in the centre
              put: Token;
          };
}

export interface BaseStartedState<PlayerCard> {
    players: StartedPlayer<PlayerCard>[];
    config: Config;
    communityCards: PokerCard[][];
    deck: DeckCard[];
    jokerLog: JokerLogEntry[];
}

export interface BiddingState<PlayerCard = DeckCard | DeckCard[]> extends BaseStartedState<PlayerCard> {
    phase: RoomPhase.BIDDING;
    tokens: (Token | null)[];
    futureRounds: Round[];
    log: RoundLogEntry[][];
}
export type BiddingStateWithoutJokers = BiddingState<PokerCard>;

export interface ScoringState extends BaseStartedState<PokerCard> {
    phase: RoomPhase.SCORING;
    log: RoundLogEntry[][];
    revealIndex: number; // 1-indexed
}

export type StartedState = BiddingState | ScoringState;
export type RoomState = SetupState | StartedState;
