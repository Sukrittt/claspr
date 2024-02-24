import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";

interface SubmissionStatusProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  allowLateSubmission: boolean;
  setAllowLateSubmission: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  allowLateSubmission,
  setAllowLateSubmission,
  date,
  setDate,
}) => {
  return (
    <div className="border border-transparent -mt-2">
      <div className="flex flex-col gap-y-2">
        <DatePicker
          value={date}
          setValue={setDate}
          disabled={[{ before: new Date() }, new Date()]}
          placeholder="Pick a date for submission"
        />
        <div className="flex items-center justify-end gap-x-2">
          <Checkbox
            id="late-submission"
            checked={allowLateSubmission}
            onCheckedChange={(val) => setAllowLateSubmission(val as boolean)}
          />
          <label
            htmlFor="late-submission"
            className="text-sm tracking-tight text-gray-800 cursor-pointer"
          >
            Allow late submission?
          </label>
        </div>
      </div>
    </div>
  );
};
