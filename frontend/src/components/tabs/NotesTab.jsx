import { DataTable } from "@/components/ui/DataTable";
import { CreateNoteDialog } from "@/components/dialogs/CreateNoteDialog";

export const NotesTab = ({
  notes,
  columns,
  content,
  setContent,
  onCreateNote,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-100">
          Notes
        </h2>
        <CreateNoteDialog
          content={content}
          setContent={setContent}
          onCreateNote={onCreateNote}
        />
      </div>

      <DataTable
        columns={columns}
        data={notes || []}
        onRowClick={(row) => console.log("Go to notes page for", row._id)}
      />
    </>
  );
};
