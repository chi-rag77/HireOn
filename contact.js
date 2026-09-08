module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Please complete all fields.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email))) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'saurabh.nayak@hireon.io';
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      console.error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL environment variable.');
      return res.status(500).json({ ok: false, error: 'Email service is not configured.' });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanEmail = String(email).trim().slice(0, 320);
    const cleanMessage = String(message).trim().slice(0, 5000);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: cleanEmail,
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
    });

    const result = await emailResponse.json().catch(() => ({}));

    if (!emailResponse.ok) {
      console.error('Resend error:', result);
      return res.status(502).json({ ok: false, error: 'Unable to send enquiry.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ ok: false, error: 'Something went wrong.' });
  }
};
