const { Booking } = require("../models/bookingModel");
const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBooking = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(200).json({ error: "No booking found", booking: {} });
      return;
    } else {
      res.status(200).json({ booking });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    //scripts to change db
    // async function updateSerialNumbers() {
    //   try {
    //     const bookings = await Booking.find().sort({ createdAt: 1 }); // Sort by creation date in ascending order

    //     // Update serial numbers
    //     for (let i = 0; i < bookings.length; i++) {
    //       const booking = bookings[i];
    //       booking.serialNumber = i + 1;
    //       booking.advanceDate = booking.createdAt;
    //       booking.advanceAmount = booking.bookingAmount;
    //       await booking.save();
    //     }

    //     console.log('Serial numbers updated successfully.');
    //   } catch (error) {
    //     console.error('Error updating serial numbers:', error);
    //   }
    // }
    // await updateSerialNumbers();

    let {
      page,
      limit,
      sortBy,
      sortOrder,
      location,
      addedByMe,
      addedBy,
      filterBy,
      bookingSource,
      serialNumber,
      guestName,
      hotelName,
      status,
    } = req.query;
    let { startDate, endDate } = req.body;
    // console.log("req.body: ", req.body);
    // console.log("req.query: ", req.query);
    let query_page = parseInt(page) ?? 1;
    let query_limit = parseInt(limit) ?? 10;

    let skipIndex = (query_page - 1) * query_limit;
    let bookings;

    console.log("[get all bookings controller: =>]");
    console.time("get bookings");

    // Fetch bookings with applied filters and sorting
    let filter = {};

    if (req.user.role === "SUBADMIN") {
      filter.addedBy = req.user._id;
    }

    if (filterBy && startDate && endDate) {
      if (filterBy === "checkInDate") {
        filter.checkInDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (filterBy === "checkOutDate") {
        filter.checkOutDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (filterBy === "createdAt") {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (filterBy === "updatedAt") {
        filter.updatedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (filterBy === "status") {
        status = "CANCELLED";
        filter.updatedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }
    if (
      bookingSource !== "undefined" &&
      bookingSource !== "null" &&
      bookingSource !== "" &&
      bookingSource !== "--select--"
    ) {
      filter.bookingSource = bookingSource;
    }
    if (
      serialNumber !== "undefined" &&
      serialNumber !== "null" &&
      serialNumber !== ""
    ) {
      filter.serialNumber = serialNumber;
    }
    if (guestName !== "undefined" && guestName !== "null" && guestName !== "") {
      filter.guestName = guestName.toUpperCase();
    }
    if (
      hotelName !== "undefined" &&
      hotelName !== "null" &&
      hotelName !== "" &&
      hotelName !== "--select--"
    ) {
      filter.hotel = hotelName;
    }
    if (
      addedBy !== "undefined" &&
      addedBy !== "null" &&
      addedBy !== "" &&
      addedBy !== "--select--"
    ) {
      filter.addedBy = addedBy;
    }
    if (
      status !== "undefined" &&
      status !== "null" &&
      status !== "" &&
      status !== "--select--"
    ) {
      filter.status = status;
    }

    console.log("filter: ", filter);
    let bookingsForCalculation;
    // Fetch all bookings
    if (page && limit) {
      bookingsForCalculation = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate({ path: "hotel", model: Hotel })
        .populate({ path: "addedBy", model: User });

      bookings = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .skip(skipIndex)
        .limit(query_limit)
        .populate({ path: "hotel", model: Hotel })
        .populate({ path: "addedBy", model: User });
    } else {
      bookings = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate({ path: "hotel", model: Hotel });
    }

    let bookingsCount = await Booking.countDocuments(filter);
    console.log("bookingsCount: ", bookingsCount);

    console.timeEnd("get bookings");

    if (!bookings || bookings.length === 0) {
      res.status(200).json({
        message: "No bookings found",
        bookings: [],
        bookingsCount: bookingsCount ?? 0,
      });
      return;
    } else {
      // if the booking status is not cancelled then add the total amount of booking in a variable

      let totalBookingAmt = 0;
      let totalAdvanceAmt = 0;
      let totalDueAmt = 0;

      bookingsForCalculation &&
        bookingsForCalculation.forEach((booking) => {
          if (booking.status !== "CANCELLED") {
            totalBookingAmt += booking.bookingAmount;
            totalAdvanceAmt += booking.advanceAmount;
            totalDueAmt += booking.dueAmount;
          }
        });

      // console.log(totalBookingAmt);
      res.status(200).json({
        bookings,
        bookingsCount: bookingsCount ?? 0,
        totalBookingAmt,
        totalAdvanceAmt,
        totalDueAmt,
      });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getAllBookingsBySearch = async (req, res) => {
  const { query } = req.query;
  console.log("[get all bookings by search controller: =>]");
  console.log(req.query);
  try {
    let filter = {};

    if (req.user.role === "SUBADMIN") {
      filter.addedBy = req.user._id;
    }

    const regex = new RegExp(escapeRegex(query), "gi");

    const bookings = await Booking.find(filter)
      .or([
        { guestName: regex }, // Search for bookings with guentName matching the provided regex
        { contactNumber: regex },
        {
          hotel: {
            $in: await Hotel.find({
              $or: [
                { hotelName: regex }, // Search for hotels with hotelName matching the provided regex
                { location: regex }, // Search for hotels with location matching the provided regex
              ],
            }).distinct("_id"),
          },
        },
      ])
      .populate({
        path: "hotel",
        model: Hotel,
      });

    if (bookings.length > 0) {
      console.log(bookings);
      res
        .status(200)
        .json({ bookings, message: "Bookings fetched successfully" });
    } else {
      console.log("No result found for this search");
      res
        .status(200)
        .json({ bookings, message: "No result found for this search" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

const createBooking = async (req, res) => {
  const {
    hotel,
    guestName,
    checkInDate,
    checkOutDate,
    roomCategory,
    numberOfRooms,
    numberOfPersons,
    bookingAmount,
    advanceAmount,
    dueAmount,
    advanceDate,
    bookingSource,
    bookingBy,
    plan,
    contactNumber,
    accountType,
    remarks,
    guestEmail,
  } = req.body;
  try {
    const bookingsCount = await Booking.countDocuments();
    const newBooking = await Booking.create({
      hotel,
      guestName,
      checkInDate,
      checkOutDate,
      roomCategory,
      numberOfRooms,
      numberOfPersons,
      bookingAmount,
      advanceAmount,
      dueAmount,
      advanceDate,
      bookingSource,
      bookingBy,
      plan,
      contactNumber,
      accountType,
      remarks,
      guestEmail,
      addedBy: req.user._id,
      serialNumber: bookingsCount + 1,
    });
    if (!newBooking) {
      res.status(201).json({ message: "Booking not created", booking: {} });
      return;
    }

    const populatedBooking = await Booking.findById(newBooking._id).populate({
      path: "hotel",
      model: Hotel,
    });

    res.status(200).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  const {
    id,
    guestName,
    checkInDate,
    checkOutDate,
    roomCategory,
    numberOfRooms,
    numberOfPersons,
    bookingAmount,
    advanceAmount,
    dueAmount,
    advanceDate,
    bookingSource,
    bookingBy,
    accountType,
    plan,
    contactNumber,
    remarks,
    guestEmail,
    status,
  } = req.body;
  try {
    console.log("[update bookings controller]");

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        guestName,
        checkInDate,
        checkOutDate,
        roomCategory,
        numberOfRooms,
        numberOfPersons,
        bookingAmount,
        advanceAmount,
        dueAmount,
        advanceDate,
        bookingSource,
        bookingBy,
        accountType,
        plan,
        contactNumber,
        remarks,
        guestEmail,
        status,
      },
      { new: true } // This option returns the updated document after the update is applied
    );

    if (!updatedBooking) {
      return res.status(201).json({ error: "Booking not found" });
    }

    const populatedBooking = await Booking.findById(
      updatedBooking._id
    ).populate({
      path: "hotel",
      model: Hotel,
    });

    res.status(200).json({
      message: "Booking updated successfully",
      user: populatedBooking,
    });
  } catch (error) {
    console.log("[booking controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status,
      },
      { new: true } // This option returns the updated document after the update is applied
    );

    if (!updatedBooking) {
      return res.status(201).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const downloadExcel = async (req, res) => {};

module.exports = {
  getBooking,
  getAllBookings,
  getAllBookingsBySearch,
  createBooking,
  updateBooking,
  cancelBooking,
  downloadExcel,
};
