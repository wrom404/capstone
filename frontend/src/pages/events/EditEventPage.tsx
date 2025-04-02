import FormEditEvent from "@/components/FormEditEvent";
import { useParams } from "react-router";

const EditEventPage = () => {
  const { id } = useParams();

  return (
    <div>
      <FormEditEvent id={id} />
    </div>
  );
};

export default EditEventPage;
