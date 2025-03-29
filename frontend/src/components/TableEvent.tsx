import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUserStore from "@/store/useUserStore";
import { type TableEventProps } from "@/types/types";
import formatDateTable from "@/utils/formatDateTable";
import formatTime from "@/utils/formatTime";
import { Pencil, Trash } from "lucide-react";
import { motion } from "framer-motion";

const TableEvent = ({
  events,
  handleClickEvent,
  handleClickDelete,
  handleClickEdit,
}: TableEventProps) => {
  const { userRole } = useUserStore();
  console.log(events);
  return (
    <motion.table
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-gray-300 w-full"
    >
      <TableHeader className="bg-indigo-50">
        <TableRow className="border border-gray-300">
          <TableHead className="text-gray-800 font-semibold">
            Event Name
          </TableHead>
          <TableHead className="text-gray-800 font-semibold">
            Category
          </TableHead>
          <TableHead className="text-gray-800 font-semibold">Date</TableHead>
          <TableHead className="text-gray-800 font-semibold">Time</TableHead>
          <TableHead className="text-gray-800 font-semibold">Status</TableHead>
          {userRole && userRole === "admin" && (
            <TableHead className="text-gray-800 font-semibold">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {events &&
          events?.map((event, index) => (
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:bg-gray-50 border border-gray-300"
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
              {userRole && userRole === "admin" && (
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
              )}
            </motion.tr>
          ))}
      </TableBody>
    </motion.table>
  );
};

export default TableEvent;
