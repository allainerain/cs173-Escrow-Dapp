// TODO 8 - Fetch storage of the Lottery by completing fetchStorage
import axios from "axios";

//accesses the api for the smart
export const fetchStorage = async () => {
    try{
        const res = await axios.get(
            "https://api.ghostnet.tzkt.io/v1/contracts/KT18jk5pLXyaQyJ4SsDKYrwbX1ywpL65trZ2/storage"
        );
        return res.data;

    } catch(err){
        throw err;
    }
    
};
