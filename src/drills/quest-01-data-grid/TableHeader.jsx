const TableHeader = ({ sortConfig, onSort }) => {
  const { key, direction } = sortConfig;

  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone No." },
    { id: "companyName", label: "Company" },
  ];
  const handleSort = (selectedId) => {
    let nextDirection = "asc";
    if (key === selectedId) {
      if (direction === "asc") nextDirection = "desc";
      else if (direction === "desc") nextDirection = null;
      else nextDirection = "asc";
    }
    onSort({ key: selectedId, direction: nextDirection });
  };
  return (
    <tr>
      {columns.map(({ id, label }) => (
        <th key={id} onClick={() => handleSort(id)}>
          {label}{" "}
          {id !== key
            ? "↕"
            : direction === "asc"
              ? "↑"
              : direction === "desc"
                ? "↓"
                : "↕"}
        </th>
      ))}
    </tr>
  );
};
export default TableHeader;
