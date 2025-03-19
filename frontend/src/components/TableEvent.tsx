import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TableEventProps } from "@/types/types";
import formatDateTable from "@/utils/formatDateTable";
import formatTime from "@/utils/formatTime";
import { Pencil, Trash } from "lucide-react";

const TableEvent = ({
  events,
  handleClickEvent,
  handleClickDelete,
  handleClickEdit,
}: TableEventProps) => {
  console.log(events)
  return (
    <Table className="border border-gray-300">
      <TableHeader className="bg-gray-50">
        <TableRow className="border border-gray-300">
          <TableHead>Event Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events &&
          events?.map((event, index) => (
            <TableRow
              className="cursor-pointer hover:bg-indigo-50"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleClickEvent(event.id || 0);
              }}
            >
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="">{event.event_type}</TableCell>
              <TableCell className="">
                {formatDateTable(event.date || "")}
              </TableCell>
              <TableCell className="">{`${formatTime(
                event.start_time || ""
              )} - ${formatTime(event.end_time || "")}`}</TableCell>
              <TableCell className="">{event.status}</TableCell>
              <TableCell className="flex gap-4">
                <button
                  className="cursor-pointer text-green-800 bg-green-100 hover:text-green-900 py-1 px-2 rounded-md flex items-center gap-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickEdit(event.id || 0);
                  }}
                >
                  <Pencil className="inline" size={16} />{" "}
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  className="cursor-pointer text-red-800 hover:text-red-900 bg-red-100 py-1 px-2 rounded-md flex items-center gap-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickDelete(event.id || 0);
                  }}
                >
                  <Trash className="inline" size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableEvent;
