export default function SummaryCard({

    title,

    value

}) {

    return (

        <div
            style={{

                background: "#fff",

                padding: 20,

                borderRadius: 10,

                boxShadow: "0 2px 6px rgba(0,0,0,.1)"

            }}
        >

            <h4>{title}</h4>

            <h2>{value}</h2>

        </div>

    );

}