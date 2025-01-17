import { getUsers } from "@/actions/users";
import UsersTable from "./components/UsersTable";

export default async function Home() {
  const users = (await getUsers()) || [];
  return (
    <main className="min-h-screen max-w-4xl mx-auto">
      <UsersTable users={users} />
    </main>
  );
}
