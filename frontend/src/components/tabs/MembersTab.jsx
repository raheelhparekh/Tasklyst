import { DataTable } from "@/components/ui/DataTable";
import { AddMemberDialog } from "@/components/dialogs/AddMemberDialog";

export const MembersTab = ({
  members,
  columns,
  email,
  setEmail,
  onAddMember,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-100">
          Members
        </h2>
        <AddMemberDialog
          email={email}
          setEmail={setEmail}
          onAddMember={onAddMember}
        />
      </div>

      <DataTable
        columns={columns}
        data={members || []}
        onRowClick={(row) => console.log("Clicked member:", row.user._id)}
      />
    </>
  );
};
