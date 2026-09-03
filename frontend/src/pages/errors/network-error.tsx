import { ErrorPage } from '@/components/common/error-page';
import { WifiOff } from 'lucide-react';

export default function NetworkErrorPage() {
  return (
    <ErrorPage
      code="!"
      title="Network error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      icon={WifiOff}
    />
  );
}
