const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger request bodies for images

// Database Pool Connection Configuration
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gold_verify';

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') 
    ? false 
    : { rejectUnauthorized: false }
});

// Database Mapping Helpers (snake_case -> camelCase)
const mapPunchToFrontend = (row) => ({
  id: row.id,
  reference: row.reference,
  nom: row.nom,
  description: row.description,
  image: row.image,
  metalId: row.metal_id,
  titreId: row.titre_id || undefined,
  categorieId: row.categorie_id,
  dateVigueur: row.date_vigueur,
  actif: row.actif,
  legalRef: row.legal_ref,
  differentInfo: row.different_info || undefined,
  placeDifferent: row.place_different || undefined
});

const mapDocumentToFrontend = (row) => ({
  id: row.id,
  titre: row.titre,
  description: row.description || '',
  datePublication: row.date_publication,
  contenu: row.contenu
});

const mapUserToFrontend = (row) => ({
  id: row.id,
  nom: row.nom,
  email: row.email,
  role: row.role,
  password: row.password
});

const mapPermissionToFrontend = (row) => ({
  role: row.role,
  dashboard: row.dashboard,
  catalog: row.catalog,
  scanner: row.scanner,
  map: row.map,
  admin: row.admin,
  managePunches: row.manage_punches,
  manageDocuments: row.manage_documents,
  viewLogs: row.view_logs,
  managePermissions: row.manage_permissions
});

const mapLogToFrontend = (row) => ({
  id: row.id,
  action: row.action,
  entityType: row.entity_type,
  entityId: row.entity_id,
  entityName: row.entity_name,
  timestamp: row.timestamp,
  details: row.details,
  userEmail: row.user_email,
  userRole: row.user_role
});

// Database initialization
async function initDb() {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Tables do not exist. Running server/db.sql...');
      const sqlPath = path.join(__dirname, 'db.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await pool.query(sql);
      console.log('Database tables created and seeded successfully.');
    } else {
      console.log('Database tables already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// ----------------- ROUTES -----------------

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 1. PUNCHES ENDPOINTS
app.get('/api/punches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM punches ORDER BY id DESC');
    res.json(result.rows.map(mapPunchToFrontend));
  } catch (err) {
    console.error('Error fetching punches:', err.message);
    res.status(500).json({ error: 'Database error fetching punches' });
  }
});

