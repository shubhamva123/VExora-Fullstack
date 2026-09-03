import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  StickyNote,
  CheckSquare,
  Calendar,
  MessageSquare,
  Repeat,
  Sun,
  BarChart3,
  User,
  Settings,
  Search,
  Sparkles,
  StickyNote as NoteIcon,
} from 'lucide-react';
import { useCommandPalette } from '@/contexts/command-palette-context';

const navCommands = [
  { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Notes', path: '/app/notes', icon: StickyNote, group: 'Navigation' },
  { label: 'Tasks', path: '/app/tasks', icon: CheckSquare, group: 'Navigation' },
  { label: 'Calendar', path: '/app/calendar', icon: Calendar, group: 'Navigation' },
  { label: 'AI Chat', path: '/app/ai-chat', icon: MessageSquare, group: 'Navigation' },
  { label: 'Revision Planner', path: '/app/revision', icon: Repeat, group: 'Navigation' },
  { label: 'Daily Summary', path: '/app/summary', icon: Sun, group: 'Navigation' },
  { label: 'Analytics', path: '/app/analytics', icon: BarChart3, group: 'Navigation' },
  { label: 'Profile', path: '/app/profile', icon: User, group: 'Navigation' },
  { label: 'Settings', path: '/app/settings', icon: Settings, group: 'Navigation' },
];

const actionCommands = [
  { label: 'New Note', path: '/app/notes', icon: NoteIcon, group: 'Quick Actions' },
  { label: 'New Task', path: '/app/tasks', icon: CheckSquare, group: 'Quick Actions' },
  { label: 'Ask AI', path: '/app/ai-chat', icon: Sparkles, group: 'Quick Actions' },
];

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions, or ask AI..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          {actionCommands.map((c) => (
            <CommandItem key={c.label} onSelect={() => go(c.path)}>
              <c.icon className="mr-2 h-4 w-4" />
              {c.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          {navCommands.map((c) => (
            <CommandItem key={c.label} onSelect={() => go(c.path)}>
              <c.icon className="mr-2 h-4 w-4" />
              {c.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Search">
          <CommandItem onSelect={() => go('/app/notes')}>
            <Search className="mr-2 h-4 w-4" />
            Search notes & tasks
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
