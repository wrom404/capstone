import TableArchive from "@/components/TableArchive";
import useFetchCanceledEvent from "@/hooks/usefetchCanceledEvents";
import { useEffect } from "react";

const ArchivePage = () => {
  const { data, isPending, error } = useFetchCanceledEvent();
  useEffect(() => {
    if (data) {
      console.log("data: ", data);
    }
  }, [data]);
  return (
    <div>
      <div className="">
        <div className="mb-4">
          <h2 className="text-2xl text-gray-800 font-bold">Canceled Events</h2>
        </div>
      </div>
      <TableArchive />
    </div>
  );
};

export default ArchivePage;
