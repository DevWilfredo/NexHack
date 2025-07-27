import HackatonsComponent from "../../components/HackathonComponent";
import { useParams } from "react-router";

function HackathonsPage() {
  const { hackathonId } = useParams();
  
  return <HackatonsComponent hackathonId={hackathonId} />;
}

export default HackathonsPage;
