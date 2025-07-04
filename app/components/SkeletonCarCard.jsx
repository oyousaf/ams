const SkeletonCarCard = () => {
  return (
    <div className="animate-pulse rounded-lg bg-rose-800 p-4 shadow-md space-y-4">
      <div className="h-40 bg-rose-700 rounded-lg" />
      <div className="h-5 bg-rose-700 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-rose-700 rounded w-1/2 mx-auto" />
    </div>
  );
};

export default SkeletonCarCard;
