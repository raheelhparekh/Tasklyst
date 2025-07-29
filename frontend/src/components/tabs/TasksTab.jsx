import { DataTable } from "@/components/ui/DataTable";

export const TasksTab = ({
  title,
  data,
  columns,
}) => {
  return (
    <div className="w-full">
      <h2 className="mb-6 text-2xl font-bold text-violet-900 dark:text-violet-100">
        {title}
      </h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
