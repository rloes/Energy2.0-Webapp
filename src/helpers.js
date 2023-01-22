export function roundToN(num, n){
    num = Number(num)
    return Math.round((num + Number.EPSILON) * Math.pow(10,n)) / Math.pow(10,n)
}

export function getISODateWithDelta(timedelta){
    let date = new Date()
    date.setDate(date.getDate() + (timedelta))
    return date.toISOString().split('T')[0]
}

export function getMonday() {
    const d = new Date();
    const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const date = new Date(d.setDate(diff));
    return date.toISOString().split("T")[0]
}