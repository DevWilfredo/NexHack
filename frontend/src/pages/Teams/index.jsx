import React from "react";

import TeamsComponent from "../../components/TeamComponent";
import { useParams } from "react-router";

function TeamsPage() {
  const { hackathonId, teamId } = useParams();

  return <TeamsComponent hackathonId={hackathonId} teamId={teamId} />;
}

export default TeamsPage;
