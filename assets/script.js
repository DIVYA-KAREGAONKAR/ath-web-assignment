// assets/script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('projectForm');
  const toast = document.getElementById('toast');
  const displayWrap = document.getElementById('displayWrap');

  // UTIL: show toast
  function showToast(message, timeout = 2000) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.opacity = 1;
    setTimeout(() => { toast.textContent = ''; }, timeout);
  }

  // Validation helper
  function validate(data) {
    const errors = {};
    if (!data.name || data.name.trim().length < 2) errors.name = 'Enter a valid name.';
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email.';
    if (!data.title || data.title.trim().length < 3) errors.title = 'Enter a short project title.';
    if (!data.description || data.description.trim().length < 10) errors.description = 'Provide a brief description (min 10 chars).';
    return errors;
  }

  // Prefill form from localStorage (when clicking edit)
  function prefillForm() {
    try {
      const raw = localStorage.getItem('projectData');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      ['name','email','title','description'].forEach(k => {
        const el = document.getElementById(k);
        if (el && data[k]) el.value = data[k];
      });

      // trigger label floats by dispatching input event
      document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
    } catch (e) { /* ignore */ }
  }

  // FORM submit
  if (form) {
    // attempt prefill if data exists and user wants to edit
    prefillForm();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const data = {
        name: (document.getElementById('name') || {}).value || '',
        email: (document.getElementById('email') || {}).value || '',
        title: (document.getElementById('title') || {}).value || '',
        description: (document.getElementById('description') || {}).value || ''
      };

      // clear previous errors
      document.querySelectorAll('.error').forEach(e => e.textContent = '');

      const errors = validate(data);
      if (Object.keys(errors).length) {
        // show errors
        Object.keys(errors).forEach(k => {
          const el = document.querySelector(`.error[data-for="${k}"]`);
          if (el) el.textContent = errors[k];
        });
        showToast('Please correct the highlighted fields.');
        return;
      }

      // save
      localStorage.setItem('projectData', JSON.stringify(data));
      showToast('Saved — Redirecting...', 900);
      setTimeout(() => { window.location.href = 'display.html'; }, 700);
    });

    // clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        document.querySelectorAll('.error').forEach(e => e.textContent = '');
        showToast('Form cleared');
      });
    }

    // when user types, ensure label floats (for placeholder-shown)
    form.querySelectorAll('input, textarea').forEach(el => {
      el.placeholder = ' '; // needed so :placeholder-shown works for floating labels
      el.addEventListener('input', () => {
        // nothing else — CSS reacts to :placeholder-shown and :focus
      });
    });
  }

  // DISPLAY PAGE: render submission card
  if (displayWrap) {
    const raw = localStorage.getItem('projectData');
    if (!raw) {
      displayWrap.innerHTML = `<div class="sub-card glass"><p class="meta">No submission found. <a href="form.html">Submit a project</a></p></div>`;
    } else {
      try {
        const data = JSON.parse(raw);
        const card = document.createElement('article');
        card.className = 'sub-card';
        card.innerHTML = `
          <h3>${escapeHtml(data.title || 'Untitled Project')}</h3>
          <p class="meta">By <strong>${escapeHtml(data.name || '')}</strong> · <a href="mailto:${escapeHtml(data.email || '')}">${escapeHtml(data.email || '')}</a></p>
          <div class="desc">${nl2br(escapeHtml(data.description || ''))}</div>
        `;
        displayWrap.appendChild(card);
      } catch(e) {
        displayWrap.innerHTML = `<div class="sub-card glass"><p class="meta">Corrupted data. Please re-submit your project.</p></div>`;
      }
    }

    // edit button navigates to form (prefill occurs on load)
    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.addEventListener('click', () => { window.location.href = 'form.html'; });

    // remove button clears storage
    const removeBtn = document.getElementById('removeBtn');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      localStorage.removeItem('projectData');
      showToast('Submission cleared');
      setTimeout(() => { window.location.href = 'display.html'; }, 400);
    });
  }

  // small helpers
  function nl2br(s) { return s.replace(/\n/g, '<br>'); }
  function escapeHtml(unsafe) {
    return (unsafe+'').replace(/[&<"'>]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
