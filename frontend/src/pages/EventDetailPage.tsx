import useFetchAllEvent from "@/hooks/useFetchEvent";
import { useParams } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  const { data, isPending, error } = useFetchAllEvent(id || "");

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log(data)

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div>
      EventDetailPage
      <p className="text-4xl">ID is {id}</p>
    </div>
  );
};

export default EventDetailPage;
