export const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
         return (
         <div
            className="custom-tooltip"
            style={{
               backgroundColor: "#ffff",
               padding: "5px",
               border: "1px solid #cccc"
            }}
         >
            <label>{`${payload[0]._id} : Rs. ${payload[0].amount}`}</label>
         </div>
      );
   }
   return null;
};