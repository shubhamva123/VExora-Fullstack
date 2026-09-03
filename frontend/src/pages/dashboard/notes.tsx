import { useEffect, useState } from "react";
import { StickyNote, Plus, Pencil, Trash2, Repeat } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import noteService, {
  Note,
  CreateNote,
} from "@/services/notes.service";
import { revisionService } from "@/services/revision.service";

export default function NotesPage() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [revisionLoading, setRevisionLoading] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [revision, setRevision] = useState(false);
  const [revisionDate, setRevisionDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await noteService.getAll();
      setNotes(
        [...data].sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  const filtered = notes.filter((note) =>
    (note.title + " " + (note.content ?? ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function resetForm() {
    setTitle("");
    setContent("");
    setRevision(false);
    setRevisionDate("");
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(note: Note) {
    setEditing(note);
    setTitle(note.title);
    setContent(note.content ?? "");
    setRevision(note.is_for_revision);
    setRevisionDate(note.next_revision_date ?? "");
    setOpen(true);
  }

  async function saveNote() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const payload: CreateNote = {
      title,
      content,
      is_for_revision: revision,
      next_revision_date: revisionDate || null,
    };

    try {
      if (editing) {
        await noteService.update(editing.note_id, payload);
        toast.success("Note updated");
      } else {
        await noteService.create(payload);
        toast.success("Note created");
      }

      await loadNotes();

      setOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Unable to save note");
    }
  }

  async function removeNote(id: number) {
    if (!confirm("Delete this note?")) {
      return;
    }

    try {
      await noteService.delete(id);
      toast.success("Note deleted");
      await loadNotes();
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete");
    }
  }

  async function handleAddRevision(noteId: number) {
    if (!revisionDate) {
      toast.error("Please select a revision date");
      return;
    }

    try {
      setRevisionLoading(true);
      await revisionService.createRevision({
        note_id: noteId,
        scheduled_date: revisionDate,
      });
      toast.success("Revision added successfully");
      setRevisionDate("");
      setShowRevisionDialog(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add revision");
    } finally {
      setRevisionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading Notes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        description="Manage your notes"
        icon={StickyNote}
      />

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Note" : "Create Note"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              rows={8}
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={revision}
                onChange={(e) => setRevision(e.target.checked)}
              />
              Revision Note
            </label>

            {revision && (
              <Input
                type="date"
                value={revisionDate}
                onChange={(e) => setRevisionDate(e.target.value)}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button onClick={saveNote}>
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showRevisionDialog}
        onOpenChange={(isOpen) => {
          setShowRevisionDialog(isOpen);
          if (!isOpen) {
            setRevisionDate("");
            setSelectedNote(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Revision</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedNote ? `Schedule a revision for "${selectedNote.title}".` : "Select a note first."}
            </p>

            <Input
              type="date"
              value={revisionDate}
              onChange={(e) => setRevisionDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevisionDialog(false);
                setRevisionDate("");
                setSelectedNote(null);
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => handleAddRevision(selectedNote!.note_id)}
              disabled={revisionLoading || !selectedNote}
            >
              {revisionLoading ? "Adding..." : "Add Revision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Input
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          {search.trim() ? "No matching notes found." : "No Notes Found"}
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((note) => (
            <Card
              key={note.note_id}
              className="p-5 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{note.title}</h3>

                  {note.is_for_revision && (
                    <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      Needs Revision
                    </span>
                  )}

                  <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                    {note.content?.trim() || "No content"}
                  </p>

                  {note.next_revision_date && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Next Revision: {note.next_revision_date}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-muted-foreground">
                    Created: {new Date(note.created_at).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated: {new Date(note.updated_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedNote(note);
                      setShowRevisionDialog(true);
                    }}
                  >
                    <Repeat className="mr-2 h-4 w-4" />
                    Add Revision
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEdit(note)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeNote(note.note_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}