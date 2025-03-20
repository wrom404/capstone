import CustomDeleteModal from "@/components/CustomDeleteModal";
import TableEvent from "@/components/TableEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import useFetchAllEvents from "@/hooks/useFetchEvents";
import { type Event } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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

  console.log(filteredEvents)
  console.log(data)

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
    <div className="">
      <div className="flex justify-between">
        <div className="">
          <h2 className="text-2xl text-gray-800 font-bold">Events</h2>
        </div>
        <div className="">
          <input
            type="text"
            className="border border-gray-300 py-1 px-3"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            name="category"
            onChange={handleSelectChange}
            value={selectedCategory}
            className="border px-3 py-1 mb-4 ml-4"
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

      <TableEvent
        events={paginatedEvents || []}
        handleClickEvent={handleClickEvent}
        handleClickDelete={handleClickDelete}
        handleClickEdit={handleClickEdit}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6 text-gray-800 text-sm">
        <div>
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border px-2 py-1 ml-2 cursor-pointer"
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
            className="border px-3 py-1 mr-2 cursor-pointer"
          >
            <IoIosArrowBack size={20} />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border px-3 py-1 ml-2 cursor-pointer"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      <CustomDeleteModal
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
