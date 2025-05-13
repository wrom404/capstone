import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUserStore from "@/store/useUserStore";
import { CanceledEvent } from "@/types/types";
import formatDate from "@/utils/formatDateTable";
import formatTime from "@/utils/formatTime";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { roles as adminRoles } from "@/constant/constant";

function TableArchive({
  data,
  handleClickRestoreEvent,
  handleClickEvent,
}: {
  data: CanceledEvent[];
  handleClickRestoreEvent: (id: string) => void;
  handleClickEvent: (id: number) => void;
}) {
  const { userRole } = useUserStore();

  return (
    <motion.table
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-gray-300 dark:border-gray-800 w-full dark:bg-zinc-900"
    >
      <TableHeader className="bg-indigo-50 hover:bg-indigo-50">
        <TableRow className="border border-gray-300 dark:border-gray-800 dark:bg-zinc-900">
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Category
          </TableHead>
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Event Name
          </TableHead>
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Date
          </TableHead>
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Time
          </TableHead>
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Canceled on
          </TableHead>
          <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
            Status
          </TableHead>
          {userRole && adminRoles.includes(userRole) && (
            <TableHead className="text-gray-800 dark:text-gray-300 font-semibold">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((data, index) => (
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={data.id}
              onClick={() => handleClickEvent(data.id)}
              className="cursor-pointer hover:bg-gray-50 border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:bg-zinc-800"
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
              <TableCell>
                <span className="bg-red-50 text-red-600 py-1 px-2 rounded-md text-sm dark:bg-red-900 dark:text-red-100 font-medium">
                  {data.status || ""}
                </span>
              </TableCell>
              {userRole && adminRoles.includes(userRole) && (
                <TableCell>
                  <button
                    className="cursor-pointer text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 py-1 px-2 rounded-md flex items-center gap-1 dark:hover:bg-zinc-800 dark:hover:text-indigo-200"
                    onClick={() => handleClickRestoreEvent(data.id.toString())}
                  >
                    <RotateCcw size={16} />
                  </button>
                </TableCell>
              )}
            </motion.tr>
          ))
        ) : (
          <TableRow>
            <TableCell>No Canceled Events.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </motion.table>
  );
}

export default TableArchive;
