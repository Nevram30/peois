import { redirect } from "next/navigation";

const UserDashboardPage = () => {
  redirect("/user/projects");
}

export default UserDashboardPage;