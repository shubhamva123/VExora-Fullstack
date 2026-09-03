import { ErrorPage } from '@/components/common/error-page';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      description="You don't have permission to access this page. Please sign in."
      icon={ShieldX}
    />
  );
}
