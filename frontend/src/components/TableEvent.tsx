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
import { SquarePen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { roles } from "@/constant/constant";

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
          {userRole && roles.includes(userRole) && (
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
              className="cursor-pointer hover:bg-gray-50 border border-gray-300 text-gray-600"
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

              <TableCell className="">
                <span
                  className={`px-2 py-1 rounded-lg text-sm font-medium ${
                    event.status === "upcoming"
                      ? "bg-green-50 text-green-600"
                      : event.status === "completed"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {event.status &&
                    event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)}
                </span>
              </TableCell>

              {userRole && roles.includes(userRole) && (
                <TableCell className="flex gap-4">
                  <button
                    className="cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-100 py-1 rounded-md flex items-center gap-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickEdit(event.id || 0);
                    }}
                  >
                    <SquarePen className="inline" size={18} />{" "}
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 py-1 rounded-md flex items-center gap-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickDelete(event.id || 0);
                    }}
                  >
                    <Trash2 className="inline" size={18} />
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
