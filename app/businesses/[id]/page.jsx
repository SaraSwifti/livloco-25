import connectDB from "@/config/database";
import LocoMem from "@/models/LocoMem";



const LocobusPage = async ({ params }) => {
    await connectDB();
    const locomem = await LocoMem.findById(params.id).lean();




    return ( 
        <h1>{locomem.locobiz_name}</h1>
     );
}
 
export default LocobusPage;