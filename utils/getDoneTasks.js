export function getDoneTasks(groupId, data) {
  let done = 0
  try {
    const index = data.groups.findIndex(group => {
      return group.id === groupId
    })
    data.groups[index].tasks.forEach(task => {
      if (task.isDone) done++
    })
  } catch (e) {
    console.log(e)
  }
  return done
}
