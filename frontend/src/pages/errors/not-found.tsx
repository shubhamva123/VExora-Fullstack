import { ErrorPage } from '@/components/common/error-page';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      icon={Compass}
    />
  );
}
