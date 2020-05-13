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
}

export interface WeeklyInfoInterface {
  startDate: string;
  endDate: string;
}

export interface FormattedTimeStamp { 
  timestamp: string;
}