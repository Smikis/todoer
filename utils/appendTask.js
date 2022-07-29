import { updateLocalData } from "./updateLocalData"

export  function appendTask(data, groupChosen, inputText) {
    for (let group of data.groups)
        if (group.group === groupChosen) group.tasks.push({ 'created': Date.now(), 'state': 'NOT DONE', 'value': inputText })
    updateLocalData(data)
}