export function groupExists(data, inputText) {
    for (let group of data.groups)
        if (group.group === inputText) return true
    return false
}