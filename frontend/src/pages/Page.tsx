import { useQuery } from "@tanstack/react-query";
import useFetchEvents from "../hooks/useFetchEvents";
// import { Event as event } from "./types/types";

const Page = () => {
  const { isPending, data, error } = useQuery(useFetchEvents());

  if (isPending) {
    return (
      <div className="min-h-screen h-screen flex justify-center items-center">
        <span className="text-gray-800 text-2xl">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">Error while fetching</span>
      </div>
    );
  }

  console.log(data);
  return <div>Page</div>;
};

export default Page;
