import CarListItem from "./CarListItem";

const CarList = ({ cars, onDelete }) => (
  <div className="max-w-7xl mx-auto space-y-4 p-4">
    <ul>
      {cars.map((car) => (
        <CarListItem key={car.$id} car={car} onDelete={onDelete} />
      ))}
    </ul>
  </div>
);

export default CarList;
