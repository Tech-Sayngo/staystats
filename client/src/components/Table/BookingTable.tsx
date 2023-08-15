import React, { useEffect, useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditBooking from "../card/EditBooking";
import { InfinitySpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
interface TableProps {
  bookingData?: {
    hotelName?: string;
    guestName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    roomCategory?: string;
    numberOfRooms?: string;
    numberOfPersons?: string;
    bookingAmount?: string;
    advanceAmount?: string;
    dueAmount?: string;
    advanceDate?: string;
    bookingSource?: string;
    bookingBy?: string;
    plan?: string;
    contactNumber?: string;
    remarks?: string;
    status?: string;
    accountType?: string;
  }[];
  setBookingData: any;
  getBooking: (booking: object) => void;
  setShowModal: (value: boolean) => void;
  cancelBookingHandler: (id: string) => void;
  owner?: any;
  loading?: boolean;
}

const BookingTable = ({
  bookingData,
  getBooking,
  setShowModal,
  setBookingData,
  cancelBookingHandler,
  owner,
  loading,
}: TableProps) => {
  // console.log(bookingData);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingBookingData, setEditingBookingData] = useState<object>({});
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditModal]);

  const handleShowDeleteModal = (id: string) => {
    setBookingId(id);
    setShowDeletePopUp(true);
  };

  useEffect(() => {
    // console.log(bookingData);
  }, [bookingData]);
  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border-white border-2 text-sm text-left text-gray-500 dark:bg-inherit dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr className="">
              <th scope="col" className="px-4 text-center py-3">
                Hotel Name
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Guest Name
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Date
              </th>
              <th scope="col" className="px-4 text-center py-3">
                NOP
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Total amount
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Advance amount
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Booking Source
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Room Category
              </th>

              
              <th scope="col" className="px-6 py-3">
                Number of Room
              </th>
              <th scope="col" className="px-6 py-3">
                Number of Person
              </th>
              <th scope="col" className="px-6 py-3">
                Booking Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Advance Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Due Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Advance Date
              </th>
              <th scope="col" className="px-6 py-3">
                Booking Source
              </th>
              <th scope="col" className="px-6 py-3">
                Booking By
              </th>
              <th scope="col" className="px-6 py-3">
                Plan
              </th>
              <th scope="col" className="px-6 py-3">
                Contact Number
              </th>
              <th scope="col" className="px-6 py-3">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3">
                Account Type
              </th>

              <th scope="col" className="px-4 text-center py-3">
                OPTIONS
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl">
            {bookingData?.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}
            {bookingData && bookingData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  bookingData?.map((booking: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className={`text-center light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                          booking?.status === "CANCELLED"
                            ? "line-through text-red-400"
                            : ""
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap dark:text-white text-center "
                        >
                          {booking?.hotel?.hotelName || "DELETED HOTEL"}
                        </th>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {booking?.guestName || ""}
                        </td>
                        <td className="px-6 py-2 text-center ">
                          <p className="font-semibold whitespace-nowrap">
                            {new Date(booking?.checkInDate).toDateString()}
                          </p>
                          <span className="text-center">to</span>
                          <p className="font-semibold whitespace-nowrap">
                            {new Date(booking?.checkOutDate).toDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-2">
                          {booking?.numberOfPersons || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.bookingAmount || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.advanceAmount || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.bookingSource || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.status || "Created"}
                        </td>

                        <td className="px-6 py-4">
                          {booking.roomCategory || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.numberOfRooms || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.numberOfPersons || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.bookingAmount || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.advanceAmount || ""}
                        </td>
                        <td className="px-6 py-4">{booking.dueAmount || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking?.advanceDate).toDateString() || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.bookingSource || ""}
                        </td>
                        <td className="px-6 py-4">{booking.bookingBy || ""}</td>
                        <td className="px-6 py-4">{booking.plan || ""}</td>
                        <td className="px-6 py-4">
                          {booking.contactNumber || ""}
                        </td>
                        <td className="px-6 py-4">{booking.remarks || ""}</td>
                        <td className="px-6 py-4">
                          {booking.accountType || ""}
                        </td>
                        <td className="px-6 py-2">
                          <div className="flex justify-center items-center">
                            <button
                              // disabled={user.addedBy !== owner._id}
                              data-tip={"Preview Link"}
                              onClick={() => {
                                // console.log(booking);
                                getBooking(booking);
                                setShowModal(true);
                              }}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                            >
                              <AiOutlineEye className="" />
                            </button>
                            <button
                              disabled={booking?.status === "CANCELLED"}
                              data-tip={"Preview Link"}
                              onClick={() => {
                                setShowEditModal(true);
                                setEditingBookingData(booking);
                              }}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                            >
                              <FiEdit className="" />
                            </button>

                            <button
                              onClick={() => handleShowDeleteModal(booking._id)}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-xs rounded-md mr-2 disabled:opacity-50 cursor-pointer`}
                              disabled={booking?.status === "CANCELLED"}
                            >
                              <span className="m-0 p-0">Cancel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {showEditModal && editingBookingData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditBooking
            onClose={(value) => setShowEditModal(value)}
            setBookingData={setBookingData}
            editingBookingDataProps={editingBookingData}
            bookingData={bookingData}
            owner={owner}
          />
        </div>
      )}
      {showDeletePopup && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Cancel booking</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                No
              </button>
              <button
                onClick={() => {
                  cancelBookingHandler(bookingId);
                  setShowDeletePopUp(false);
                }}
                className="text-sm text-red-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
