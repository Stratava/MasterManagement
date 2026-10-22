// Master Management site: login menu, Book a demo modal, FAQ accordion and contact form.
(function () {
  var LEAD_EMAIL = 'hello@mastermanagement.africa';

  function mailto(subject, fields) {
    var body = fields.map(function (f) { return f[0] + ': ' + (f[1] || ''); }).join('\n');
    return 'mailto:' + LEAD_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function val(form, name) {
    var el = form.elements[name];
    return el ? el.value.trim() : '';
  }

  // Login menu
  var toggle = document.getElementById('login-toggle');
  var menu = document.getElementById('login-menu');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
  });

  // Book a demo modal
  var modal = document.getElementById('demo-modal');
  var demoForm = document.getElementById('demo-form');
  var demoDone = document.getElementById('demo-done');
  var lastFocus = null;

  function openDemo() {
    lastFocus = document.activeElement;
    setMenu(false);
    demoForm.hidden = false;
    demoDone.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = demoForm.querySelector('input');
    if (first) first.focus();
  }

  function closeDemo() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open-demo]').forEach(function (el) {
    el.addEventListener('click', openDemo);
  });
  modal.querySelectorAll('[data-close-demo]').forEach(function (el) {
    el.addEventListener('click', closeDemo);
  });
  modal.querySelector('[data-demo-backdrop]').addEventListener('click', function (e) {
    if (e.target === e.currentTarget) closeDemo();
  });

  demoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var company = val(demoForm, 'company');
    window.location.href = mailto('Demo request' + (company ? ': ' + company : ''), [
      ['Name', val(demoForm, 'name')],
      ['Company', company],
      ['Email', val(demoForm, 'email')],
      ['Mobile', val(demoForm, 'phone')],
      ['Schemes under management', val(demoForm, 'schemes')],
      ['Message', val(demoForm, 'msg')]
    ]);
    demoForm.hidden = true;
    demoDone.hidden = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeDemo();
    else if (!menu.hidden) { setMenu(false); toggle.focus(); }
  });

  // FAQ accordion: one open at a time
  document.querySelectorAll('[data-faq]').forEach(function (faq) {
    var items = faq.querySelectorAll('.mm-faq-item');
    items.forEach(function (item) {
      item.querySelector('.mm-faq-q').addEventListener('click', function () {
        var wasOpen = item.classList.contains('mm-faq-open');
        items.forEach(function (other) {
          other.classList.remove('mm-faq-open');
          other.querySelector('.mm-faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.mm-faq-a').hidden = true;
        });
        if (!wasOpen) {
          item.classList.add('mm-faq-open');
          item.querySelector('.mm-faq-q').setAttribute('aria-expanded', 'true');
          item.querySelector('.mm-faq-a').hidden = false;
        }
      });
    });
  });

  // Contact form
  var contact = document.getElementById('contact-form');
  contact.addEventListener('submit', function (e) {
    e.preventDefault();
    window.location.href = mailto('Website enquiry' + (val(contact, 'company') ? ': ' + val(contact, 'company') : ''), [
      ['Name', val(contact, 'name')],
      ['Company', val(contact, 'company')],
      ['Email', val(contact, 'email')],
      ['Schemes under management', val(contact, 'schemes')],
      ['Message', val(contact, 'msg')]
    ]);
  });
  // Pricing calculator: Plus is floor area x tier rate (minimum fee applies); modules are priced by unit band
  var calcEl = document.getElementById('price-calc');
  if (calcEl) {
    var TIERS = [
      { max: 4, name: 'Tier 1: Simple', rate: 0.15 },
      { max: 9, name: 'Tier 2: Moderate', rate: 0.25 },
      { max: 13, name: 'Tier 3: Complex', rate: 0.40 },
      { max: 18, name: 'Tier 4: Highly complex', rate: 0.58 }
    ];
    var MIN_FEE = 1500;
    var FOUNDERS_OFF = 0.15;
    // Findings, CSOS filings, Finance insights: up to 100, 101 to 250, 251+ units
    var MODULES = [[750, 1250, 1950], [350, 350, 450], [650, 1050, 1500]];
    var fmt = function (n) { return 'R' + Math.round(n).toLocaleString('en-US'); };
    var el = function (id) { return document.getElementById(id); };
    var lastQuote = '';

    function recalc() {
      var sqm = Math.max(0, parseFloat(el('p-sqm').value) || 0);
      var units = Math.max(0, parseInt(el('p-units').value, 10) || 0);
      var points = 0;
      calcEl.querySelectorAll('[data-factor]').forEach(function (s) { points += parseInt(s.value, 10) || 0; });
      var tier = TIERS.filter(function (t) { return points <= t.max; })[0];
      var raw = Math.round(sqm * tier.rate);
      var plus = Math.max(raw, MIN_FEE);
      var band = units <= 100 ? 0 : units <= 250 ? 1 : 2;
      var mods = 0, picked = [];
      calcEl.querySelectorAll('[data-module]').forEach(function (c) {
        if (c.checked) { mods += MODULES[c.getAttribute('data-module')][band]; picked.push(c.parentNode.textContent.trim()); }
      });
      var monthly = plus + mods;
      var year = monthly * 12;
      var off = Math.round(year * FOUNDERS_OFF);
      var upfront = year - off;

      el('r-tier').textContent = tier.name;
      el('r-points').textContent = points + ' of 18 points';
      el('r-rate').textContent = 'R' + tier.rate.toFixed(2);
      el('r-plus').textContent = fmt(plus);
      el('r-mods').textContent = fmt(mods);
      el('r-mods-row').hidden = picked.length === 0;
      el('r-monthly').textContent = fmt(monthly);
      el('r-unit').textContent = units ? 'R' + (monthly / units).toFixed(2) : 'n/a';
      el('r-year').textContent = fmt(year);
      el('r-off').textContent = '\u2212' + fmt(off);
      el('r-upfront').textContent = fmt(upfront);
      el('r-permonth').textContent = fmt(upfront / 12);

      var notes = [];
      if (raw < MIN_FEE) notes.push('The minimum fee of ' + fmt(MIN_FEE) + ' per scheme per month applies.');
      if (points >= 14) notes.push('Highly complex schemes are priced on quote. This is an indication.');
      var note = el('r-note');
      note.textContent = notes.join(' ');
      note.hidden = notes.length === 0;

      lastQuote = 'Pricing estimate: ' + sqm + ' sqm, ' + units + ' units, ' + tier.name + ' (' + points + ' points). ' +
        'Plus ' + fmt(plus) + '/month' + (picked.length ? ', with ' + picked.join(', ') + ' ' + fmt(mods) + '/month' : '') +
        ': ' + fmt(monthly) + '/month excl. VAT.';
    }

    calcEl.addEventListener('input', recalc);
    calcEl.addEventListener('change', recalc);
    el('r-quote').addEventListener('click', function () {
      var msg = document.getElementById('d-msg');
      if (msg) msg.value = lastQuote;
    });
    recalc();
  }

  // Try Manje: the demo panel slides up after a moment, and stays closed once the visitor closes it
  var manjeLauncher = document.getElementById('manje-launcher');
  var manjePanel = document.getElementById('manje-panel');
  var MANJE_KEY = 'mm-manje-closed';
  function setManje(open, remember) {
    manjePanel.hidden = !open;
    manjeLauncher.hidden = open;
    manjeLauncher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (remember) {
      try { if (open) localStorage.removeItem(MANJE_KEY); else localStorage.setItem(MANJE_KEY, '1'); } catch (err) { /* storage blocked: fine */ }
    }
  }
  manjeLauncher.addEventListener('click', function () { setManje(true, true); });
  manjePanel.querySelector('[data-manje-close]').addEventListener('click', function () {
    setManje(false, true);
    manjeLauncher.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !manjePanel.hidden) { setManje(false, true); manjeLauncher.focus(); }
  });
  var manjeClosed = false;
  try { manjeClosed = localStorage.getItem(MANJE_KEY) === '1'; } catch (err) { /* storage blocked */ }
  if (!manjeClosed) setTimeout(function () { if (manjePanel.hidden) setManje(true, false); }, 1500);
})();
