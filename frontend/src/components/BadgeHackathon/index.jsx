function BadgeHackathonComponent({ hackathon }) {
  const openToApplications = "";
  const closedToApplications = "";
  const finalized = "";
  return (
    <label className="rounded-full bg-primary mx-4 my-4 text-2xl font-semibold ">
      {hackathon.status}
    </label>
  );
}

export default BadgeHackathonComponent;
