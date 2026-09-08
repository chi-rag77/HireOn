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
    const fromEmail = process.env.HOSTINGER_FROM_EMAIL;
    const toEmail =
      process.env.CONTACT_TO_EMAIL || 'saurabh.nayak@hireon.io';

    if (!apiKey || !fromEmail) {
      console.error('Missing Hostinger environment variables');

      return res.status(500).json({
        ok: false,
        error: 'Email service is not configured.'
      });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 320);
    const cleanMessage = String(message).trim().slice(0, 5000);

    const emailBody = [
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

    const response = await fetch(
      'https://api.mail.hostinger.com/v1/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          subject: `New HireOn Contact Enquiry — ${cleanName}`,
          text: emailBody,
          reply_to: cleanEmail
        })
      }
    );

    const result = await response.json().catch(() => ({}));

    console.log('Hostinger response:', response.status, result);

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: 'Hostinger email failed.',
        details: result
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
