import TableArchive from "@/components/TableArchive";
import useFetchCanceledEvent from "@/hooks/events/useFetchCanceledEvents";
import { type CanceledEvent } from "@/types/types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import CustomDeleteModal from "@/components/CustomDeleteModal";
import { RotateCcw } from "lucide-react";
import useRestoreEvent from "@/hooks/events/useRestoreEvent";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ArchivePage = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const {
    data,
    isPending: isFetching,
    error: fetchError,
  } = useFetchCanceledEvent();
  const {
    mutate: restoreEvent,
    isPending: isRestoring,
    isSuccess,
    error: restoreError,
  } = useRestoreEvent(eventId || "");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<
    CanceledEvent[] | undefined
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    let events = data;

    if (searchQuery) {
      events = events?.filter((event) =>
        event.title
          ? event.title.toLowerCase().includes(searchQuery.toLowerCase())
          : false
      );
    }

    if (selectedCategory) {
      events = events?.filter((event) =>
        event.event_type
          ? event.event_type.toLowerCase() === selectedCategory
          : false
      );
    }

    setFilteredEvents(events);
  }, [setFilteredEvents, data, searchQuery, selectedCategory]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Event restored successfully.");
    }
  }, [isSuccess]);

  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = filteredEvents
    ? Math.ceil(filteredEvents.length / itemsPerPage)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClickRestoreEvent = (id: string) => {
    if (id !== null) {
      setIsModalOpen(true);
      setEventId(id);
    }
  };

  const handleRestoreEvent = () => {
    if (eventId !== null) {
      restoreEvent(eventId);
      setIsModalOpen(false);
    }
  };

  const handleClickEvent = (id: number) => {
    navigate(`/event/${id}`);
  };

  if (isFetching || isRestoring) {
    return (
      <div className="min-h-full flex justify-center items-center dark:bg-zinc-900">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError || restoreError) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between dark:bg-zinc-900 items-center">
        <div className="mb-6">
          <h2 className="text-2xl text-gray-800 font-bold dark:text-gray-300">
            Canceled Events
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Manage and track canceled events with ease.
          </p>
        </div>
        <div className="mt-6">
          <input
            type="text"
            className="border border-gray-300 py-1 px-3 w-full md:w-auto dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            name="category"
            onChange={handleSelectChange}
            value={selectedCategory}
            className="border px-3 py-1 mb-4 ml-4 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
          >
            <option value="">Filter</option>
            <option value="mass">Mass</option>
            <option value="wedding">Wedding</option>
            <option value="baptism">Baptism</option>
            <option value="funeral">Funeral</option>
            <option value="confession">Confession</option>
            <option value="meeting">Meeting</option>
            <option value="others">Others</option>
          </select>
        </div>
      </div>
      <TableArchive
        handleClickEvent={handleClickEvent}
        data={paginatedEvents || []}
        handleClickRestoreEvent={handleClickRestoreEvent}
      />
      <div className="flex justify-between items-center mt-6 text-gray-800 text-sm dark:text-gray-400">
        <div>
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border px-2 py-1 ml-2 cursor-pointer dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
          >
            {[10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border px-3 py-1 mr-2 cursor-pointer dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
          >
            <IoIosArrowBack size={20} />
          </button>
          <span className="text-gray-800 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border px-3 py-1 ml-2 cursor-pointer dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>
      <CustomDeleteModal
        icon={RotateCcw}
        isOpen={isModalOpen}
        title="Restore Event"
        message="Proceed to Restore?"
        onConfirm={handleRestoreEvent}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ArchivePage;
