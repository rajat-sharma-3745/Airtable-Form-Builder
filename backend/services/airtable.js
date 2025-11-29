import { AIRTABLE_API_BASE, AIRTABLE_META_BASE, airtableClient } from '../config/airtable.js';
import { withRefresh } from '../utils/retryRequest.js';

export async function fetchBases(userId) {
  return withRefresh(userId, async (accessToken) => {
    const client = airtableClient(accessToken);
    const { data } = await client.get(`${AIRTABLE_META_BASE}/bases`);
    return data.bases;
  })

}

export async function fetchTables(userId, baseId) {
  return withRefresh(userId, async (accessToken, baseId) => {
    const client = airtableClient(accessToken);
    const { data } = await client.get(`${AIRTABLE_META_BASE}/bases/${baseId}/tables`);
    return data.tables;
  }, baseId)
}

export async function fetchTableFields(userId, baseId, tableId) {
  return withRefresh(userId, async (accessToken, baseId, tableId) => {
    const client = airtableClient(accessToken);
    const { data } = await client.get(
      `${AIRTABLE_META_BASE}/bases/${baseId}/tables`
    );
    const table = data.tables.find(t => t.id === tableId);
    return table
  }, baseId, tableId)
}

export async function createRecord(userId, baseId, tableId, fields) {
  return withRefresh(userId, async (accessToken, baseId, tableId, fields) => {
    const client = airtableClient(accessToken);

    const { data } = await client.post(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`, {
      fields
    });

    return data
  }, baseId, tableId, fields)
}


