export interface InputInterface {
  id: string;
  customer_id: string;
  load_amount: string;
  time: Date;
}

export interface OutputInterface {
  id: string;
  customer_id: string;
  accepted: boolean;
}[];

export interface CustomerInfo {
  weeklyAmount: number,
  loadIds: Array<string> | [],
  lastTransInfo: {
      time: string,
      dailyLoad: number,
      dailyAmount: number,
  }
};

export interface Customer {
  [customer_id: string] : CustomerInfo
};

export interface WeeklyInfo {
  start: string;
  end: string;
  customers: Customer | object;
};