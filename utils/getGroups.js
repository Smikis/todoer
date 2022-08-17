export function getGroups(data) {
  let arr = [];
  try {
    for (let group of data.groups) {
      arr.push({label: group.group, value: group.id});
    }
  } catch (e) {
    console.log(e);
  }
  return arr;
}
