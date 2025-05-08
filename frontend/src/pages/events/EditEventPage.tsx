import FormEditEvent from "@/components/FormEditEvent";
import { useParams } from "react-router";

const EditEventPage = () => {
  const { id } = useParams();

  return (
    <div className="dark:bg-zinc-900 h-full pb-12">
      <FormEditEvent id={id} />
    </div>
  );
};

export default EditEventPage;
