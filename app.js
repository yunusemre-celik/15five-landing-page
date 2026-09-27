/* 15Five Landing Page Interactive Engine
   Handles demo console tabs, ROI calculator, testimonial slider,
   interactive coaching assistant, high-fives feed, and demo booking drawer.
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Sticky & Mobile Menu
  const siteNav = document.querySelector('.site-nav');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // 2. Animated Metrics Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounterAnimation = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isInteger = Number.isInteger(target);
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        stat.textContent = isInteger ? Math.round(currentVal) : currentVal.toFixed(0);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounterAnimation();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // 3. Demo Console Tabs
  const tabButtons = document.querySelectorAll('.console-tab-btn');
  const tabPanes = document.querySelectorAll('.console-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 4. Interactive 1-on-1 Elements
  // Sentiment buttons
  const sentimentBtns = document.querySelectorAll('.sentiment-btn');
  sentimentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = btn.parentElement;
      parent.querySelectorAll('.sentiment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Pulse Sentiment recorded: ${btn.textContent.trim()} 🌟`);
    });
  });

  // Checkbox toggle
  const todoItems = document.querySelectorAll('.todo-item');
  todoItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('completed');
      const checkbox = item.querySelector('.todo-checkbox');
      if (item.classList.contains('completed')) {
        checkbox.innerHTML = '✓';
        showToast('Action item marked completed! ✨');
      } else {
        checkbox.innerHTML = '';
      }
    });
  });

  // 5. High Five Creator
  const highFiveForm = document.getElementById('highFiveForm');
  const highFiveInput = document.getElementById('highFiveInput');
  const highFivesList = document.getElementById('highFivesList');

  if (highFiveForm && highFiveInput && highFivesList) {
    highFiveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = highFiveInput.value.trim();
      if (!text) return;

      const newCard = document.createElement('div');
      newCard.className = 'high-five-card';
      newCard.innerHTML = `
        <div class="high-five-icon">🙌</div>
        <div class="high-five-body">
          <div class="high-five-header">
            <strong>You</strong> gave a High Five to <strong>Alex Morgan (Engineering)</strong>
          </div>
          <p class="high-five-message">"${text}"</p>
          <div class="high-five-tags">
            <span class="high-five-tag">#team-player</span>
            <span class="high-five-tag">#excellence</span>
          </div>
        </div>
      `;

      highFivesList.prepend(newCard);
      highFiveInput.value = '';
      showToast('High Five sent to the company feed! 🎉');
    });
  }

  // 6. Action Plan Reveal
  const actionPlanBtn = document.getElementById('btnActionPlan');
  const actionPlanModal = document.getElementById('actionPlanDetails');
  if (actionPlanBtn && actionPlanModal) {
    actionPlanBtn.addEventListener('click', () => {
      if (actionPlanModal.style.display === 'block') {
        actionPlanModal.style.display = 'none';
        actionPlanBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Draft Action Plan
        `;
      } else {
        actionPlanModal.style.display = 'block';
        actionPlanBtn.innerHTML = 'Hide Action Plan';
        showToast('Generated 3 science-backed manager micro-actions! 💡');
      }
    });
  }

  // 7. Manager Coaching Scenario Switcher
  const coachChips = document.querySelectorAll('.coach-chip');
  const coachOutputTitle = document.getElementById('coachTitle');
  const coachOutputList = document.getElementById('coachList');

  const coachingScenarios = {
    burnout: {
      title: "Science-Backed Talking Points: Navigating Capacity & Overwhelm",
      points: [
        "\"I’ve noticed how hard you’ve been pushing lately. On a scale of 1–10, how sustainable does your workload feel right now?\"",
        "Review current commitments together: Identify 1 task to delegate, 1 to deprioritize, and 1 to postpone.",
        "Agree on clear asynchronous boundaries: \"No Slack responses expected after 6:00 PM.\"",
        "Schedule a follow-up pulse check in 7 days to evaluate relief."
      ]
    },
    feedback: {
      title: "Science-Backed Talking Points: Constructive Feedback without Friction",
      points: [
        "\"I want to share some observations with the goal of helping you reach that Senior Lead role.\"",
        "Use the SBI Model (Situation, Behavior, Impact): anchor on concrete data rather than assumptions.",
        "Ask for their perspective first: \"How did that client presentation feel from your seat?\"",
        "Co-create the action step: \"What support or resource would help bridge this next time?\""
      ]
    },
    growth: {
      title: "Science-Backed Talking Points: Career Development & Ambition",
      points: [
        "\"Looking ahead 12 months, what skills or project types are you most energized to master?\"",
        "Map their individual strengths (via Best-Self Review) to upcoming strategic company initiatives.",
        "Identify high-visibility stretch opportunities: shadowing cross-functional leaders or leading a tech demo.",
        "Commit to dedicated monthly 30-minute career growth syncs separate from tactical updates."
      ]
    },
    newmgr: {
      title: "Science-Backed Talking Points: First-Time Manager Onboarding",
      points: [
        "Shift focus from individual execution to multiplier effect: \"Your output is now the success of your team.\"",
        "Establish recurring 1-on-1 cadences with each direct report before setting new KPIs.",
        "Practice radical clarity: ensure every team member can articulate their top 3 quarterly objectives.",
        "Access 15Five Transform's micro-learning path on psychological safety and coaching habits."
      ]
    }
  };

  coachChips.forEach(chip => {
    chip.addEventListener('click', () => {
      coachChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const scenarioKey = chip.getAttribute('data-scenario');
      const data = coachingScenarios[scenarioKey];
      if (data && coachOutputTitle && coachOutputList) {
        coachOutputTitle.textContent = data.title;
        coachOutputList.innerHTML = data.points.map(p => `<li>${p}</li>`).join('');
      }
    });
  });

  // 8. Testimonial Carousel
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot-btn');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlideIndex = 0;
  let autoplayTimer = null;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  };

  if (dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        restartAutoplay();
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIdx = (currentSlideIndex - 1 + slides.length) % slides.length;
      showSlide(newIdx);
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIdx = (currentSlideIndex + 1) % slides.length;
      showSlide(newIdx);
      restartAutoplay();
    });
  }

  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      if (slides.length > 0) {
        const nextIdx = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIdx);
      }
    }, 7000);
  };

  const restartAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    startAutoplay();
  };

  startAutoplay();

  // 9. ROI Value Calculator
  const headcountInput = document.getElementById('calcHeadcount');
  const headcountVal = document.getElementById('headcountVal');
  const salaryInput = document.getElementById('calcSalary');
  const salaryVal = document.getElementById('salaryVal');

  const roiTurnoverSavings = document.getElementById('roiTurnoverSavings');
  const roiHoursSaved = document.getElementById('roiHoursSaved');
  const roiTotalValue = document.getElementById('roiTotalValue');

  const updateCalculations = () => {
    if (!headcountInput || !salaryInput) return;
    const headcount = parseInt(headcountInput.value, 10);
    const avgSalary = parseInt(salaryInput.value, 10);

    headcountVal.textContent = headcount.toLocaleString();
    salaryVal.textContent = `$${avgSalary.toLocaleString()}`;

    // Calculation formulas based on HR industry benchmarks:
    // Avg turnover: 15%, 15Five reduces voluntary churn by ~25%
    // Cost to replace employee = 50% of annual salary
    const turnoverReductionCount = Math.round(headcount * 0.15 * 0.25);
    const turnoverSavings = Math.round(turnoverReductionCount * (avgSalary * 0.5));

    // Reviews & 1-on-1 efficiency: ~1 manager per 7 employees
    const managers = Math.round(headcount / 7);
    const hoursSavedPerManagerYear = 42; // automated reviews + check-in templates
    const totalHoursSaved = managers * hoursSavedPerManagerYear;

    // Total 3-year estimated business value
    const estimatedValue = Math.round((turnoverSavings * 3) + (totalHoursSaved * 65 * 3));

    if (roiTurnoverSavings) {
      roiTurnoverSavings.textContent = `$${turnoverSavings.toLocaleString()}/yr`;
    }
    if (roiHoursSaved) {
      roiHoursSaved.textContent = `${totalHoursSaved.toLocaleString()} hrs/yr`;
    }
    if (roiTotalValue) {
      roiTotalValue.textContent = `$${estimatedValue.toLocaleString()}`;
    }
  };

  if (headcountInput && salaryInput) {
    headcountInput.addEventListener('input', updateCalculations);
    salaryInput.addEventListener('input', updateCalculations);
    updateCalculations();
  }

  // 10. Demo Booking Drawer & Modal
  const demoDrawer = document.getElementById('demoDrawer');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const openDemoBtns = document.querySelectorAll('.open-demo-btn');
  const closeDemoBtns = document.querySelectorAll('.close-demo-btn');
  const demoForm = document.getElementById('demoBookingForm');
  const bookingConfirmView = document.getElementById('bookingConfirmView');

  const openDrawer = () => {
    if (demoDrawer && modalBackdrop) {
      modalBackdrop.classList.add('open');
      demoDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (demoDrawer && modalBackdrop) {
      modalBackdrop.classList.remove('open');
      demoDrawer.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (bookingConfirmView && demoForm) {
          bookingConfirmView.style.display = 'none';
          demoForm.style.display = 'block';
        }
      }, 400);
    }
  };

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  closeDemoBtns.forEach(btn => {
    btn.addEventListener('click', closeDrawer);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeDrawer);
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('demoEmail').value;
      const name = document.getElementById('demoName').value;
      const size = document.getElementById('demoSize').value;

      demoForm.style.display = 'none';
      if (bookingConfirmView) {
        bookingConfirmView.style.display = 'block';
        const confirmName = document.getElementById('confirmClientName');
        if (confirmName) confirmName.textContent = name;
      }
      showToast(`Demo requested for ${email}! Our team will connect shortly. 🚀`);
    });
  }

  // 11. Toast Utility
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
});
