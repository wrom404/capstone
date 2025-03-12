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
}: TableEventProps) => {
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
              className="cursor-pointer"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleClickEvent(event.id || 0);
              }}
            >
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="">{event.event_type}</TableCell>
              <TableCell className="">{formatDateTable(event.date || "")}</TableCell>
              <TableCell className="">{`${formatTime(
                event.start_time || ""
              )} - ${formatTime(event.end_time || "")}`}</TableCell>
              <TableCell className="">{event.status}</TableCell>
              <TableCell className="flex gap-6">
                <button className="cursor-pointer hover:text-green-800">
                  <Pencil className="inline" size={16} />{" "}
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  className="cursor-pointer hover:text-red-800"
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
