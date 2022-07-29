import { updateLocalData } from './updateLocalData'

export function toggleDone(itemGroup, data, setData, setForceUpdate, item) {
    const newData = [...data.groups]
    for (let group of newData) {
        if (group.group === itemGroup) {
            for (let task of group.tasks) {
                if (item === task) {
                    const newState = task.state === 'DONE' ? 'NOT DONE' : 'DONE'
                    task.state = newState
                }
            }
        }
    }
    setData({ 'groups': newData })
    setForceUpdate(newData)
    updateLocalData({'groups': newData})
}