export interface currencyInterface {
  result: string;
  success: boolean;
  info: {
    rate: number;
  };
  query: {
    from: string;
  }
}