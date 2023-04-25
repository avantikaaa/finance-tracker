export default function DetailsCard({amount, to, from, interest, date, category}){
    return (
        <div className="detailsCard">

        <div className="texts">
          <h2>
           {amount}
          </h2>
          <p className= "info">
            <a href= "" className = "author"> {from} Paid to {to} </a>
            <time> On date {date}</time>
          </p>
          <p className = "summary">
            Falls in - {category}
          </p>
        </div>
      </div>
    );
}