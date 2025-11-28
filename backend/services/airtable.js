import { AIRTABLE_API_BASE, AIRTABLE_META_BASE, airtableClient } from '../config/airtable.js';

export async function fetchBases(accessToken) {
  const client = airtableClient(accessToken);
  const {data} = await client.get(`${AIRTABLE_META_BASE}/bases`);
  return data.bases;
}

export async function fetchTables(accessToken, baseId) {
  const client = airtableClient(accessToken);
  const {data} = await client.get(`${AIRTABLE_META_BASE}/bases/${baseId}/tables`);
  return data.tables;
}

export async function getTableFields(accessToken, baseId) {
  const tables = await getTables(accessToken, baseId);
  return tables.map(t => ({
    tableId: t.id,
    fields: t.fields
  }));
}

export async function createRecord(accessToken, baseId, tableId, fields) {
  const client = airtableClient(accessToken);

  const {data} = await client.post(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`, {
    fields
  });

  return data;
}


