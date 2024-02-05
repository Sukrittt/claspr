import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AssignmentFilter = () => {
  return (
    <Select defaultValue="pending">
      <SelectTrigger className="w-[200px] font-medium text-[12px]">
        <SelectValue placeholder="Filter assignments" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="evaluated">Evaluated</SelectItem>
        <SelectItem value="changes-requested">Changes Requested</SelectItem>
        <SelectItem value="not-submitted">Not Submitted</SelectItem>
      </SelectContent>
    </Select>
  );
};
