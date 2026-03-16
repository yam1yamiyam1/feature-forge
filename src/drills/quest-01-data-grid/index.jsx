import { useState, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import "./styles.css";

export const metadata = {
  title: "User Management Data Grid",
  difficulty: "E-Rank",
  topics: ["useEffect", "useMemo", "useState", "Controlled Components"],
};

// ─── SEARCHBAR ───────────────────────────────────────────
// <input className="dg-search" />

// ─── TABLEHEADER ─────────────────────────────────────────
// <th> × 4  (click to sort, append indicator ↑ ↓ ↕)
// columns: key='name' | key='email' | key='phone' | key='company'

const UserRow = ({ user }) => {
  const { name, email, phone, companyName } = user;
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>{companyName}</td>
    </tr>
  );
};

// ─── USERROW ─────────────────────────────────────────────
// <tr>
//   <td> name        </td>
//   <td> email       </td>
//   <td> phone       </td>
//   <td> company.name</td>
// </tr>

// ─── USERTABLE (root) ────────────────────────────────────
// <div className="dg-wrap">

// </div>

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilter] = useState("");
  const [sortConfig, setSort] = useState({ key: "name", direction: null });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data = await res.json();
      const flatData = data.map((user) => ({
        ...user,
        companyName: user.company.name,
      }));
      setUsers(flatData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const displayedUsers = useMemo(() => {
    let processedUsers = users;
    if (filterText) {
      const searchQuery = filterText.toLowerCase();
      processedUsers = processedUsers.filter(
        ({ name, companyName, email }) =>
          name.toLowerCase().includes(searchQuery) ||
          companyName.toLowerCase().includes(searchQuery) ||
          email.toLowerCase().includes(searchQuery),
      );
    }
    const { key, direction } = sortConfig;
    if (direction) {
      processedUsers = [...processedUsers].sort((a, b) => {
        if (direction === "asc") {
          return String(a[key]).localeCompare(String(b[key]));
        } else {
          return String(b[key]).localeCompare(String(a[key]));
        }
      });
    }
    return processedUsers;
  }, [users, filterText, sortConfig]);

  return (
    <div className="dg-wrap">
      <div className="dg-toolbar">
        <h2 className="dg-title" />
        <SearchBar value={filterText} onFilterChange={setFilter} />
      </div>
      <table className="dg-table">
        <thead>
          <TableHeader sortConfig={sortConfig} onSort={setSort} />
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="dg-skeleton">
              {[...Array(4)].map((_, k) => (
                <td key={k} />
              ))}
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4}>
                <div className="dg-error">
                  {error.message}
                  <button className="dg-retry" onClick={() => fetchUsers()}>
                    Retry
                  </button>
                </div>
              </td>
            </tr>
          ) : displayedUsers.length <= 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="dg-empty">No users found.</div>
              </td>
            </tr>
          ) : (
            displayedUsers.map((user) => <UserRow key={user.id} user={user} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
