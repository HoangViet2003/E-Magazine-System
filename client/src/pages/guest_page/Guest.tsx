import { useAuth } from "../../redux/hooks";

export default function Guest() {
  const { user } = useAuth();
  console.log(user);

  return <div>Guest</div>;
}
