import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Bell, Brain, Globe, Lock, Accessibility,
  Plug, AlertTriangle, Moon, Sun, Check,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/theme-context';
import { usePreferences } from '@/contexts/preferences-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const themeOptions = [
  { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-background border-border' },
  { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-stone-200' },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreferences } = usePreferences();
  const [tab, setTab] = useState('appearance');

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Customize your VExora experience" icon={Settings} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="appearance" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5"><Brain className="h-3.5 w-3.5" /> AI</TabsTrigger>
          <TabsTrigger value="language" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Language</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-1.5"><Lock className="h-3.5 w-3.5" /> Privacy</TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-1.5"><Accessibility className="h-3.5 w-3.5" /> Accessibility</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5"><Plug className="h-3.5 w-3.5" /> Integrations</TabsTrigger>
          <TabsTrigger value="danger" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Danger Zone</TabsTrigger>
        </TabsList>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Theme</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={cn('relative overflow-hidden rounded-xl border-2 p-1 transition-all', theme === opt.id ? 'border-primary' : 'border-border hover:border-muted-foreground/40')}
                  >
                    <div className={cn('h-20 rounded-lg border', opt.preview)}>
                      <div className="flex h-full flex-col justify-end gap-1 p-2">
                        <div className="h-1.5 w-2/3 rounded bg-primary/40" />
                        <div className="h-1.5 w-1/2 rounded bg-muted-foreground/30" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-1 py-2">
                      <span className="flex items-center gap-1.5 text-sm font-medium"><opt.icon className="h-3.5 w-3.5" />{opt.label}</span>
                      {theme === opt.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Custom themes can be added in the future without changing components — the theming engine reads CSS variables.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-1">
              {[
                { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push notifications', desc: 'Browser push alerts' },
                { key: 'reminders', label: 'Task & revision reminders', desc: 'Reminders for deadlines' },
                { key: 'aiSuggestions', label: 'AI suggestions', desc: 'Smart recommendations from AI' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                  <div>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={preferences.notifications[item.key as keyof typeof preferences.notifications]}
                    onCheckedChange={(v) => updatePreferences({ notifications: { ...preferences.notifications, [item.key]: v } })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI */}
        <TabsContent value="ai" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">AI Preferences</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select value={preferences.ai.model} onValueChange={(v) => updatePreferences({ ai: { ...preferences.ai, model: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vexora-pro">VExora Pro</SelectItem>
                    <SelectItem value="vexora-lite">VExora Lite</SelectItem>
                    <SelectItem value="vexora-reasoning">VExora Reasoning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label>Creativity Level</Label><span className="text-sm text-muted-foreground">{preferences.ai.creativity.toFixed(1)}</span></div>
                <Slider value={[preferences.ai.creativity]} min={0} max={1} step={0.1} onValueChange={([v]) => updatePreferences({ ai: { ...preferences.ai, creativity: v } })} />
                <p className="text-xs text-muted-foreground">Lower = more focused, higher = more creative</p>
              </div>
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">Auto-summarize notes</Label><p className="text-xs text-muted-foreground">Generate summaries automatically</p></div>
                <Switch checked={preferences.ai.autoSummarize} onCheckedChange={(v) => updatePreferences({ ai: { ...preferences.ai, autoSummarize: v } })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Language & Region</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label>Display Language</Label>
                <Select value={preferences.language} onValueChange={(v) => updatePreferences({ language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Privacy</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-1">
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">Data collection</Label><p className="text-xs text-muted-foreground">Allow anonymous usage analytics</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">AI training</Label><p className="text-xs text-muted-foreground">Allow your data to improve AI models</p></div>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">Profile visibility</Label><p className="text-xs text-muted-foreground">Make your profile visible to others</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility */}
        <TabsContent value="accessibility" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Accessibility</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-1">
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">Reduce motion</Label><p className="text-xs text-muted-foreground">Minimize animations</p></div>
                <Switch checked={preferences.accessibility.reduceMotion} onCheckedChange={(v) => updatePreferences({ accessibility: { ...preferences.accessibility, reduceMotion: v } })} />
              </div>
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30">
                <div><Label className="text-sm font-medium">High contrast</Label><p className="text-xs text-muted-foreground">Increase visual contrast</p></div>
                <Switch checked={preferences.accessibility.highContrast} onCheckedChange={(v) => updatePreferences({ accessibility: { ...preferences.accessibility, highContrast: v } })} />
              </div>
              <div className="space-y-2 pt-3">
                <Label>Font Size</Label>
                <Select value={preferences.accessibility.fontSize} onValueChange={(v) => updatePreferences({ accessibility: { ...preferences.accessibility, fontSize: v as 'small' | 'medium' | 'large' } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4">
          <Card className="p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium">Integrations</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {['Google Calendar', 'Notion', 'Slack', 'Discord', 'Zapier'].map((name) => (
                  <div key={name} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40 text-sm font-semibold">{name[0]}</div>
                      <div><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">Connect to sync data</p></div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info(`${name} integration coming soon`)}>Connect</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="mt-4">
          <Card className="border-destructive/20 p-5">
            <CardHeader className="mb-4 p-0"><CardTitle className="text-base font-medium text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><p className="text-sm font-medium">Export your data</p><p className="text-xs text-muted-foreground">Download all your notes, tasks, and data</p></div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Data export will be available soon')}>Export</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-3">
                <div><p className="text-sm font-medium text-destructive">Delete account</p><p className="text-xs text-muted-foreground">This action is permanent and cannot be undone</p></div>
                <Button variant="destructive" size="sm" onClick={() => toast.error('Account deletion requires confirmation')}>Delete account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