app.post('/api/punches', async (req, res) => {
  try {
    const { id, reference, nom, description, image, metalId, titreId, categorieId, dateVigueur, actif, legalRef, differentInfo, placeDifferent } = req.body;
    const result = await pool.query(
      `INSERT INTO punches (id, reference, nom, description, image, metal_id, titre_id, categorie_id, date_vigueur, actif, legal_ref, different_info, place_different)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [id, reference, nom, description, image, metalId, titreId || null, categorieId, dateVigueur, actif !== undefined ? actif : true, legalRef, differentInfo || null, placeDifferent || null]
    );
    res.status(201).json(mapPunchToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error inserting punch:', err.message);
    res.status(500).json({ error: 'Database error adding punch' });
  }
});

app.put('/api/punches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reference, nom, description, image, metalId, titreId, categorieId, dateVigueur, actif, legalRef, differentInfo, placeDifferent } = req.body;
    
    const fields = [];
    const values = [];
    let idx = 1;
    
    if (reference !== undefined) { fields.push(`reference = $${idx++}`); values.push(reference); }
    if (nom !== undefined) { fields.push(`nom = $${idx++}`); values.push(nom); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (image !== undefined) { fields.push(`image = $${idx++}`); values.push(image); }
    if (metalId !== undefined) { fields.push(`metal_id = $${idx++}`); values.push(metalId); }
    if (titreId !== undefined) { fields.push(`titre_id = $${idx++}`); values.push(titreId || null); }
    if (categorieId !== undefined) { fields.push(`categorie_id = $${idx++}`); values.push(categorieId); }
    if (dateVigueur !== undefined) { fields.push(`date_vigueur = $${idx++}`); values.push(dateVigueur); }
    if (actif !== undefined) { fields.push(`actif = $${idx++}`); values.push(actif); }
    if (legalRef !== undefined) { fields.push(`legal_ref = $${idx++}`); values.push(legalRef); }
    if (differentInfo !== undefined) { fields.push(`different_info = $${idx++}`); values.push(differentInfo || null); }
    if (placeDifferent !== undefined) { fields.push(`place_different = $${idx++}`); values.push(placeDifferent || null); }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE punches SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Punch not found' });
    }
    res.json(mapPunchToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error updating punch:', err.message);
    res.status(500).json({ error: 'Database error updating punch' });
  }
});

app.delete('/api/punches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // We match the React AppContext soft delete logic:
    const result = await pool.query(
      'UPDATE punches SET actif = false WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Punch not found' });
    }
    res.json(mapPunchToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error deleting punch:', err.message);
    res.status(500).json({ error: 'Database error deleting punch' });
  }
});

// 2. DOCUMENTS ENDPOINTS
app.get('/api/documents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY id DESC');
    res.json(result.rows.map(mapDocumentToFrontend));
  } catch (err) {
    console.error('Error fetching documents:', err.message);
    res.status(500).json({ error: 'Database error fetching documents' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { id, titre, description, datePublication, contenu } = req.body;
    const result = await pool.query(
      `INSERT INTO documents (id, titre, description, date_publication, contenu)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, titre, description || null, datePublication, contenu]
    );
    res.status(201).json(mapDocumentToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error adding document:', err.message);
    res.status(500).json({ error: 'Database error adding document' });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, datePublication, contenu } = req.body;
    
    const fields = [];
    const values = [];
    let idx = 1;
    
    if (titre !== undefined) { fields.push(`titre = $${idx++}`); values.push(titre); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (datePublication !== undefined) { fields.push(`date_publication = $${idx++}`); values.push(datePublication); }
    if (contenu !== undefined) { fields.push(`contenu = $${idx++}`); values.push(contenu); }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE documents SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(mapDocumentToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error updating document:', err.message);
    res.status(500).json({ error: 'Database error updating document' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(mapDocumentToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error deleting document:', err.message);
    res.status(500).json({ error: 'Database error deleting document' });
  }
});

// 3. USER ACCOUNTS ENDPOINTS
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY nom ASC');
    res.json(result.rows.map(mapUserToFrontend));
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Database error fetching users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, nom, email, password, role } = req.body;
    const result = await pool.query(
      `INSERT INTO users (id, nom, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, nom, email, password || '', role]
    );
    res.status(201).json(mapUserToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).json({ error: 'Database error adding user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, password, role } = req.body;
    
    const fields = [];
    const values = [];
    let idx = 1;
    
    if (nom !== undefined) { fields.push(`nom = $${idx++}`); values.push(nom); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
    if (password !== undefined) { fields.push(`password = $${idx++}`); values.push(password); }
    if (role !== undefined) { fields.push(`role = $${idx++}`); values.push(role); }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(mapUserToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Database error updating user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(mapUserToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Database error deleting user' });
  }
});

// 4. PERMISSIONS ENDPOINTS
app.get('/api/permissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM permissions');
    res.json(result.rows.map(mapPermissionToFrontend));
  } catch (err) {
    console.error('Error fetching permissions:', err.message);
    res.status(500).json({ error: 'Database error fetching permissions' });
  }
});

app.put('/api/permissions/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { dashboard, catalog, scanner, map, admin, managePunches, manageDocuments, viewLogs, managePermissions } = req.body;
    
    const fields = [];
    const values = [];
    let idx = 1;
    
    if (dashboard !== undefined) { fields.push(`dashboard = $${idx++}`); values.push(dashboard); }
    if (catalog !== undefined) { fields.push(`catalog = $${idx++}`); values.push(catalog); }
    if (scanner !== undefined) { fields.push(`scanner = $${idx++}`); values.push(scanner); }
    if (map !== undefined) { fields.push(`map = $${idx++}`); values.push(map); }
    if (admin !== undefined) { fields.push(`admin = $${idx++}`); values.push(admin); }
    if (managePunches !== undefined) { fields.push(`manage_punches = $${idx++}`); values.push(managePunches); }
    if (manageDocuments !== undefined) { fields.push(`manage_documents = $${idx++}`); values.push(manageDocuments); }
    if (viewLogs !== undefined) { fields.push(`view_logs = $${idx++}`); values.push(viewLogs); }
    if (managePermissions !== undefined) { fields.push(`manage_permissions = $${idx++}`); values.push(managePermissions); }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(role.toUpperCase());
    const query = `UPDATE permissions SET ${fields.join(', ')} WHERE UPPER(role) = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role permissions not found' });
    }
    res.json(mapPermissionToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error updating permissions:', err.message);
    res.status(500).json({ error: 'Database error updating permissions' });
  }
});

// 5. ACTIVITY LOGS ENDPOINTS
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
    res.json(result.rows.map(mapLogToFrontend));
  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).json({ error: 'Database error fetching logs' });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { id, action, entityType, entityId, entityName, timestamp, details, userEmail, userRole } = req.body;
    const result = await pool.query(
      `INSERT INTO activity_logs (id, action, entity_type, entity_id, entity_name, timestamp, details, user_email, user_role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, action, entityType, entityId, entityName, timestamp, details, userEmail, userRole]
    );
    res.status(201).json(mapLogToFrontend(result.rows[0]));
  } catch (err) {
    console.error('Error inserting log:', err.message);
    res.status(500).json({ error: 'Database error inserting log' });
  }
});

app.delete('/api/logs', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE activity_logs');
    res.json({ message: 'Logs cleared successfully' });
  } catch (err) {
    console.error('Error clearing logs:', err.message);
    res.status(500).json({ error: 'Database error clearing logs' });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDb();
});
