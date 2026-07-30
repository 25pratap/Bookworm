import { useEffect, useState } from "react";



function DeliveryPage() {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const getOrder = async () => {

      try {

        const token = localStorage.getItem("token");
        console.log("MY TOKEN:", token);


        const response = await fetch(
          "http://localhost:8000/delivery",
          {
            method: "GET",

            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );


        const data = await response.json();


        if (!response.ok) {
          console.log(data.detail);
          return;
        }


        // latest order
        if(data.length > 0){
          const latestOrder = data[data.length - 1];
          setOrder(latestOrder);
        }
 



      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


    getOrder();

  }, []);



  if (loading) {

    return (
      <h2 className="text-center mt-10">
        Loading delivery details...
      </h2>
    );

  }



  return (

    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">

      <h1 className="text-3xl font-bold mb-6">
        Delivery Details
      </h1>


      {
        order ? (

          <div className="space-y-4">


            <div>
              <label className="font-semibold">
                Name
              </label>

              <p className="border p-3 rounded">
                {order.name}
              </p>
            </div>



            <div>
              <label className="font-semibold">
                Phone Number
              </label>

              <p className="border p-3 rounded">
                {order.phone}
              </p>
            </div>



            <div>
              <label className="font-semibold">
                Address
              </label>

              <p className="border p-3 rounded">
                {order.address}
              </p>
            </div>



            <div>
              <label className="font-semibold">
                City
              </label>

              <p className="border p-3 rounded">
                {order.city}
              </p>
            </div>



            <div>
              <label className="font-semibold">
                State
              </label>

              <p className="border p-3 rounded">
                {order.state}
              </p>
            </div>



            <div>
              <label className="font-semibold">
                Delivery Status
              </label>

              <p className="border p-3 rounded">
                {order.status}
              </p>
            </div>


          </div>


        ) : (

          <p>No order found</p>

        )
      }


    </div>

  );

}


export default DeliveryPage;