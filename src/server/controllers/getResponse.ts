import {
    createNewWeeklyInfo,
    getWeekRange,
    isThisWeek,
    invalidTrans,
    validTrans,
    createNewCustomer,
    updateCustomer
} from './helper';


interface Attempt {
    id: string;
    customer_id: string;
    load_amount: string;
    time: string
};

type Transactions = Array<Attempt>;

interface TransResult {
    id: string;
    customer_id: string;
    accepted: boolean
}[];

interface CustomerInfo {
    weeklyAmount: number,
    loadIds: Array<string> | [],
    lastTransInfo: {
        time: string,
        dailyLoad: number,
        dailyAmount: number,
    }
};

interface Customer {
    [customer_id: string] : CustomerInfo
};

interface WeeklyInfo {
    start: string;
    end: string;
    customers: Customer;
};

export const getTransResponse = (transactions : Transactions) => {

    let result: TransResult[] = []
    let weeklyInfo : WeeklyInfo;

    transactions.forEach( (attempt) => {
        if (!attempt) return null;

        const weekRange = getWeekRange(attempt.time);
        const weekStartDate = weekRange.first;
        const weekEndDate = weekRange.last;
        const loadId = attempt.id;
        const customerId = attempt.customer_id;

        //first item from data
        if (!weeklyInfo) {
            weeklyInfo = createNewWeeklyInfo(weekStartDate, weekEndDate)
        }

        //new Week, create newlist 
        if (weeklyInfo && isThisWeek(attempt.time, weeklyInfo.end) === false) {
            weeklyInfo = createNewWeeklyInfo(weekStartDate, weekEndDate);
        }

        // same week and new Customer
        if (!weeklyInfo.customers[customerId]) {
            const newCustomer = createNewCustomer(attempt)
            if (newCustomer === null) return result.push(invalidTrans(loadId, customerId));

            weeklyInfo.customers[customerId] = newCustomer
            return result.push(validTrans(loadId, customerId))
        }

        //same week and same customer
        if (weeklyInfo.customers[customerId]) {
            const updatedCustomer = updateCustomer(weeklyInfo.customers[customerId], attempt)
            if (updatedCustomer === null) return result.push(invalidTrans(loadId, customerId));
            
            weeklyInfo.customers[customerId] = updatedCustomer
            return result.push(validTrans(loadId, customerId));
        }

        return;
    })
    return result
}