import { updateLocalData } from "./updateLocalData"

export function updateTaskData(newData, data, setForceUpdate, item, setData) {
    const fullData = [...data.groups]
    for (let group of fullData)
        if (group.group === item.group) { group.tasks = newData }
    setData({ 'groups': fullData })
    setForceUpdate(fullData)
    updateLocalData({'groups': newData})
}