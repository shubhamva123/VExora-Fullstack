import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function ErrorPage({ code, title, description, icon: Icon }: ErrorPageProps) {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background bg-gradient-aurora px-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <p className="text-6xl font-bold tracking-tight text-gradient">{code}</p>
        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => navigate('/app/dashboard')}>Back to Dashboard</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> VExora
        </div>
      </motion.div>
    </div>
  );
}
