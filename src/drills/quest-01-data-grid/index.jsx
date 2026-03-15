import "./styles.css";

export const metadata = {
  title: "User Management Data Grid",
  difficulty: "E-Rank",
  topics: ["useEffect", "useMemo", "useState", "Controlled Components"],
};

// API: GET https://jsonplaceholder.typicode.com/users
// Columns: name, email, phone, company.name

// TODO: SearchBar
// Props: filterText (string), onFilterChange (fn)

// TODO: TableHeader
// Props: sortConfig ({ key, direction }), onSort (fn)
// direction values: 'asc' | 'desc' | null
// Indicator: ↑ asc | ↓ desc | ↕ null

// TODO: UserRow
// Props: user (object)

// TODO: UserTable
// - fetch on mount with useEffect
// - loading → skeleton rows
// - error → message + retry button
// - success → table
// - useMemo for filter (name + email + company.name) then sort

export default function UserTable() {
  return <div className="dg-wrap">{/* TODO */}</div>;
}
