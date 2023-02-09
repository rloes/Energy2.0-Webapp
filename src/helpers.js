export function roundToN(num, n){
    num = Number(num)
    return Math.round((num + Number.EPSILON) * Math.pow(10,n)) / Math.pow(10,n)
}

export function getISODateWithDelta(timedelta){
    let date = new Date()
    date.setDate(date.getDate() + (timedelta))
    date.setHours(date.getHours()+1)
    return date.toISOString().split('T')[0]
}

export function getMonday() {
    const d = new Date();
    const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const date = new Date(d.setDate(diff));
    date.setHours(date.getHours()+1) // ISODate is UTC and timezone in Germany us UTC+1
    return date.toISOString().split("T")[0]
}

export function formatDateTime(dateTime, withSeconds=true){
    const date = new Date(dateTime);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    let result =`${day}.${month}.${year} - ${hours}:${minutes}`
    if(withSeconds) result += `:${seconds}`;
    return result
}
export function diffInHours(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000
    diff /= (60 * 60)
    return Math.abs(Math.round(diff))
}
