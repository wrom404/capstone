import RoutePage from "./routes/Route";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="dark:bg-zinc-900 min-h-screen h-full">
      <RoutePage />
      <Toaster />
    </div>
  );
};

export default App;
