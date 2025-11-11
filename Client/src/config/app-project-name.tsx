

export const ProjectNameMenu = () => {
const projectName="dummy project name"; // Replace with actual project name retrieval logic
  const trimmedProjectName = projectName
    ? projectName.length > 15
      ? projectName.substring(0, 15) + "..."
      : projectName
    : "Untitled";

  return [
    {
      path: "/overview",
      icon: "fas fa-project-diagram",
      title: trimmedProjectName,
      fullTitle: projectName || "Untitled",
    },
  ];
};

export default ProjectNameMenu