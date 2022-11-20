export interface headCurrency {
  result: string;
  success: boolean;
  info: {
    rate: number;
  };
  query: {
    from: string;
  }
}