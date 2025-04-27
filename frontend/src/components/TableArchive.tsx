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

function TableArchive({
  data,
  handleClickRestoreEvent,
}: {
  data: CanceledEvent[];
  handleClickRestoreEvent: (id: string) => void;
}) {
  const { userRole } = useUserStore();

  return (
    <motion.table
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-gray-300 w-full"
    >
      <TableHeader className="bg-indigo-50 hover:bg-indigo-50">
        <TableRow>
          <TableHead className="text-gray-800 font-semibold">
            Category
          </TableHead>
          <TableHead className="text-gray-800 font-semibold">
            Event Name
          </TableHead>
          <TableHead className="text-gray-800 font-semibold">Date</TableHead>
          <TableHead className="text-gray-800 font-semibold">Time</TableHead>
          <TableHead className="text-gray-800 font-semibold">
            Canceled on
          </TableHead>
          <TableHead className="text-gray-800 font-semibold">Status</TableHead>
          {userRole && userRole === "admin" && (
            <TableHead className="text-gray-800 font-semibold">
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
              className="cursor-pointer hover:bg-gray-50 border border-gray-30 text-gray-600"
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
              {userRole && userRole === "admin" && (
                <TableCell>
                  <button
                    className="cursor-pointer text-indigo-800 bg-indigo-100 hover:text-indigo-900 py-1 px-2 rounded-md flex items-center gap-1"
                    onClick={() => handleClickRestoreEvent(data.id.toString())}
                  >
                    <RotateCcw size={16} />
                    Restore
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
