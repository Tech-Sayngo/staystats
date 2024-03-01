"use client";
import React, { useEffect, useState } from "react";
import { MdWarningAmber, MdFileDownloadDone } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import axios from "@/utils/axios";
import EditLead from "../card/EditLead";
import { InfinitySpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
interface TableProps {
  leadsData: {
    _id: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfPerson: string;
    numberOfRooms: string;
    contactNumber: string;
    area: string;
    budget: string;
    specialRequirements: string;
    status: string;
    createdBy: { name?: string; username?: string; _id: string };
    approvedBy: { name?: string; username?: string; _id: string };
    isCancelled: boolean;
    serialNumber: string;
  }[];
  getLeads: (lead: object) => void;
  setShowModal: (value: boolean) => void;
  setLeadsData: (users: any) => void;
  owner?: any;
  loading?: boolean;
}

const LeadsTable = ({
  leadsData,
  setLeadsData,
  getLeads,
  setShowModal,
  owner,
  loading,
}: TableProps) => {
  // console.log(userData, "userdata");
  //   const [editingLeadsData, setEditingLeadsData] = useState<any>({});
  //   const [userId, setUserId] = useState<string>("");

  const [updating, setUpdating] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingLeadsData, setEditingLeadsData] = useState<object>({});

  useEffect(() => {
    if(leadsData?.length === 0){
      toast.error("No Leads Found");
    }
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditModal,leadsData]);

  // const confirmLeadHandler = async (id: string) => {
  //   try {
  //     setUpdating(true);
  //     const { data } = await axios.post("/leads/confirm-lead", {
  //       leadId: id,
  //     });
  //     if (!data.error) {
  //       // const { data } = await axios.post("/user/get-users");
  //       const leadIndex = leadsData.findIndex((lead: any) => lead._id === id);

  //       // If the user is found in the array, replace the data at that index
  //       if (leadIndex !== -1) {
  //         setLeadsData((prev: any) => {
  //           const updatedLeadData = [...prev];
  //           updatedLeadData[leadIndex] = data.lead;
  //           return updatedLeadData;
  //         });
  //       }
  //       toast.success(data.message);
  //     } else {
  //       toast.error(data.error);
  //     }
  //     setUpdating(false);
  //   } catch (error: any) {
  //     setUpdating(false);
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border border-gray-600/25 dark:border-gray-300/25 rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400 border">
            <tr className="whitespace-nowrap">
              <th scope="col" className="px-4 text-center py-3">
                #
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
                Rooms
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Contact Number
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Area
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Budget
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Special Requirements
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Generated By
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Approved By
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>

              
            </tr>
          </thead>
          <tbody className="rounded-xl">
            {/* {leadsData?.length === 0 && (
             
                
                <p className="mx-auto text-center">No Leads Found</p>
              
            )} */}
            {leadsData && leadsData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  leadsData?.map(
                    (
                      lead: {
                        _id: string;
                        guestName: string;
                        checkInDate: string;
                        checkOutDate: string;
                        numberOfPerson: string;
                        numberOfRooms: string;
                        contactNumber: string;
                        area: string;
                        budget: string;
                        specialRequirements: string;
                        status: string;
                        createdBy: {
                          name?: string;
                          username?: string;
                          _id: string;
                        };
                        approvedBy: {
                          name?: string;
                          username?: string;
                          _id: string;
                        };
                        isCancelled: boolean;
                        serialNumber: string;
                      },
                      index: number
                    ) => {
                      return (
                        <tr
                        data-tip={"View Lead"}
                                onClick={() => {
                                  getLeads(lead);
                                  setShowModal(true);
                                }}
                          key={index}
                          className={`text-center light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            lead?.isCancelled ? "line-through text-red-400" : ""
                          } ${
                            lead?.status === "CONFIRMED" ? "text-green-400" : ""
                          } `}
                        >
                          <th
                            scope="row"
                            className="px-6 py-2 uppercase font-medium whitespace-nowrap dark:text-white text-center "
                          >
                            {lead?.serialNumber || "*"}
                          </th>
                          <td className="px-6 py-2 uppercase whitespace-nowrap">
                            {lead?.guestName || ""}
                          </td>
                          <td className="px-6 py-2 uppercase text-center ">
                            <p className="font-semibold whitespace-nowrap">
                              {new Date(lead?.checkInDate).toDateString()}
                            </p>
                            <span className="text-center">to</span>
                            <p className="font-semibold whitespace-nowrap">
                              {new Date(lead?.checkOutDate).toDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-2 uppercase whitespace-nowrap">
                            {lead?.numberOfPerson || ""}
                          </td>
                          <td className="px-6 py-2 uppercase whitespace-nowrap">
                            {lead?.numberOfRooms || ""}
                          </td>
                          <td className="px-6 py-2 uppercase whitespace-nowrap">
                            {lead?.contactNumber || ""}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.area || ""}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.budget || ""}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.specialRequirements || ""}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.createdBy?.name
                              ? lead?.createdBy?.name
                              : lead?.createdBy?.username}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.approvedBy?.name
                              ? lead?.approvedBy?.name
                              : lead?.approvedBy?.username
                              ? lead?.approvedBy?.username
                              : "n/a"}
                          </td>
                          <td className="px-6 py-2 uppercase">
                            {lead?.status || "PENDING"}
                          </td>
                          {/* <td className="px-6 py-2 uppercase">
                            <div className="flex justify-center items-center">
                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"View Lead"}
                                onClick={() => {
                                  getLeads(lead);
                                  setShowModal(true);
                                }}
                                disabled={updating}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <AiOutlineEye
                                  size={20}
                                  className="inline-block"
                                />{" "}
                                View
                              </button>
                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"Edit Lead"}
                                onClick={() => {
                                  setShowEditModal(true);
                                  setEditingLeadsData(lead);
                                }}
                                disabled={
                                  updating ||
                                  (lead?.createdBy?._id !== owner?._id &&
                                    owner?.role !== "ADMIN") ||
                                  lead?.status === "CONFIRMED"
                                }
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <FiEdit size={20} className="inline-block" />{" "}
                                Edit
                              </button>

                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"update Lead"}
                                onClick={() => {
                                  confirmLeadHandler(lead?._id);
                                }}
                                disabled={
                                  lead?.status === "CONFIRMED" || updating
                                }
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <MdFileDownloadDone
                                  size={20}
                                  className="inline-block"
                                />{" "}
                                {lead?.status === "CONFIRMED"
                                  ? "Confirmed"
                                  : "Confirm"}
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      );
                    }
                  )
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {showEditModal && editingLeadsData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditLead
            onClose={(value) => setShowEditModal(value)}
            setLeadData={setLeadsData}
            editingLeadDataProps={editingLeadsData}
            leadData={leadsData}
            owner={owner}
          />
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
