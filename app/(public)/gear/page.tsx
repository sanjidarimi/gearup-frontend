"use client"
import { useGears } from "@/features/gear/queries";

const GearPage = () => {
  const { data } = useGears();
  console.log(data);
  return (
    <>
      {data?.data.map((gear) => (
        <div key={gear.id}>
          <h2>{gear.name}</h2>
          <p>${gear.price}</p>
        </div>
      ))}
    </>
  );
};

export default GearPage;
