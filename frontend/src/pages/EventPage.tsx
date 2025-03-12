import CustomModal from "@/components/CustomModal";
import TableEvent from "@/components/TableEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import fetchAllEvents from "@/hooks/useFetchEvents";
import { type Event } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const EventPage = () => {
  const {
    mutate: deleteEvent,
    error: deleteError,
    isPending: isDeleting,
  } = useDeleteEvent();
  const {
    data,
    error: fetchError,
    isPending: isFetching,
  } = useQuery<Event[]>(fetchAllEvents);
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

  const handleDelete = () => {
    if (eventId !== null) {
      deleteEvent(eventId);
      setIsModalOpen(false);
    }
  };

  if (isFetching || isDeleting) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-gray-800 text-2xl">Loading...</span>
      </div>
    );
  }

  if (fetchError || deleteError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="">
          <h2 className="text-xl text-gray-800 font-bold">Events</h2>
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
            <option value="">All</option>
            <option value="others">Others</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>
      </div>

      <TableEvent
        events={paginatedEvents || []}
        handleClickEvent={handleClickEvent}
        handleClickDelete={handleClickDelete}
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

      <CustomModal
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
