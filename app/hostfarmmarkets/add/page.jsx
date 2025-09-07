// app/hostfarmmarkets/add/page.jsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import HostMarketsAddForm from '@/components/HostMarketsAddForm';

const AddHostMarketPage = async ({ params }) => {
    const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email || '';
    return (
        <section className="max-w-5xl mx-auto px-4 py-8">
          
            <HostMarketsAddForm userEmail={userEmail} />
        </section>
    );
};

export default AddHostMarketPage;
