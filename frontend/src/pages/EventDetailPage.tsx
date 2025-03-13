import { useParams } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      EventDetailPage
      <p className="text-4xl">ID is {id}</p>
    </div>
  );
};

export default EventDetailPage;
