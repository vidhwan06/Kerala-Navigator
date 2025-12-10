import { DiningPage } from '@/components/dining/DiningPage';
import { PageHeader } from '@/components/shared/PageHeader';

export const metadata = {
  title: 'Dining | Kerala Tourism Explorer',
  description: 'Discover the best places to eat in Kerala. From traditional sadhyas to fresh seafood.',
};

export default function Page() {
  return <DiningPage />;
}
