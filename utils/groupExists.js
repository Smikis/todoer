export function groupExists(data, inputText) {
  try {
    for (let group of data.groups) if (group.group === inputText) return true
  } catch (e) {
    console.log(e)
  }
  return false
}
