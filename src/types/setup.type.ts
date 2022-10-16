import { Config } from './config.type';
import { GameContext } from './game-context.interface';

export type setup = (config: Config) => GameContext;
