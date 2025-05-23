import CustomDeleteModal from "@/components/CustomDeleteModal";
import TableEvent from "@/components/TableEvent";
import useDeleteEvent from "@/hooks/events/useDeleteEvent";
import useFetchAllEvents from "@/hooks/events/useFetchEvents";
import { type Event } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

const EventPage = () => {
  const {
    mutate: deleteEvent,
    error: deleteError,
    isPending: isDeleting,
    isSuccess: deleteSuccess,
  } = useDeleteEvent();

  const {
    data,
    error: fetchError,
    isPending: isFetching,
  } = useFetchAllEvents();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<Event[] | undefined>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<number | null>(null);

  const navigate = useNavigate();

  console.log("Data: ", data);

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
    if (deleteSuccess) {
      toast.success("Event deleted successfully");
    }
  }, [deleteSuccess]);

  // Pagination logic
  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = filteredEvents
    ? Math.ceil(filteredEvents.length / itemsPerPage)
    : 0;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClickEvent = (id: number) => {
    navigate(`/event/${id}`);
  };

  const handleClickDelete = (id: number) => {
    setIsModalOpen(true);
    setEventId(id);
  };

  const handleClickEdit = (id: number) => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = () => {
    if (eventId !== null) {
      deleteEvent(eventId);
      setIsModalOpen(false);
    }
  };

  if (isFetching || isDeleting) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError || deleteError) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-8 py-4 dark:bg-zinc-900">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl text-gray-800 font-bold dark:text-gray-200">
            Events
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Manage and track scheduled, upcoming, and completed events with
            ease.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
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
            className="border border-gray-300 px-3 py-1 w-full md:w-auto dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
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

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <TableEvent
          events={paginatedEvents || []}
          handleClickEvent={handleClickEvent}
          handleClickDelete={handleClickDelete}
          handleClickEdit={handleClickEdit}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-800 text-sm gap-4">
        <div className="flex items-center dark:text-gray-400">
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 px-2 py-1 ml-2 cursor-pointer dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
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
            className="border border-gray-300 px-3 py-1 mr-2 cursor-pointer disabled:opacity-50 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200"
          >
            <IoIosArrowBack size={20} />
          </button>
          <span className="text-gray-800 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border border-gray-300 px-3 py-1 ml-2 cursor-pointer disabled:opacity-50 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-200" 
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <CustomDeleteModal
        icon={TriangleAlert}
        isOpen={isModalOpen}
        title="Delete Event"
        message="Proceed to delete? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EventPage;
