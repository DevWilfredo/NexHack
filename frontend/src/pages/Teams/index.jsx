import React from "react";
import { useParams } from "react-router";

function TeamsPage() {
  const { id } = useParams();
  return <div>TeamsPage {id}</div>;
}

export default TeamsPage;
