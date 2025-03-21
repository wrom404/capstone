import TableArchive from "@/components/TableArchive";
import useFetchCanceledEvent from "@/hooks/useFetchCanceledEvents";
import { type CanceledEvent } from "@/types/types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import CustomDeleteModal from "@/components/CustomDeleteModal";
import { RotateCcw } from "lucide-react";

const ArchivePage = () => {
  const {
    data,
    isPending: isFetching,
    error: fetchError,
  } = useFetchCanceledEvent();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<
    CanceledEvent[] | undefined
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | null>(null);

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
      // deleteEvent(eventId);
      setIsModalOpen(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError) {
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
      <div className="flex justify-between">
        <div className="">
          <h2 className="text-2xl text-gray-800 font-bold">Canceled Events</h2>
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
      <TableArchive
        data={paginatedEvents || []}
        handleClickRestoreEvent={handleClickRestoreEvent}
      />
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
        icon={RotateCcw}
        isOpen={isModalOpen}
        title="Restore Event"
        message="Proceed to Restore? This action cannot be undone."
        onConfirm={handleRestoreEvent}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ArchivePage;
