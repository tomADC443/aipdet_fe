export function calculateDateDifference(date1: string, date2: string): { years: number, months: number, days: number } {
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
    }

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0); // Last day of previous month
        days += prevMonth.getDate();
    }


    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}