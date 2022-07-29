export function getGroups(data) {
    let arr = []
    let i = 1
    for (let group of data.groups) {
        arr.push({ label: group.group, value: i })
        i++;
    }
    return arr
}