import { updateLocalData } from "./updateLocalData"
export function appendGroup(data, inputText) {
    data.groups.push({ 'group': inputText, 'created': Date.now(), 'tasks': [], 'collapsed': false })
    updateLocalData(data)
}