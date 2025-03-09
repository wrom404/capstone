import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TableEventProps } from "@/types/types";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import { Pencil, Trash } from "lucide-react";

const TableEvent = ({ events }: TableEventProps) => {

  function handleClickEvent(id: number) {
    window.alert(`ID is ${id}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
              onClick={() => handleClickEvent(event.id)}
              key={index}
            >
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="">{event.event_type}</TableCell>
              <TableCell className="">{formatDate(event.date)}</TableCell>
              <TableCell className="">{`${formatTime(
                event.start_time
              )} - ${formatTime(event.end_time)}`}</TableCell>
              <TableCell className="">{event.status}</TableCell>
              <TableCell className="flex gap-6">
                <button className="cursor-pointer hover:text-green-800">
                  <Pencil className="inline" size={16} />{" "}
                  <span className="text-sm">Edit</span>
                </button>
                <button className="cursor-pointer hover:text-red-800">
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
