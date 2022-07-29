export function getDoneTasks (currentGroup, data){
    let done = 0;
    const fullData = [...data.groups]
    for (let group of fullData)
        if (group.group === currentGroup)
            for (let task of group.tasks)
                if (task.state === 'DONE') done++
    return done
}