const RequestPendingBox = () => {
  return (
    <div
      className="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700"
      role="alert"
    >
      <p className="font-bold">Request Pending</p>
      <p>Waiting for project admin response...</p>
    </div>
  );
};

export default RequestPendingBox;
