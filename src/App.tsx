import { useEffect, useState } from 'react'
import './App.css'

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  }
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}

async function getUsers(): Promise<User[]> {
  const URL = "https://jsonplaceholder.typicode.com/users"
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`fetch ${URL} failed with status: ${response.status}`);
  }

  return response.json();
}

type FetchState = "loading" | "success" | "error" | "nodata";

function App() {
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await getUsers();
        if (fetchedUsers.length === 0) {
          setFetchState("nodata");
          return;
        }
        setUsers(fetchedUsers);
        setFetchState("success");
      } catch (error) {
        console.log(error);
        setFetchState("error");
      }
    }

    loadUsers();
  }, [])

  switch (fetchState) {
    case "loading":
      return <div>Loading...</div>
    case "error":
      return <div>An error has occurred!</div>
    case "nodata":
      return <div>The backend has not returned any data.</div>
    case "success":
      return (
        <table className="border-separate border-spacing-x-8">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>{user.phone || "N/A"}</td>
            </tr>
          ))}
        </table>
      )
  }
}

export default App
