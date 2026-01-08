
import { getRaffleById } from '@/services/raffleService';
import EditRaffleForm from '@/components/dashboard/EditRaffleForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRafflePage({ params }: PageProps) {
    const { id } = await params;
    const raffle = await getRaffleById(id);

    if (!raffle) {
        return <div className="p-8 text-center text-red-500">Rifa no encontrada</div>;
    }

    return <EditRaffleForm raffle={raffle} />;
}
