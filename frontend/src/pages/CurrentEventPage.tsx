import { useParams } from "react-router-dom";

const CurrentEventPage = () => {
  const { id } = useParams();
  return (
    <div>
      CurrentEventPage
      <p className="text-4xl">ID is {id}</p>
    </div>
  );
};

export default CurrentEventPage;
