(function () {
  'use strict';
  const section = document.querySelector('.journey');
  if (!section) return;
  const $ = selector => section.querySelector(selector);
  const $$ = selector => Array.from(section.querySelectorAll(selector));
  const tabs = $$('.journey-tabs [role="tab"]');
  const scenes = $$('.journey-scene');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = [13000, 12000, 12000, 16000, 11000];
  let active = 0;
  let elapsed = 0;
  let lastTime = null;
  let visible = false;
  let paused = reduced.matches;
  let autoAdvance = true;
  let extraRound = false;
  let csvImported = false;
  let questionIndex = 0;
  let muted = false;
  let briefPrepared = false;
  let selectedPerson = 'priya';
  let rankingAnimated = false;
  const connected = new Set(['linkedin', 'naukri', 'pool']);
  const roles = {
    designer: {
      title: 'Senior Product Designer', meta: 'Bengaluru · Hybrid · 5–8 years',
      prompt: '“We need a senior designer to lead our B2B product.”',
      description: 'Lead discovery and design for our B2B platform. Turn customer insight into thoughtful product experiences, working closely with engineering and product.',
      skills: ['User research', 'Product strategy', 'Figma', 'Design systems'], extra: 'Portfolio review'
    },
    engineer: {
      title: 'Frontend Engineer', meta: 'Bengaluru · Hybrid · 3–5 years',
      prompt: '“Find us a frontend engineer who cares about great product experiences.”',
      description: 'Build accessible, fast product experiences with React and TypeScript. Partner with design, own frontend quality, and bring a strong approach to testing.',
      skills: ['React', 'TypeScript', 'Accessibility', 'Testing'], extra: 'Technical exercise'
    },
    sales: {
      title: 'Account Executive', meta: 'Bengaluru · Hybrid · 3–6 years',
      prompt: '“We need an account executive to grow our enterprise business.”',
      description: 'Own the enterprise sales cycle from discovery to close. Understand customer needs, build lasting relationships, and partner with the team on account growth.',
      skills: ['Discovery', 'B2B sales', 'Negotiation', 'Account planning'], extra: 'Sales role-play'
    }
  };
  const people = {
    priya: { name: 'Priya Sharma', evidence: 'Led discovery and product design across four enterprise teams.', balanced: 92, research: 86, strategy: 90 },
    arjun: { name: 'Arjun Mehta', evidence: 'Owned product strategy and launch planning for three B2B products.', balanced: 87, research: 80, strategy: 96 },
    neha: { name: 'Neha Kapoor', evidence: 'Ran 40 customer interviews and translated research into an onboarding redesign.', balanced: 83, research: 97, strategy: 82 }
  };
  const questions = [
    { question: '“Tell me about a product decision you changed after user research.”', context: 'Question 04 · Product judgment', answer: '“The interviews showed the real problem was onboarding, so we changed the roadmap before building…”' },
    { question: '“What evidence helped you get leadership on board?”', context: 'Follow-up · Based on the previous answer', answer: '“We replayed the customer interviews and compared drop-off data. That made the trade-off clear to everyone…”' },
    { question: '“How did you know the new onboarding was working?”', context: 'Follow-up · Measuring outcomes', answer: '“We tracked activation and time to first value, then checked those numbers against what customers told us…”' }
  ];

  function icon(name) {
    const element = document.createElement('i');
    element.setAttribute('data-lucide', name);
    return element;
  }
  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }
  function setIcon(button, name) {
    button.replaceChildren(icon(name));
    refreshIcons();
  }
  function updatePlayback() {
    section.classList.toggle('is-paused', paused);
    const name = paused ? 'Play animation' : 'Pause animation';
    $('.journey-pause').setAttribute('aria-label', name);
    $('.journey-pause').title = name;
    setIcon($('.journey-pause'), paused ? 'play' : 'pause');
  }
  function restart() {
    elapsed = 0;
    lastTime = null;
    rankingAnimated = false;
    briefPrepared = false;
    render(0);
  }
  function show(index, manual) {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
      scenes[i].hidden = i !== active;
    });
    if (manual) autoAdvance = false;
    restart();
    const strip = $('.journey-tabs');
    const tab = tabs[active];
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tab.offsetLeft - strip.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  }

  function loadRole() {
    const role = roles[$('#journey-role').value];
    $('#role-prompt-text').textContent = role.prompt;
    $('#role-title').textContent = role.title;
    $('#role-meta').textContent = role.meta;
    $('#role-skills').replaceChildren(...role.skills.map(text => {
      const tag = document.createElement('span'); tag.textContent = text; return tag;
    }));
    const label = (extraRound ? 'Remove ' : 'Add ') + role.extra.toLowerCase() + ' round';
    $('#journey-round-toggle').title = label;
    $('#journey-round-toggle').setAttribute('aria-label', label);
    const extra = $('#role-rounds .extra-round');
    if (extra) extra.querySelector('b').textContent = role.extra;
    restart();
  }
  function renderRole(time) {
    const role = roles[$('#journey-role').value];
    const progress = reduced.matches ? 1 : Math.min(1, time / 3800);
    const text = role.description.slice(0, Math.floor(role.description.length * progress));
    if ($('#role-description').textContent !== text) $('#role-description').textContent = text;
    $('.role-art').dataset.phase = time > 5000 || reduced.matches ? 'rounds' : time > 3500 ? 'skills' : 'draft';
    $('#role-draft-status').textContent = progress < 1 ? 'AI drafting…' : 'Ready to refine';
  }

  function renderIntake(time) {
    const total = (connected.has('linkedin') ? 184 : 0) + (connected.has('naukri') ? 136 : 0) + (connected.has('pool') ? 108 : 0) + (csvImported ? 24 : 0);
    const progress = reduced.matches ? 1 : Math.min(1, time / 4400);
    $('#intake-count').textContent = Math.round(total * (1 - Math.pow(1 - progress, 3)));
    $$('.intake-feed>div').forEach((row, i) => row.classList.toggle('is-arrived', reduced.matches || time > 1500 + i * 900));
  }
  function renderSourceState() {
    $$('[data-source]').forEach(button => button.setAttribute('aria-pressed', String(connected.has(button.dataset.source))));
    $$('[data-node]').forEach(node => node.classList.toggle('is-disconnected', node.dataset.node === 'csv' ? !csvImported : !connected.has(node.dataset.node)));
    $$('[data-wire]').forEach(wire => wire.classList.toggle('is-disconnected', wire.dataset.wire === 'csv' ? !csvImported : !connected.has(wire.dataset.wire)));
    $('#csv-flow-label').textContent = csvImported ? '24 profiles imported' : 'Ready to import';
    $('#journey-csv').disabled = csvImported;
    if (csvImported) {
      $('#journey-csv').replaceChildren(icon('check-check'), document.createTextNode('24 sample profiles imported'));
      refreshIcons();
    }
  }
  function showEvidence(id) {
    selectedPerson = id;
    $('#evidence-label').textContent = 'WHY ' + people[id].name.split(' ')[0].toUpperCase() + ' MATCHES';
    $('#evidence-text').textContent = people[id].evidence;
    $$('.ranking-person').forEach(row => row.setAttribute('aria-pressed', String(row.dataset.person === id)));
  }
  function rank() {
    const priority = $('#journey-priority').value;
    const ordered = Object.keys(people).sort((a, b) => people[b][priority] - people[a][priority]);
    $$('.ranking-person').forEach(row => {
      const id = row.dataset.person;
      const index = ordered.indexOf(id);
      row.style.setProperty('--rank', index);
      row.style.setProperty('--score', people[id][priority] + '%');
      row.querySelector('strong').textContent = people[id][priority] + '%';
      row.querySelector('.person-order').textContent = '0' + (index + 1);
    });
    showEvidence(ordered[0]);
  }
  function renderRanking(time) {
    const progress = reduced.matches ? 1 : Math.min(1, time / 4800);
    $('#scan-count').textContent = Math.round(428 * progress) + ' / 428';
    $('#ranking-status').textContent = progress === 1 ? '428 profiles screened' : 'Matching role criteria';
    if (time < 600 && !reduced.matches) {
      $$('.ranking-person').forEach((row, i) => {
        row.style.setProperty('--rank', [2, 0, 1][i]);
        row.style.setProperty('--score', '0%');
      });
    } else if (!rankingAnimated) { rank(); rankingAnimated = true; }
    const id = ['priya', 'arjun', 'neha'][Math.min(2, Math.floor(time / 1500))];
    $('#scan-name').textContent = people[id].name;
    $('#scan-detail').textContent = progress === 1 ? 'Skills and experience matched. Evidence attached.' : 'Reading experience, skills, and relevant outcomes…';
  }
  function renderInterview(time) {
    const item = questions[questionIndex];
    $('#journey-question').textContent = item.question;
    $('#question-context').textContent = item.context;
    const text = item.answer.slice(0, reduced.matches ? item.answer.length : Math.max(0, Math.floor((time - 500) / 33)));
    $('#interview-answer').textContent = text;
    const seconds = 24 + Math.floor(Math.min(time, 15000) / 1000);
    $('#interview-time').textContent = '18:' + String(seconds).padStart(2, '0');
    const flagged = time > 5400 || reduced.matches;
    $('#interview-flag').classList.toggle('is-flagged', flagged);
    $('#interview-flag-label').textContent = flagged ? 'Tab switch · review' : 'Session in focus';
    $('.answer-evidence').classList.toggle('is-captured', time > 4800 || reduced.matches);
  }
  function selectedNames() {
    return $$('.shortlist-person input:checked').map(input => people[input.value].name);
  }
  function updateSelection() {
    const names = selectedNames();
    $('#shortlist-selected').textContent = names.length + ' candidate' + (names.length === 1 ? '' : 's') + ' selected';
    $('#journey-brief').disabled = names.length === 0;
    briefPrepared = false;
    $('#brief-title').textContent = 'Your next conversation, ready.';
    $('#brief-description').textContent = names.length ? 'Role fit, interview highlights, and recruiter notes.' : 'Select a candidate to prepare a shortlist.';
  }
  function renderShortlist(time) {
    $$('.shortlist-person').forEach((row, i) => row.classList.toggle('is-arrived', reduced.matches || time > i * 500));
    $('#shortlist-brief').classList.toggle('is-ready', briefPrepared || time > 2400 || reduced.matches);
  }
  function render(time) {
    section.style.setProperty('--j-progress', autoAdvance ? Math.max(.04, time / duration[active]) : 1);
    [renderRole, renderIntake, renderRanking, renderInterview, renderShortlist][active](time);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(index, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); show(next, true); tabs[next].focus();
    });
  });
  $('.journey-pause').addEventListener('click', () => { paused = !paused; autoAdvance = !paused; lastTime = null; updatePlayback(); });
  $('.journey-replay').addEventListener('click', () => { autoAdvance = false; paused = reduced.matches; updatePlayback(); restart(); });
  $('#journey-role').addEventListener('change', () => { autoAdvance = false; loadRole(); });
  $('#journey-draft').addEventListener('click', () => { autoAdvance = false; paused = reduced.matches; updatePlayback(); loadRole(); });
  $('#journey-round-toggle').addEventListener('click', () => {
    autoAdvance = false;
    extraRound = !extraRound;
    if (extraRound) {
      const row = document.createElement('li'); row.className = 'extra-round';
      const symbol = document.createElement('span'); symbol.className = 'round-icon'; symbol.append(icon('clipboard-check'));
      const copy = document.createElement('span'); const name = document.createElement('b'); name.textContent = roles[$('#journey-role').value].extra;
      const subtitle = document.createElement('small'); subtitle.textContent = 'Your team reviews the evidence'; copy.append(name, subtitle);
      const owner = document.createElement('em'); owner.className = 'human'; owner.textContent = 'Team';
      row.append(symbol, copy, owner); $('#role-rounds').insertBefore(row, $('#role-rounds').lastElementChild);
    } else $('#role-rounds .extra-round').remove();
    setIcon($('#journey-round-toggle'), extraRound ? 'minus' : 'plus');
    loadRole(); elapsed = 6000; render(elapsed);
  });
  $$('[data-source]').forEach(button => button.addEventListener('click', () => {
    autoAdvance = false;
    const source = button.dataset.source;
    if (connected.has(source)) connected.delete(source); else connected.add(source);
    renderSourceState(); restart();
  }));
  $('#journey-csv').addEventListener('click', () => { csvImported = true; autoAdvance = false; renderSourceState(); restart(); });
  $('#journey-priority').addEventListener('change', () => { autoAdvance = false; elapsed = 5000; rankingAnimated = true; rank(); render(elapsed); });
  $$('.ranking-person').forEach(row => row.addEventListener('click', () => { autoAdvance = false; showEvidence(row.dataset.person); }));
  $('#journey-next-question').addEventListener('click', () => { questionIndex = (questionIndex + 1) % questions.length; autoAdvance = false; restart(); });
  $('#interview-mic').addEventListener('click', () => {
    muted = !muted; autoAdvance = false;
    const label = muted ? 'Unmute sample audio' : 'Mute sample audio';
    $('#interview-mic').setAttribute('aria-pressed', String(muted)); $('#interview-mic').setAttribute('aria-label', label); $('#interview-mic').title = label;
    $('#interview-voice-label').textContent = muted ? 'Muted' : 'Listening';
    setIcon($('#interview-mic'), muted ? 'mic-off' : 'mic');
  });
  $('#interview-transcript-toggle').addEventListener('click', () => {
    autoAdvance = false;
    const transcript = $('#interview-transcript'); transcript.hidden = !transcript.hidden;
    const button = $('#interview-transcript-toggle'); button.setAttribute('aria-expanded', String(!transcript.hidden));
    button.title = transcript.hidden ? 'Show transcript' : 'Hide transcript'; button.setAttribute('aria-label', button.title);
  });
  $('#interview-flag').addEventListener('click', () => {
    autoAdvance = false;
    if (elapsed < 5401) elapsed = 5401;
    const detail = $('#interview-flag-detail'); detail.hidden = !detail.hidden;
    $('#interview-flag').setAttribute('aria-expanded', String(!detail.hidden)); render(elapsed);
  });
  $$('.shortlist-person input').forEach(input => input.addEventListener('change', () => { autoAdvance = false; updateSelection(); }));
  $('#journey-brief').addEventListener('click', () => {
    autoAdvance = false; briefPrepared = true;
    const names = selectedNames();
    $('#brief-title').textContent = names.length + '-candidate shortlist prepared';
    $('#brief-description').textContent = names.join(' · ');
    $('#shortlist-selected').textContent = 'Sample brief prepared for your review'; render(elapsed);
  });
  section.addEventListener('focusin', () => { autoAdvance = false; });
  reduced.addEventListener('change', () => { paused = reduced.matches; updatePlayback(); render(elapsed); });
  document.addEventListener('visibilitychange', () => { lastTime = null; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      section.classList.toggle('is-offscreen', !visible);
      lastTime = null;
    }, { threshold: .12 }).observe(section);
  } else visible = true;
  function frame(time) {
    if (visible && !paused && !document.hidden) {
      if (lastTime !== null) elapsed += Math.min(100, time - lastTime);
      if (elapsed >= duration[active] && autoAdvance) show(active + 1, false);
      render(elapsed);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  loadRole(); renderSourceState(); updateSelection(); refreshIcons(); updatePlayback(); render(0);
  requestAnimationFrame(frame);
})();
