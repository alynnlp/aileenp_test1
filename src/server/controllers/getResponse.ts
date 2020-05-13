import {
    createNewWeeklyInfo,
    getWeekRange,
    isThisWeek,
    invalidTrans,
    validTrans,
    createNewCustomer,
    updateCustomer
} from './helper';

export const getTransResponse = (transactions) => {

    let result = []
    let weeklyInfo;

    transactions.forEach((attempt) => {
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
    })
    return result
}