const db = require("../config/db");

// Get all links for a project
exports.getLinks = (req, res) => {
  const { projectId } = req.params;

  const query = `
    SELECT l.id, l.source, l.target, l.type 
    FROM task_links AS l
    JOIN tasks AS t ON l.source = t.id OR l.target = t.id
    WHERE t.project_id = ?
  `;

  db.query(query, [projectId], (err, links) => {
    if (err) {
      console.error("Failed to fetch links:", err);
      return res.status(500).json({ error: "Failed to fetch links" });
    }

    res.status(200).json(links); // Kirim data langsung tanpa konversi
  });
};

// Create a new link
exports.createLink = (req, res) => {
  const { projectId } = req.params;
  const { source, target, type } = req.body;

  const validTypes = ["0", "1", "2", "3"]; // Tipe valid sesuai DHTMLX Gantt
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid link type. Allowed types: '0', '1', '2', '3'." });
  }

  if (!source || !target) {
    return res.status(400).json({ error: "Source and target are required" });
  }

  const query = `
    INSERT INTO task_links (source, target, type) 
    VALUES (?, ?, ?)
  `;

  db.query(query, [source, target, type], (err, result) => {
    if (err) {
      console.error("Failed to create link:", err);
      return res.status(500).json({ error: "Failed to create link" });
    }

    res.status(201).json({ id: result.insertId, type });
  });
};

// Delete a link by ID
exports.deleteLink = (req, res) => {
  const { linkId } = req.params;

  const query = "DELETE FROM task_links WHERE id = ?";

  db.query(query, [linkId], (err, result) => {
    if (err) {
      console.error("Failed to delete link:", err);
      return res.status(500).json({ error: "Failed to delete link" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json({ message: `Link with id ${linkId} deleted.` });
  });
};