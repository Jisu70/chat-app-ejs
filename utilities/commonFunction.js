// Formated date 
const formatDateTime = (dateTime) => {
    const now = new Date();
    const givenDate = new Date(dateTime);

    const msInDay = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - msInDay);
    
    if (givenDate >= startOfToday) {
        // If the date is today, return the time (HH:MM format)
        return givenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (givenDate >= startOfYesterday) {
        // If the date is yesterday, return 'Yesterday'
        return 'Yesterday';
    } else if (givenDate >= startOfToday.getTime() - (now.getDay() * msInDay)) {
        // If the date is within this week, return the weekday name (e.g., 'Monday', 'Tuesday')
        return givenDate.toLocaleDateString([], { weekday: 'long' });
    } else {
        // If the date is more than a week ago, return the date (e.g., 'DD/MM/YYYY')
        return givenDate.toLocaleDateString();
    }
};

module.exports = {
    formatDateTime
}
