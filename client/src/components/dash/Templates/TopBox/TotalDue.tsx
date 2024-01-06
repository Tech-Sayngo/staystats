import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import {selectAllbookings} from "@/lib/features/bookingSlice";
import {useSelector} from "react-redux";


function TotalDue() {
    let bookingData = useSelector(selectAllbookings);
    bookingData = bookingData.filter((item: any) => item.status === "CONFIRMED");

    //🚀 Upcoming Total Due
    //✅ Step-1 -> Filter Upcoming Total Due
    const confirmedBookingsForDue = bookingData.filter(
        (record:any): boolean => record.status == "CONFIRMED",
    );

    const currentDateForDue: string = new Date().toISOString();
    const futureBookingsForDue = confirmedBookingsForDue.filter(
        (record:any): boolean => {
            const checkInDateForDue: string =
                new Date(record.checkInDate).toISOString();
            return checkInDateForDue > currentDateForDue;
        },
    );

    const totalDueAmount: number = futureBookingsForDue.reduce((total:any, booking:any) => {
        return total + booking.dueAmount;
    }, 0);

    let chartData= [
        { name: "Sun", Dues: 0 },
        { name: "Mon", Dues: 0 },
        { name: "Tue", Dues: 0 },
        { name: "Wed", Dues: 0 },
        { name: "Thu", Dues: 0 },
        { name: "Fri", Dues: 0 },
        { name: "Sat", Dues: 0 },
    ]

    futureBookingsForDue.forEach((record:any) => {
        const cancelDate = new Date(record.createdAt);
        const dayOfWeek = cancelDate.getDay(); // 0 for Sunday, 1 for Monday, and so on// Increment the cancellations count for the corresponding day in chartData
        chartData[dayOfWeek].Dues++;
    });

     const TotalDue = {
        color: "#8884d8",
        icon: "/userIcon.svg",
        title: "Future Dues",
        number: totalDueAmount,
        dataKey: "Dues",
        percentage: futureBookingsForDue.length,
        reactIcon: "BsCalendar2Date",
        chartData:chartData
    };

    return (
        <TailwindWrapper className={"mt-5 justify-self-center"}>
            <div className="box box2">
                <ChartBox titleOfPercentage="Hotel count" {...TotalDue} />
            </div>
        </TailwindWrapper>
    );
}

export default TotalDue;