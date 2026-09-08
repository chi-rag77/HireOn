module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Please complete all fields.'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(String(email))) {
      return res.status(400).json({
        ok: false,
        error: 'Please enter a valid email address.'
      });
    }

    const apiKey = process.env.HOSTINGER_API_KEY;
    const toEmail =
      process.env.CONTACT_TO_EMAIL || 'saurabh.nayak@hireon.io';

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: 'Email service is not configured.'
      });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 320);
    const cleanMessage = String(message).trim().slice(0, 5000);

    // Get the mailbox associated with the API token
    const meResponse = await fetch(
      'https://api.mail.hostinger.com/api/v1/me',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json'
        }
      }
    );

    const meResult = await meResponse.json().catch(() => ({}));

    if (!meResponse.ok) {
      console.error('Hostinger /me error:', meResponse.status, meResult);

      return res.status(502).json({
        ok: false,
        error: 'Unable to authenticate with Hostinger Mail API.'
      });
    }

    console.log('Hostinger /me response:', meResult);

    // Find mailbox resource ID from the authenticated account
    const mailbox =
      meResult?.data?.mailbox ||
      meResult?.data?.mailboxes?.[0] ||
      meResult?.mailbox ||
      meResult?.mailboxes?.[0];

    const mailboxId =
      mailbox?.id ||
      mailbox?.resourceId;

    if (!mailboxId) {
      console.error('Could not find mailbox ID:', meResult);

      return res.status(502).json({
        ok: false,
        error: 'Could not identify the Hostinger mailbox.'
      });
    }

    const emailText = [
      'New contact enquiry from the HireOn website',
      '',
      `Name: ${cleanName}`,
      `Email: ${cleanEmail}`,
      '',
      'Message:',
      cleanMessage,
      '',
      `Received: ${new Date().toISOString()}`
    ].join('\n');

    // Send through the authenticated Hostinger mailbox
    const sendResponse = await fetch(
      `https://api.mail.hostinger.com/api/v1/mailboxes/${encodeURIComponent(
        mailboxId
      )}/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          to: [toEmail],
          subject: `New HireOn Contact Enquiry — ${cleanName}`,
          text: emailText
        })
      }
    );

    const sendResult = await sendResponse.json().catch(() => ({}));

    console.log(
      'Hostinger send response:',
      sendResponse.status,
      sendResult
    );

    if (!sendResponse.ok) {
      return res.status(502).json({
        ok: false,
        error: 'Hostinger email failed.',
        details: sendResult
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      ok: false,
      error: 'Something went wrong.'
    });
  }
};
