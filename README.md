# HireOn landing page

A responsive, tangerine-and-white landing page that explains the HireOn hiring journey: define a role and evaluation criteria, configure the rounds and deadline, screen applications, invite candidates, and review an evidence-backed shortlist before the final human decision.

## Preview

Open `index.html` or serve this directory with a static web server. The illustrative graphics animate automatically while visible. Visitors can pause the motion, and reduced-motion preferences show completed still states. All candidate names, scores, and hiring scenarios shown are illustrative.

## Files

- `index.html` — page content and structure.
- `assets/site.css`, `refinements.css`, `journey.css`, `teak-direction.css`, `motion.css`, and `tangerine.css` — responsive design and motion.
- `assets/site.js` and `journey.js` — navigation, contact form, and motion sequences.
- `api/contact.js` — existing contact endpoint; production sending requires its hosting runtime and environment configuration.

The contact form is disabled in local previews so test submissions are not sent. Production form behavior uses the existing `/api/contact` endpoint.
