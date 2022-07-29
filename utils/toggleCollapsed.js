import { updateLocalData } from "./updateLocalData"

export function toggleCollapsed(item, data, setData, setForceUpdate) {
    const fullData = [...data.groups]
    for (let group of fullData)
        if (group.group === item.group) group.collapsed = !group.collapsed
    setData({ 'groups': fullData })
    setForceUpdate(fullData)
    updateLocalData({'groups': fullData})
}