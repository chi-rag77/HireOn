(() => {
  const I = name => `<i data-lucide="${name}"></i>`;
  const avatar = '<img class="avatar" src="assets/interview-candidate.png" alt="Illustrative candidate Priya">';
  const waveform = `<div class="waveform" aria-hidden="true">${[10,20,32,17,26,13,30,23,12,28,16].map((h,i)=>`<i style="--h:${h}px;--delay:${i*.11}s"></i>`).join('')}</div>`;
  const header = (step,title) => `<span class="scene-kicker">${step}</span><h3>${title}</h3>`;
  const badge = (name,text,cls='') => `<span class="motion-badge ${cls}">${I(name)}${text}</span>`;
  const status = (labels) => `<div class="motion-status">${I('sparkles')}<span data-status-label data-labels='${JSON.stringify(labels)}'>${labels[0]}</span><span class="motion-ticks" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>`;
  const scenes = [
    `${header('01 / CREATE WITH AI','A little input. A head start.')}<div class="motion-stage draft-motion"><div class="prompt-card"><span class="mini-label">YOUR HIRING BRIEF</span><p class="typing-line">We need a senior product designer<br>to lead our B2B product.</p><span class="typing-caret" aria-hidden="true"></span></div><div class="flow-path">${I('sparkles')}<span></span></div><div class="generated-role enter-1"><div class="generated-top">${I('briefcase-business')}<span>AI-DRAFTED ROLE</span>${I('check')}</div><h4>Senior Product Designer</h4><p>Lead discovery. Turn research into product decisions. Build a consistent design system.</p><div class="skill-tags"><span class="enter-2">User research</span><span class="enter-2">Product strategy</span><span class="enter-3">Design systems</span></div></div><div class="completion-tag enter-3">${I('check-check')} Ready for your review</div></div>${status(['Understanding your brief','Drafting the job description','Adding skills & criteria','Your role, ready to refine'])}`,
    `${header('02 / ROUNDS, CRITERIA & DEADLINE','One process. Set upfront.')}<div class="motion-stage rounds-motion"><div class="round-track"><div class="motion-round enter-0"><span class="round-symbol">${I('audio-lines')}</span><div><b>AI interview</b><small>Product judgment & experience</small></div><span class="type-chip">01</span></div><div class="round-connector enter-1"><span></span><small>Candidate continues independently</small></div><div class="motion-round enter-1"><span class="round-symbol">${I('list-checks')}</span><div><b>Skills assessment</b><small>Problem solving & role knowledge</small></div><span class="type-chip">02</span></div><div class="round-connector enter-2"><span></span><small>Candidate continues independently</small></div><div class="motion-round enter-2"><span class="round-symbol">${I('file-pen-line')}</span><div><b>Assignment</b><small>Practical thinking & quality of work</small></div><span class="type-chip">03</span></div></div><div class="config-choice enter-3">${I('timer')} Complete all rounds within 3 days.<br>Example deadline · Set by your team</div></div>${status(['Define the interview criteria','Add the skills assessment','Add the work sample','Set the completion window'])}`,
    `${header('03 / SOURCE & SCREEN','Every résumé gets a look.')}<div class="motion-stage screening-motion"><div class="source-orbit"><span class="source-pill">Naukri</span><span class="source-pill">LinkedIn</span><span class="source-pill">${I('file-spreadsheet')} CSV</span></div><div class="resume-stream" aria-hidden="true">${[0,1,2].map(i=>`<div class="resume-slip" style="--n:${i}">${I('file-user')}<i></i><i></i></div>`).join('')}<div class="scan-beam"></div><span class="scan-label">${I('scan-text')} Reviewing role fit</span></div><div class="motion-candidates"><div class="screen-person enter-1">${avatar}<div><b>Priya Sharma</b><small>B2B discovery · 6 years</small></div><span class="match-score">${I('check')} Match</span></div><div class="screen-person enter-2"><span class="avatar">AM</span><div><b>Arjun Mehta</b><small>Product strategy · 7 years</small></div><span class="match-score">${I('check')} Match</span></div><div class="screen-person enter-3"><span class="avatar">NK</span><div><b>Neha Kapoor</b><small>User research · 5 years</small></div><span class="match-score muted-score">Review fit</span></div></div></div>${status(['Candidates arrive from your sources','Reviewing experience & skills','Matching against your criteria','Review the matches. Choose whom to invite.'])}`,
    `${header('04 / INVITE SELECTED CANDIDATES','All rounds. One deadline.')}<div class="motion-stage outreach-motion"><div class="motion-channel-labels"><span data-channel-number="0">Invitation</span><span data-channel-number="1">Reminder</span><span data-channel-number="2">Link expiry</span></div><div class="channel-film"><div class="film-frame film-email"><div class="mail-icon">${I('send')}</div><span class="mini-label">TO: PRIYA SHARMA · SELECTED CANDIDATE</span><h4>Your interview process is ready.</h4><p>Complete your AI interview, assessment, and assignment whenever suits you before the deadline.</p><div class="calendar-notice">${I('timer')} Completion window <span>3 days</span></div></div><div class="film-frame film-whatsapp"><div class="chat-title">${I('message-circle')} HireOn <span>WhatsApp</span></div><div class="chat-bubble">Hi Priya, a reminder to complete your three rounds before your interview links expire.</div><div class="chat-bubble reply">Thanks! I’ll finish them today. ${I('check-check')}</div><div class="chat-note">${I('clock')} Deadline included in every reminder</div></div><div class="film-frame film-expiry"><div class="expiry-icon">${I('link-2-off')}</div><span class="mini-label">WHEN THE WINDOW CLOSES</span><h4>The interview links expire.</h4><p>Candidates complete and submit all rounds before the deadline set by your team.</p><div class="expiry-label">${I('lock-keyhole')} Submissions closed after expiry</div></div></div></div>${status(['Send the complete interview process','Every round has the same deadline','Follow up automatically','The links expire at the deadline'])}`,
    `${header('05 / CANDIDATE-LED COMPLETION','Three rounds. On their time.')}<div class="motion-stage completion-motion"><div class="score-heading">${avatar}<div><strong>Priya Sharma</strong><small>Candidate interview portal</small></div><span class="deadline-pill">${I('timer')} 3-day window</span></div><div class="candidate-rounds">${[['audio-lines','AI interview'],['list-checks','Skills assessment'],['file-pen-line','Assignment']].map(([ico,title],i)=>`<div class="candidate-round candidate-round-${i}"><span class="round-symbol">${I(ico)}</span><div><b>${title}</b><small class="round-pending">Ready when you are</small><small class="round-submitted">Submitted</small></div><span class="round-done-icon">${I('check')}</span></div>`).join('')}</div><div class="submission-summary enter-3">${I('check-check')}<div><b>All 3 rounds submitted</b><small>Hiring score calculated automatically</small></div></div><div class="no-handoff">${I('workflow')} No scheduling or approval between rounds</div></div>${status(['The full process is ready','AI interview submitted','Assessment submitted','Assignment submitted. Score calculated.'])}`,
    `${header('06 / RANKED WITH REASONS','Your strongest three, explained.')}<div class="motion-stage ranking-motion"><div class="ranking-method">${I('list-filter')} Completed rounds + your evaluation criteria</div><div class="ranked-person enter-1"><span class="rank-number">01</span>${avatar}<div><b>Priya Sharma</b><small>Strongest product judgment</small><p>Clear research decisions + a practical assignment.</p></div><strong class="rank-score" data-count-to="89">0</strong></div><div class="ranked-person enter-2"><span class="rank-number">02</span><span class="avatar">AM</span><div><b>Arjun Mehta</b><small>Strong strategic reasoning</small><p>Structured answers + a clear problem-solving approach.</p></div><strong class="rank-score" data-count-to="86">0</strong></div><div class="ranked-person enter-2"><span class="rank-number">03</span><span class="avatar">NK</span><div><b>Neha Kapoor</b><small>Strong research depth</small><p>Detailed user insights + evidence-led recommendations.</p></div><strong class="rank-score" data-count-to="84">0</strong></div><div class="ranking-evidence enter-3">${I('file-search')} Review answers, results, and work samples</div><p class="ranking-footnote">Illustrative hiring scores / 100 · Not hiring decisions</p></div>${status(['All completed rounds evaluated','Hiring scores calculated','Top candidates ranked','See why each person stands out'])}`,
    `${header('07 / YOUR TEAM MAKES THE CALL','From shortlist to final conversation.')}<div class="motion-stage final-conversation-motion"><div class="shortlist-packet"><span class="packet-icon">${I('files')}</span><div><b>Senior Product Designer</b><small>Top 3 candidates · Scores + supporting evidence</small></div></div><div class="internal-note enter-1"><span class="avatar">HM</span><div><b>Hiring manager</b><p>Priya’s product judgment stands out. Let’s explore her approach to stakeholder trade-offs.</p></div></div><div class="internal-note enter-2"><span class="avatar">TL</span><div><b>Team lead</b><p>Agreed. We can use the final one-on-one to go deeper on the assignment.</p></div></div><div class="final-human enter-3">${I('users')}<div><b>Meet the finalists. Choose your hire.</b><small>Your team owns the final decision.</small></div></div></div>${status(['The explained shortlist is ready','Discuss the evidence internally','Plan focused one-on-one conversations','Close the hire with your team'])}`
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const motionButton=document.createElement('button');
  motionButton.type='button';motionButton.className='motion-toggle';motionButton.setAttribute('aria-pressed',String(paused));
  document.querySelector('.hero-baseline').append(motionButton);
  function updateButton(){motionButton.innerHTML=I(paused?'play':'pause')+(paused?'Play motion':'Pause motion');motionButton.setAttribute('aria-pressed',String(paused));window.lucide?.createIcons();}
  updateButton();
  const films=[];
  scenes.forEach((html,i)=>{
    const host=document.querySelector(`[data-mobile-step="${i}"]`);
    host.innerHTML=`<div class="scene motion-scene" data-phase="${paused?3:0}" data-film="${i}">${html}<p class="scene-footnote">Illustrative sequence · Sample candidate data</p></div>`;
    films.push({el:host.firstElementChild,step:i,time:paused?11500:0,visible:false,phase:-1});
  });
  document.querySelectorAll('.friction-action').forEach(button=>{
    const div=document.createElement('div');div.className='friction-action motion-problem-caption';
    const item=button.closest('.friction-item');
    const captions={matches:['A match, overlooked','The right experience, surfaced'],criteria:['Different questions. Different outcomes.','One shared set of criteria.'],scores:['A number without context','The evidence behind the score'],speed:['The conversation came too late','The next step, already scheduled'],pool:['Good people, waiting to be found','Your existing talent, rediscovered']};
    const pair=captions[item.dataset.friction];div.innerHTML=`<span>${pair[0]}</span>${I('sparkles')}`;button.replaceWith(div);
    films.push({el:item,step:'problem',time:0,visible:false,phase:-1,captions:pair});
  });
  const hero=document.querySelector('.hero-product');
  films.push({el:hero,step:'hero',time:0,visible:false,phase:-1});
  function frame(f){
    const duration=f.step===3?16000:f.step===5?18000:14000;
    const phase=Math.min(3,Math.floor((f.time%duration)/(duration/4)));
    if(f.phase!==phase){
      f.phase=phase;f.el.dataset.phase=String(phase);
      if(f.step==='problem'){
        const resolved=phase>=2;f.el.classList.toggle('is-resolved',resolved);
        f.el.querySelector('.motion-problem-caption span').textContent=f.captions[resolved?1:0];
      }else if(f.step==='hero'){
        f.el.querySelectorAll('.hero-flow>div').forEach((el,i)=>el.classList.toggle('hero-current',i===phase));
      }else{
        const label=f.el.querySelector('[data-status-label]');label.textContent=JSON.parse(label.dataset.labels)[phase];
      }
    }
    if(f.step===5){
      const progress=Math.min(1,(f.time%duration)/5000);
      f.el.querySelectorAll('[data-count-to]').forEach(el=>{const n=Math.round(Number(el.dataset.countTo)*(1-Math.pow(1-progress,3)));if(el.textContent!==String(n))el.textContent=String(n);});
    }
  }
  function setPaused(value){paused=value;document.body.classList.toggle('motion-paused',paused);updateButton();if(paused){films.forEach(f=>{f.time=f.step===3?14500:f.step===5?16500:12500;f.phase=-1;frame(f);});}}
  motionButton.addEventListener('click',()=>setPaused(!paused));
  reduced.addEventListener('change',e=>setPaused(e.matches));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const f=films.find(f=>f.el===entry.target);if(!f)return;f.visible=entry.isIntersecting;
    f.el.classList.toggle('motion-running',f.visible);
    if(f.visible)frame(f);
  }),{threshold:.15});
  films.forEach(f=>{observer.observe(f.el);frame(f);});
  const chapters=document.querySelectorAll('.narrative-chapter');
  const chapterObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.15});
  chapters.forEach(el=>chapterObserver.observe(el));
  let last=performance.now();
  function tick(now){const delta=Math.min(now-last,80);last=now;if(!paused&&!document.hidden){for(const f of films){if(f.visible){f.time+=delta;frame(f);}}}requestAnimationFrame(tick);}
  requestAnimationFrame(tick);setPaused(paused);window.lucide?.createIcons();
})();
