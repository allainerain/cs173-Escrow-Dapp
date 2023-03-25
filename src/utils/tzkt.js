// TODO 8 - Fetch storage of the Lottery by completing fetchStorage
import axios from "axios";

//accesses the api for the smart
export const fetchStorage = async () => {
    try{
        const res = await axios.get(
            "https://api.ghostnet.tzkt.io/v1/contracts/KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J/storage"
        );
        return res.data;

    } catch(err){
        throw err;
    }
    
};
