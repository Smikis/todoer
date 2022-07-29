import AsyncStorage from "@react-native-async-storage/async-storage"

export async function readLocalData(){
    try {
        const data = await AsyncStorage.getItem('@user_task_data')
        return JSON.parse(data)
    }
    catch (e) {
        console.log(e)
    }
}