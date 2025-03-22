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
    <Table className="border border-gray-300">
      <TableHeader className="bg-indigo-50 hover:bg-indigo-50">
        <TableRow>
          <TableHead className="text-gray-800 font-semibold">Category</TableHead>
          <TableHead className="text-gray-800 font-semibold">Event Name</TableHead>
          <TableHead className="text-gray-800 font-semibold">Date</TableHead>
          <TableHead className="text-gray-800 font-semibold">Time</TableHead>
          <TableHead className="text-gray-800 font-semibold">Canceled on</TableHead>
          <TableHead className="text-gray-800 font-semibold">Status</TableHead>
          <TableHead className="text-gray-800 font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((data) => (
            <TableRow
              key={data.id}
              className="cursor-pointer hover:bg-gray-50 border border-gray-30"
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
