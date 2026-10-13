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
})();
