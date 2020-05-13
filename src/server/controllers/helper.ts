export const createNewWeeklyInfo = (startDate, endDate) => {
    return {
        start: startDate,
        end: endDate,
        customers: {}
    }
}

export const convertTimestamp = (timestamp) => new Date(timestamp)

export const getWeekRange = (currentDate) => {
    const formattedTime = convertTimestamp(currentDate)

    // week start on Mon not Sunday
    const first = formattedTime.getDate() - formattedTime.getDay() + 1;
    const last = first + 6;
    const firstDate = formattedTime.setDate(first)
    const lastDate = formattedTime.setDate(last)

    const firstFullDay = new Date(firstDate).setHours(0, 0, 0, 0)
    const lastFullDay = new Date(lastDate).setHours(23, 59, 59, 999);

    const firstUTCDay = new Date(firstFullDay).toUTCString();
    const lastUTCDay = new Date(lastFullDay).toUTCString();

    return {
        first: firstUTCDay,
        last: lastUTCDay
    }
}

export const isThisWeek = (givenTime, weekEnd) => {
    const formattedGivenTime = convertTimestamp(givenTime)
    const formattedEndTime = convertTimestamp(weekEnd)

    if (formattedGivenTime > formattedEndTime) return false;
    return true;
}

export const invalidTrans = (id, customerId) => {
    return {
        "id": id,
        "customer_id": customerId,
        "accepted": false
    }
}

export const validTrans = (id, customerId) => {
    return {
        "id": id,
        "customer_id": customerId,
        "accepted": true
    }
}
export const formatAmount = (amount) => {
    let formattedAmount = parseFloat(amount.slice(1))
    return formattedAmount;
}

export const createNewCustomer = (attempt) => {
    const attemptAmount = formatAmount(attempt.load_amount)
    if (attemptAmount > 5000) return null;

    let customer = {
        weeklyAmount: attemptAmount,
        loadIds: [attempt.id],
        lastTransInfo: {
            date: attempt.time,
            dailyLoad: 1,
            dailyAmount: attemptAmount,
        }
    }
    return customer;
}

export const updateCustomerInfo = (oldInfo, attempt) => {
    const attemptAmount = formatAmount(attempt.load_amount);

    const totalDailyLoad = oldInfo.lastTransInfo.dailyLoad + 1
    const totalDailyAmount = oldInfo.lastTransInfo.dailyAmount + attemptAmount

    oldInfo.weeklyAmount = oldInfo.weeklyAmount + attemptAmount;
    oldInfo.loadIds.push(attempt.id);
    oldInfo.lastTransInfo = {
        date: attempt.time,
        dailyLoad: totalDailyLoad,
        dailyAmount: totalDailyAmount,
    }
    return oldInfo;
}

export const updateCustomer = (prevInfo, attempt) => {
    if (!attempt) return null;
    const attemptAmount = parseFloat(attempt.load_amount.slice(1));
    if (attemptAmount > 5000) return null;

    let updatedCustomer = {};
    const prevWeeklyAmount = prevInfo.weeklyAmount;
    const prevLoadIds = prevInfo.loadIds;
    const prevTransInfo = prevInfo.lastTransInfo;

    const attemptGMT = attempt.time;
    const prevGMT = prevTransInfo.date;
    const attemptTimeDate = attemptGMT.substring(0, 10);
    const prevTimeDate = prevGMT.substring(0, 10);

    if (prevLoadIds.indexOf(attempt.id) > -1) return null;

    if (prevWeeklyAmount + attemptAmount > 20000) return null;

    //new dailyLoad if attempt day !== last transaction date, update info
    if (attemptTimeDate !== prevTimeDate) {
        updatedCustomer = updateCustomerInfo(prevInfo, attempt)
        return updatedCustomer
    }

    if (attemptTimeDate === prevTimeDate) {
        //check if dailyloads > 3   
        if (prevTransInfo.dailyLoad >= 3) return null;
        //check if dailyamount > 5K
        if (prevTransInfo.dailyAmount + attemptAmount > 5000) return null;
        // < 5k
        updatedCustomer = updateCustomerInfo(prevInfo, attempt)
    }

    return updatedCustomer
}