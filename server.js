import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const CONSUMER_KEY = process.env.SAF_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.SAF_CONSUMER_SECRET;
const PASSKEY = process.env.SAF_PASSKEY;
const SHORTCODE = process.env.SAF_SHORTCODE || '1815773';
const CALLBACK_URL = process.env.SAF_CALLBACK_URL || 'https://mydomain.com/api/callback';

// Audit log memory store
const auditLogs = [];

// Global process error handlers to prevent silent exits
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

async function getAccessToken(req, res, next) {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    req.accessToken = response.data.access_token;
    next();
  } catch (error) {
    console.error('Safaricom Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with Safaricom' });
  }
}

// 1. STK PUSH ENDPOINT
app.post('/api/stk-push', getAccessToken, async (req, res) => {
  try {
    const { phone, amount, table } = req.body;
    const accessToken = req.accessToken;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerBuyGoodsOnline',
      Amount: Math.round(Number(amount)),
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: table || 'RapidLoungeVoi',
      TransactionDesc: 'Lounge Order',
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    auditLogs.push({
      event: 'STK_DISPATCH',
      phone,
      amount,
      checkoutRequestId: response.data.CheckoutRequestID,
      timestamp: new Date().toISOString(),
    });

    console.log(`✅ STK Push Dispatched to ${phone} for KES ${amount} (Till ${SHORTCODE})`);
    res.json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate STK Push', details: error.response?.data });
  }
});

// 2. STK QUERY ENDPOINT
app.post('/api/stk-query', getAccessToken, async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    const accessToken = req.accessToken;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('STK Query Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to query STK status' });
  }
});

// 3. AUDIT RECONCILIATION LOGS ENDPOINT
app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, logs: auditLogs });
});

app.listen(PORT, () => {
  console.log(`🚀 Rapid Lounge PRODUCTION server with Audit Engine on http://localhost:${PORT}`);
});