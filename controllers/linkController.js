const createConnection = require("../config/db");

// Get all links for a project
exports.getLinks = async (req, res) => {
  const { projectId } = req.params;

  const query = `
    SELECT l.id, l.source, l.target, l.type 
    FROM task_links AS l
    JOIN tasks AS t ON l.source = t.id OR l.target = t.id
    WHERE t.project_id = ?
  `;

  try {
    const connection = await createConnection();
    const [links] = await connection.query(query, [projectId]);
    res.status(200).json(links);
  } catch (err) {
    console.error("Failed to fetch links:", err);
    res.status(500).json({ error: "Failed to fetch links" });
  }
};

// Create a new link
exports.createLink = async (req, res) => {
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

  try {
    const connection = await createConnection();
    const [result] = await connection.query(query, [source, target, type]);
    res.status(201).json({ id: result.insertId, type });
  } catch (err) {
    console.error("Failed to create link:", err);
    res.status(500).json({ error: "Failed to create link" });
  }
};

// Delete a link by ID
exports.deleteLink = async (req, res) => {
  const { linkId } = req.params;

  const query = "DELETE FROM task_links WHERE id = ?";

  try {
    const connection = await createConnection();
    const [result] = await connection.query(query, [linkId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.status(200).json({ message: `Link with id ${linkId} deleted.` });
  } catch (err) {
    console.error("Failed to delete link:", err);
    res.status(500).json({ error: "Failed to delete link" });
  }
};