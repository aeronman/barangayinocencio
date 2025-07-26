import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ParticipantsTable({
  eventName,
  eventId,
  hasActions,
  registrationType,
}) {
  const { getData } = useAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint =
          registrationType === "individual" ? `participants` : `teams`;
        await getData(endpoint, setData, setLoading, setError);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, [getData, eventId, registrationType]);

  const filteredData = eventId
    ? data.filter((item) => item.event_id === eventId)
    : data;

  const actions = (id) => [
    {
      label: "View",
      onClick: () => {
        const participant = data.find((item) => item.id === id);
        setSelectedParticipant(participant);
        setShowModal(true);
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
  ];

  const participantColumns = [
    { header: "#", cell: ({ row }) => row.index + 1 },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    },
    { header: "Email", accessorKey: "email" },
    { header: "Contact Number", accessorKey: "contact_number" },
  ];

  const teamColumns = [
    { header: "#", cell: ({ row }) => row.index + 1 },
    { header: "Team Name", accessorKey: "team_name" },
    { header: "Leader Name", accessorKey: "leader.name" },
    { header: "Leader Age", accessorKey: "leader.age" },
    { header: "Leader Contact", accessorKey: "leader.contact" },
    { header: "Leader Email", accessorKey: "leader.email" },
    {
      header: "Members Count",
      cell: ({ row }) =>
        row.original.members ? row.original.members.length : 0,
    },
  ];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const closeModal = () => {
    setShowModal(false);
    setSelectedParticipant(null);
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headerImageUrl = `${window.location.origin}/images/MembersPdfHeader.png`;
    const img = new Image();
    img.src = headerImageUrl;

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 190, 30);

      const eventTitle = `${
        registrationType === "individual" ? "Participants" : "Teams"
      } of ${eventName}`;
      const today = new Date().toLocaleDateString("en-US");

      doc.setFontSize(16);
      doc.text(eventTitle, 14, 50);
      doc.setFontSize(12);
      doc.text(`Generated on: ${today}`, 14, 58);
      doc.text(`Total: ${filteredData.length}`, 14, 65);

      // Generate table based on registrationType
      if (registrationType === "individual") {
        autoTable(doc, {
          startY: 75,
          head: [["#", "Name", "Email", "Contact Number"]],
          body: filteredData.map((participant, index) => [
            index + 1,
            `${participant.first_name} ${participant.last_name}`,
            participant.email,
            participant.contact_number,
          ]),
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
        });
      } else {
        autoTable(doc, {
          startY: 75,
          head: [
            [
              "#",
              "Team Name",
              "Leader Name",
              "Leader Age",
              "Leader Contact",
              "Leader Email",
              "Member Name",
              "Member Age",
              "Member Contact",
            ],
          ],
          body: filteredData.flatMap((team, teamIndex) => {
            const baseRow = [
              teamIndex + 1,
              team.team_name,
              team.leader?.name || "",
              team.leader?.age || "",
              team.leader?.contact || "",
              team.leader?.email || "",
            ];

            if (!team.members || team.members.length === 0) {
              return [[...baseRow, "-", "-", "-"]];
            }

            return team.members.map((member, memberIndex) => {
              if (memberIndex === 0) {
                return [...baseRow, member.name, member.age, member.contact];
              } else {
                return [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  member.name,
                  member.age,
                  member.contact,
                ];
              }
            });
            
          }),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [41, 128, 185] },
        });
      }

      doc.save(`${eventName}_${registrationType}_report.pdf`);
    };

    img.onerror = () => {
      console.error("Failed to load header image.");
      alert("Failed to load header image. Cannot generate PDF.");
    };
  };

  return (
    <>
      {showModal && selectedParticipant && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Participant Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body p-5">
                {registrationType === "individual" ? (
                  <>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedParticipant.first_name}{" "}
                      {selectedParticipant.last_name}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {selectedParticipant.email}
                    </div>
                    <div className="mb-2">
                      <strong>Contact Number:</strong>{" "}
                      {selectedParticipant.contact_number}
                    </div>
                    <div className="mb-2">
                      <strong>Registered At:</strong>{" "}
                      {formatDate(selectedParticipant.created_at)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2">
                      <strong>Team Name:</strong>
                      <div className="border rounded-3 p-2">
                        {selectedParticipant.team_name}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Leader Name:</strong>
                      <div className="border rounded-3 p-2">
                        {selectedParticipant.leader?.name}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Leader Age:</strong>
                      <div className="border rounded-3 p-2">
                        {selectedParticipant.leader?.age}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Leader Contact:</strong>
                      <div className="border rounded-3 p-2">
                        {selectedParticipant.leader?.contact}
                      </div>
                    </div>
                    <div className="mb-5">
                      <strong>Leader Email:</strong>
                      <div className="border rounded-3 p-2">
                        {selectedParticipant.leader?.email}
                      </div>
                    </div>

                    {selectedParticipant.members?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Age</th>
                              <th>Contact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedParticipant.members.map(
                              (member, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{member.name}</td>
                                  <td>{member.age}</td>
                                  <td>{member.contact}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {registrationType === "individual" ? (
        <TableComponent
          topComponent={
            <>
              <button
                className="btn btn-primary d-flex align-items-center px-4 py-2"
                onClick={handleDownloadPDF}
              >
                <i className="bi bi-download me-2"></i> Download as PDF
              </button>
            </>
          }
          title={`Participants in ${eventName} Event`}
          columns={participantColumns}
          data={filteredData}
          loading={loading}
          actions={hasActions ? actions : null}
        />
      ) : (
        <TableComponent
          topComponent={
            <>
              <button
                className="btn btn-primary d-flex align-items-center px-4 py-2"
                onClick={handleDownloadPDF}
              >
                <i className="bi bi-download me-2"></i> Download as PDF
              </button>
            </>
          }
          title={`Teams in ${eventName} Event`}
          columns={teamColumns}
          data={filteredData}
          loading={loading}
          actions={hasActions ? actions : null}
        />
      )}
    </>
  );
}

export default ParticipantsTable;
