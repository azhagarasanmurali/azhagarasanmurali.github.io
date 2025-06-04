import React from 'react';

const ProjectCard = ({ title, description }) => (
  <div className="project-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default ProjectCard;
