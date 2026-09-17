(() => {
  'use strict';

  const measurementId = 'G-58Q2WPMLMN';

  function track(eventName, parameters = {}) {
    if (typeof window.gtag !== 'function') return false;

    window.gtag('event', eventName, {
      send_to: measurementId,
      page_title: document.title,
      page_location: window.location.href,
      transport_type: 'beacon',
      ...parameters
    });

    return true;
  }

  window.TrustedIntentAnalytics = { track };

  function updateCommunitySignupCopy() {
    const joinSection = document.querySelector('#join');
    if (!joinSection) return;

    const signupPanel = joinSection.querySelector('.panel');
    if (!signupPanel) return;

    const title = signupPanel.querySelector('.section-title');
    if (title) title.textContent = 'Join the Trusted Intent Community';

    const intro = signupPanel.querySelector('.section-copy');
    if (intro) {
      intro.textContent = 'Get leadership insights, free resources, book updates, and first access to new Trusted Intent content.';
    }

    const submitButton = signupPanel.querySelector('#mc-embedded-subscribe');
    if (submitButton) submitButton.textContent = 'Join the Community';

    const finePrint = signupPanel.querySelector('.fine-print');
    if (finePrint) {
      finePrint.innerHTML = 'Leadership insights, free resources, book updates, and speaking announcements. No spam. <a href="privacy.html">Privacy</a>.';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCommunitySignupCopy, { once: true });
  } else {
    updateCommunitySignupCopy();
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-analytics-event]');
    if (!link) return;

    track(link.dataset.analyticsEvent, {
      link_text: link.textContent.trim().replace(/\s+/g, ' '),
      link_url: link.href,
      cta_location: link.dataset.analyticsLocation || 'unspecified'
    });
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form[data-analytics-form="book-updates"]');
    if (!form || form.dataset.analyticsSubmitted === 'true') return;

    event.preventDefault();
    form.dataset.analyticsSubmitted = 'true';

    let resumed = false;
    const continueSubmission = () => {
      if (resumed) return;
      resumed = true;
      HTMLFormElement.prototype.submit.call(form);
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'sign_up', {
        send_to: measurementId,
        method: 'mailchimp',
        form_name: 'book_updates',
        page_title: document.title,
        page_location: window.location.href,
        transport_type: 'beacon',
        event_callback: continueSubmission,
        event_timeout: 800
      });

      window.setTimeout(continueSubmission, 900);
    } else {
      continueSubmission();
    }
  });
})();
