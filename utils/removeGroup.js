export function removeGroup(data, setData, groupToRemove){
    const oldData = data;
    const newData = oldData.groups.filter((value) => {
        return value.group !== groupToRemove
    })
    setData({'groups': newData})
}