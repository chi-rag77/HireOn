module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Please complete all fields.'
      });
    }

    // Validate email
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
      console.error('Missing HOSTINGER_API_KEY.');
      return res.status(500).json({
        ok: false,
        error: 'Email service is not configured.'
      });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 320);
    const cleanMessage = String(message).trim().slice(0, 5000);

    /*
     * Step 1:
     * Get the Hostinger mailbox/resource ID
     */
    const accountResponse = await fetch(
      'https://api.mail.hostinger.com/api/v1/accounts/current',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json'
        }
      }
    );

    const accountResult = await accountResponse
      .json()
      .catch(() => ({}));

    if (!accountResponse.ok) {
      console.error('Hostinger account error:', accountResult);

      return res.status(502).json({
        ok: false,
        error: 'Unable to connect to email service.'
      });
    }

    /*
     * Hostinger returns the mailboxes available to the API key.
     */
    const mailboxes =
      accountResult?.data?.mailboxes ||
      accountResult?.mailboxes ||
      [];

    if (!mailboxes.length) {
      console.error('No Hostinger mailboxes found:', accountResult);

      return res.status(502).json({
        ok: false,
        error: 'No Hostinger mailbox is available for this API key.'
      });
    }

    /*
     * Prefer the mailbox configured in HOSTINGER_FROM_EMAIL.
     * Otherwise use the first mailbox available.
     */
    const fromEmail = process.env.HOSTINGER_FROM_EMAIL;

    const mailbox =
      mailboxes.find(
        (mailbox) =>
          fromEmail &&
          String(mailbox.address).toLowerCase() ===
            String(fromEmail).toLowerCase()
      ) || mailboxes[0];

    const mailboxId = mailbox.resourceId;

    if (!mailboxId) {
      console.error('Missing mailbox resource ID:', mailbox);

      return res.status(502).json({
        ok: false,
        error: 'Unable to identify the Hostinger mailbox.'
      });
    }

    /*
     * Step 2:
     * Send the contact enquiry
     */
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
          text: [
            'New contact enquiry from the HireOn website',
            '',
            `Name: ${cleanName}`,
            `Email: ${cleanEmail}`,
            '',
            'Message:',
            cleanMessage,
            '',
            `Received: ${new Date().toISOString()}`
          ].join('\n')
        })
      }
    );

    const sendResult = await sendResponse
      .json()
      .catch(() => ({}));

    if (!sendResponse.ok) {
      console.error('Hostinger send error:', sendResult);

      return res.status(502).json({
        ok: false,
        error: 'Unable to send enquiry.'
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
