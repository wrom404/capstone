import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CanceledEvent } from "@/types/types";
import formatDate from "@/utils/formatDateTable";
import formatTime from "@/utils/formatTime";
import { RotateCcw } from "lucide-react";

function TableArchive({
  data,
  handleClickRestoreEvent,
}: {
  data: CanceledEvent[];
  handleClickRestoreEvent: (id: string) => void;
}) {
  return (
    <Table className="border">
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Canceled on</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((data) => (
            <TableRow
              key={data.id}
              className="cursor-pointer hover:bg-indigo-50"
            >
              <TableCell className="font-medium">{data.title || ""}</TableCell>
              <TableCell>{data.event_type || ""}</TableCell>
              <TableCell>{formatDate(data?.date.toString() || "")}</TableCell>
              <TableCell>{`${formatTime(
                data.start_time.toString() || ""
              )} - ${formatTime(data.end_time.toString() || "")}`}</TableCell>
              <TableCell>
                {formatDate(data?.canceled_at.toString() || "")}
              </TableCell>
              <TableCell>{data.status || ""}</TableCell>
              <TableCell>
                <button
                  className="cursor-pointer text-indigo-800 bg-indigo-100 hover:text-indigo-900 py-1 px-2 rounded-md flex items-center gap-1"
                  onClick={() => handleClickRestoreEvent(data.id.toString())}
                >
                  <RotateCcw size={16} />
                  Restore
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>No Canceled Events.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableArchive;
