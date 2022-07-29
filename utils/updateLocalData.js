import AsyncStorage from "@react-native-async-storage/async-storage"

export async function updateLocalData(data){
    try {
        await AsyncStorage.setItem('@user_task_data', JSON.stringify(data))
    }
    catch (e) {
        console.log(e)
    }
}