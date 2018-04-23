export interface StateHost {
  next(result?: string | undefined, data?: any | undefined): void;

  prev(result?: string | undefined, data?: any | undefined): void;

  restart(): void;
}
