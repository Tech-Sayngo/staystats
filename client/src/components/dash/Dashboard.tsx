"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllBookingsAsync,
  selectAllbookings,
} from "@/lib/features/bookingSlice";
import { fetchAllUsersAsync } from "@/lib/features/userSlice";
import { fetchAllHotelsAsync } from "@/lib/features/hotelSlice";

import Checkin from "@/components/dash/Templates/TopBox/Checkin";
import Checkout from "@/components/dash/Templates/TopBox/Checkout";
import TodaysBooking from "@/components/dash/Templates/TopBox/TodaysBooking";
import TodaysModifiedBooking from "@/components/dash/Templates/TopBox/TodaysModifiedBooking";
import TodaysCancelledBooking from "@/components/dash/Templates/TopBox/TodaysCancelledBooking";
import TotalUsers from "@/components/dash/Templates/TopBox/TotalUsers";
import TotalRevenue from "@/components/dash/Templates/TopBox/TotalRevenue";
import TotalDue from "@/components/dash/Templates/TopBox/TotalDue";
import TotalHotels from "@/components/dash/Templates/TopBox/TotalHotels";

import RevenueChart from "@/components/dash/Templates/MiddleBox/AreaChartRevBookDate";
import { BookingData } from "@/lib/Types/Dashboard/types";
import RevenueCheckinAreaChart from "@/components/dash/Templates/MiddleBox/AreaChartRevCheckinDate";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import AreaChartBookingBookingDate from "@/components/dash/Templates/MiddleBox/AreaChartBookingBookingDate";
import AreaChartBookingCheckinDate from "@/components/dash/Templates/MiddleBox/AreaChartBookingCheckinDate";
import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import RevenueBarChart from "@/components/dash/Templates/BottomBox/BarChart";
import { AppDispatch } from "@/lib/redux/store";
const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [area, setArea] = useState("Revenue");
  const [date, setDate] = useState("byBookingDate");
  const [day, setDay] = useState(7);

  useEffect(() => {
    dispatch(fetchAllBookingsAsync())
      .then(() => {
        console.log("fetchAllProductsAsync dispatched successfully");
      })
      .catch((error: any) => {
        console.error("Error dispatching fetchAllProductsAsync:", error);
      });
  }, []);
  const bookingData: BookingData[] = useSelector(selectAllbookings);
  //Revenue and Booking
  const createdAt = bookingData.map((item: any) => item.createdAt);
  const advanceAmount = bookingData.map((item: any) => item.advanceAmount);

  //Revenue and Checkin
  const checkInDate = bookingData.map((item: any) => item.checkInDate);
  const bookingAmount = bookingData.map((item: any) => item.bookingAmount);
  //Booking and Booking
  const bookingCount = bookingData.map(
    (item: any) => item.bookingAmount.length,
  );
  const bookingDate = bookingData.map((item: any) => item.createdAt);
  const revenueAndBooking = createdAt.map((item: any, i: any) => ({
    createdAt: createdAt[i],
    advanceAmount: advanceAmount[i],
  }));
  //Bottom Bar Chart
  const bookingSource = bookingData.map((item: any) => item.bookingSource);

  const bookingAmountBar = bookingData.map((item: any) => item.bookingAmount);

  const createdDate = bookingData.map((item: any) => item.createdAt);

  const revenueAndCheckin = advanceAmount.map((item: any, i: any) => ({
    checkInDate: checkInDate[i],
    bookingAmount: bookingAmount[i],
  }));

  const bookingAndBooking = bookingCount.map((item: any, i: any) => ({
    createdAt: bookingDate[i],
    bookingAmount: bookingCount[i],
  }));

  const bookingAndCheckin = bookingCount.map((item: any, i: any) => ({
    checkInDate: checkInDate[i],
    bookingAmount: bookingCount[i],
  }));

  const handleAreaChange = (newArea: any) => {
    setArea(newArea);
  };

  const handleDateChange = (newDate: any) => {
    setDate(newDate);
  };

  const handleDayChange = (newDay: any) => {
    setDay(newDay);
  };

  useEffect(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const last30DaysRevenueData = revenueAndBooking.filter(
      (dataPoint) => new Date(dataPoint.createdAt) >= thirtyDaysAgo,
    );
    const totalRevenueLast30Days: number = last30DaysRevenueData.reduce(
      (total, dataPoint) => {
        return total + parseFloat(dataPoint.advanceAmount);
      },
      0,
    );

    const averageRevenue =
      totalRevenueLast30Days / last30DaysRevenueData.length;

    setTotalRevenue(totalRevenueLast30Days);
  });

  return (
    <>
      <div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          <Checkin />
          <Checkout />
          <TodaysBooking />
          <TodaysModifiedBooking />
          <TotalUsers />
          {/*<TodaysCancelledBooking/>*/}
          {/*<TotalRevenue/>*/}
          <TotalDue />
          <TotalHotels />
        </div>

        <TailwindWrapper className="h-50 mt-5">
          {/*// Select // Arachart //calculation*/}
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 md:text-left text-center">
            Last 30 days
          </h1>
          <div className="flex gap-5 justify-center sm:justify-start">
            <select
              id="booking"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => handleAreaChange(e.target.value)}
              value={area}
            >
              <option selected={true} value="Revenue">
                Revenue
              </option>
              <option value="Booking">Booking</option>
            </select>
            <select
              id="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => handleDateChange(e.target.value)}
              value={date}
            >
              <option selected={true} value="byBookingDate">
                By Booking Date
              </option>
              <option value="byCheckinDate">By Checkin Date</option>
            </select>
          </div>
          <div className="flex justify-center sm:justify-end w-50">
            <p className="flex items-center mb-2 mr-4">
              <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
              <span>Last 30 days</span>
            </p>
            <p className="flex items-center mb-2">
              <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
              <span>Last Year</span>
            </p>
          </div>
          {area === "Revenue" && date === "byBookingDate" && (
            <>
              <RevenueChart data={revenueAndBooking} />
            </>
          )}
          {area === "Revenue" && date === "byCheckinDate" && (
            <>
              <RevenueCheckinAreaChart data={revenueAndCheckin} />
            </>
          )}

          {area === "Booking" && date === "byBookingDate" && (
            <>
              <AreaChartBookingBookingDate data={bookingAndBooking} />
            </>
          )}

          {area === "Booking" && date === "byCheckinDate" && (
            <>
              <AreaChartBookingCheckinDate data={bookingAndCheckin} />
            </>
          )}

          <div className="flex justify-evenly">
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-semibold mb-2">
                ₹{totalRevenue.toFixed(2)}
              </h1>
              Total Revenue
            </div>

            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-semibold mb-2">
                ₹{(totalRevenue / 30).toFixed(2)}
              </h1>
              Average Revenue Per Day
            </div>
          </div>
        </TailwindWrapper>
        <TailwindWrapper className="h-50 mt-5">
          <div className="flex justify-between">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 md:text-left text-center">
              OTA Performance
            </h1>
            <div className="flex gap-5 justify-center sm:justify-start">
              <select
                id="booking"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => handleDayChange(e.target.value)}
                value={day}
              >
                <option selected={true} value="Revenue">
                  Today
                </option>
                {/*//7 = This Week //-7 = Last Week //30 = This Month //-30 = Last Month //365 = This Year //-365 = Last Year*/}
                <option value={7}>This Week</option>
                <option value={-7}>Last Week</option>
                <option value={30}>This Month</option>
                <option value={-30}>Last Month</option>
                <option value={365}>This Year</option>
                <option value={-365}>Last Year</option>
              </select>
            </div>
          </div>
          <RevenueBarChart
            bookingSource={bookingSource}
            bookingAmount={bookingAmountBar}
            //@ts-ignore
            compareDate={createdDate}
            day={day}
          />
          {day}
        </TailwindWrapper>
      </div>
    </>
  );
};

export default Dashboard;
