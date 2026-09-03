import { ErrorPage } from '@/components/common/error-page';
import { ServerCrash } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      description="An internal server error occurred. Our team has been notified."
      icon={ServerCrash}
    />
  );
}
