import React, { useState } from "react";
import ProjectTable from "./ProjectTable";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-base-200 p-4 border-r border-base-300">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <a
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => setActiveTab("projects")}
            >
              📁 Projects
            </a>
          </li>
          <li>
            <a
              className={activeTab === "tasks" ? "active" : ""}
              onClick={() => setActiveTab("tasks")}
            >
              ✅ Tasks
            </a>
          </li>
          <li>
            <a
              className={activeTab === "notes" ? "active" : ""}
              onClick={() => setActiveTab("notes")}
            >
              📝 Notes
            </a>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === "projects" && <div><ProjectTable/></div>}
        {activeTab === "tasks" && <div>Task content goes here</div>}
        {activeTab === "notes" && <div>Notes content goes here</div>}
      </div>
    </div>
  );
};

export default Sidebar;
