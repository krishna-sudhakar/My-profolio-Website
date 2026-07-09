document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CUSTOM CURSOR WITH LAG AND HOVER GLOW
  // ==========================================
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorOutline = document.getElementById('custom-cursor-outline');
  
  let mouseX = 0, mouseY = 0; // Actual mouse coordinates
  let outlineX = 0, outlineY = 0; // Eased cursor coordinates
  
  // Hide custom cursor on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update dot position immediately
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });
    
    // Easing loop for the outline
    const animateCursor = () => {
      const ease = 0.15; // Smoothness factor
      outlineX += (mouseX - outlineX) * ease;
      outlineY += (mouseY - outlineY) * ease;
      
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Trigger cursor glow states when hovering links and clickable elements
    const hoverables = document.querySelectorAll('a, button, .btn, .chip, .project-card, .suggestion-chip, input, textarea, #robot-toggle');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-active');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-active');
      });
    });
  } else {
    // Hide cursor elements completely on touch screens
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  }

  // ==========================================
  // 2. CANVAS STARS BACKGROUND WITH DUST PARTICLES
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let w, h;
    
    const setCanvasSize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.speedY = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around boundaries
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
        
        // Mouse avoidance/repulsion
        if (!isTouchDevice) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const force = (120 - distance) / 120;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x -= directionX * force * 1.5;
            this.y -= directionY * force * 1.5;
          }
        }
      }
      
      draw() {
        ctx.fillStyle = `rgba(127, 231, 196, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const initParticles = () => {
      particlesArray = [];
      const count = Math.min(Math.floor((w * h) / 18000), 80);
      for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);
    
    const animateParticles = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ==========================================
  // 3. MOUSE SPOTLIGHT / CARD GLOW EFFECT
  // ==========================================
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardGlow = card.querySelector('.card-glow');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (cardGlow) {
        cardGlow.style.left = `${x}px`;
        cardGlow.style.top = `${y}px`;
      }
    });
  });

  // ==========================================
  // 4. TYPING EFFECT FOR HERO PROFESSION
  // ==========================================
  const typingEl = document.getElementById('profession-typing');
  if (typingEl) {
    const professions = [
      "AI & Software Engineer",
      "Full-Stack Developer",
      "Creative Problem Solver",
      "ML Research Enthusiast"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 80;
    
    const handleTyping = () => {
      const currentWord = professions[wordIndex];
      
      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 40;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
      }
      
      // Word is fully typed
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeDelay = 2000; // Pause at end of word
      } 
      // Word is deleted
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % professions.length;
        typeDelay = 500; // Pause before typing next word
      }
      
      setTimeout(handleTyping, typeDelay);
    };
    
    // Start typing animation
    setTimeout(handleTyping, 1200);
  }

  // ==========================================
  // 5. 3D TILT EFFECT ON CARDS AND PROFILE PHOTO
  // ==========================================
  const tiltElements = document.querySelectorAll('.tilt-card, #profile-card');
  
  if (!isTouchDevice) {
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Mouse coordinate relative to center of card (-1 to 1 range)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const tiltX = (y * 15).toFixed(2); // Max tilt degrees
        const tiltY = (-x * 15).toFixed(2);
        
        el.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'transform 0.1s ease-out';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.5s ease';
      });
    });
  }

  // ==========================================
  // 6. MAGNETIC BUTTONS EFFECT
  // ==========================================
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  
  if (!isTouchDevice) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        // Calculate offset from center
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        
        // Translate button (pull towards cursor)
        btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
        btn.style.transition = 'transform 0.1s ease-out';
      });
      
      btn.addEventListener('mouseleave', () => {
        // Snap back
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
      });
    });
  }

  // ==========================================
  // 7. SCROLL PROGRESS TRACKER
  // ==========================================
  const progressLine = document.getElementById('scroll-progress');
  const timelineLine = document.getElementById('timeline-line');
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;
    
    // Page progress bar
    if (windowHeight > 0) {
      const scrollPercent = (scrollPos / windowHeight) * 100;
      if (progressLine) progressLine.style.width = `${scrollPercent}%`;
    }
    
    // Timeline connector fill line
    if (timelineLine) {
      const timelineSection = document.getElementById('education');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        // Check if section is visible in view
        const sectionScroll = window.innerHeight - rect.top;
        if (sectionScroll > 0 && rect.top < window.innerHeight) {
          const fillRatio = Math.min(Math.max(sectionScroll / (sectionHeight + 100), 0), 1);
          timelineLine.style.setProperty('--fill-height', `${fillRatio * 100}%`);
          // We apply the CSS value dynamically via custom property
          timelineLine.style.setProperty('height', '100%');
          // Add standard support
          const style = document.createElement('style');
          style.innerHTML = `#timeline-line::after { height: ${fillRatio * 100}%; }`;
          document.head.appendChild(style);
        }
      }
    }
  });

  // ==========================================
  // 8. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 9. SCROLL REVEALS USING INTERSECTION OBSERVER
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  
  revealEls.forEach(el => revealObserver.observe(el));

  // Animate skill progress bars when in view
  const bars = document.querySelectorAll('.bar-fill');
  const barIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          bar.style.width = bar.dataset.level + '%';
        });
        barIo.disconnect();
      }
    });
  }, { threshold: 0.25 });
  
  const skillsSection = document.querySelector('#skills');
  if (skillsSection) barIo.observe(skillsSection);

  // ==========================================
  // 10. CONTACT FORM SUBMISSION WITH RIPPLES
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const successMsg = document.getElementById('form-success');
  
  if (contactForm && successMsg) {
    // Add ripple effect on form submit button click
    const submitBtn = contactForm.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        const rippleContainer = submitBtn.querySelector('.btn-ripple-container');
        if (rippleContainer) {
          const rect = submitBtn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          rippleContainer.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        }
      });
    }
    
    // Form submit event handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate transmitting signal (network post request mockup)
      submitBtn.setAttribute('disabled', 'true');
      const origText = submitBtn.querySelector('span').textContent;
      submitBtn.querySelector('span').textContent = "Transmitting...";
      
      setTimeout(() => {
        // Success flow animation
        contactForm.classList.add('hidden');
        successMsg.classList.add('visible');
        
        // Reset form after delay
        setTimeout(() => {
          contactForm.reset();
          contactForm.classList.remove('hidden');
          successMsg.classList.remove('visible');
          submitBtn.removeAttribute('disabled');
          submitBtn.querySelector('span').textContent = origText;
        }, 5000);
        
      }, 1500);
    });
  }

  // ==========================================
  // 11. INTERACTIVE AI ROBOT HELPER WIDGET
  // ==========================================
  const robotToggle = document.getElementById('robot-toggle');
  const robotChat = document.getElementById('robot-chat');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  
  const botDatabase = {
    skills: "Krishna specializes in Python, JavaScript, and C. He is skilled in web backends (FastAPI, PHP, MySQL, PostgreSQL) and frontend interfaces (HTML/CSS, Bootstrap, React). He also works with tools like Git/GitHub, VS-Code, and Postman.",
    projects: "His top AI projects include: \n1. **NeuroSense**: Real-time stress & productivity analyzer (FastAPI, React, DeepFace, Gemini).\n2. **Emote-Tune**: Emotion-based music recommendation engine.\n3. **Gym Management System**: Web interface for trainer-member tasks.",
    contact: "You can reach Krishna via:\n✉ Email: krishnasudhakar79@gmail.com\n☎ Tel: +91 9447506917\n🔗 LinkedIn: linkedin.com/in/krishna-sudhakar\n🐙 GitHub: github.com/krishna-sudhakar",
    education: "Krishna is pursuing a BTech in Computer Science and Engineering at College of Engineering, Trikaripur (KTU), graduating in July 2026 with a CGPA of 8.7.",
    certifications: "His certifications include:\n- Introduction to Git and GitHub (Google)\n- Programming with JavaScript (Meta)\n- Basics of Python (Infosys)\n- AI for Beginners (HP Life)",
    default: "I'm encoded with resume signals for Krishna Sudhakar. Try asking me about 'skills', 'projects', 'education', or 'contact'!"
  };
  
  // Toggle Chat Box
  if (robotToggle && robotChat) {
    robotToggle.addEventListener('click', () => {
      robotChat.classList.toggle('open');
      if (robotChat.classList.contains('open')) {
        chatInput.focus();
      }
    });
  }
  
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      robotChat.classList.remove('open');
    });
  }
  
  const appendMessage = (text, sender) => {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    bubble.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    
    // Support markdown style breaklines
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    chatMessages.appendChild(bubble);
    
    // Auto Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  
  const typeBotMessage = (text) => {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', 'bot-message');
    chatMessages.appendChild(bubble);
    
    let index = 0;
    const formattedText = text.replace(/\n/g, '<br>');
    
    const typingInterval = setInterval(() => {
      if (index < formattedText.length) {
        // Handle tags properly (to prevent displaying literal <br>)
        if (formattedText.substring(index, index + 4) === '<br>') {
          bubble.innerHTML += '<br>';
          index += 4;
        } else {
          bubble.innerHTML += formattedText.charAt(index);
          index++;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        clearInterval(typingInterval);
      }
    }, 12);
  };
  
  const getBotResponse = (query) => {
    const cleanQuery = query.toLowerCase().trim();
    if (cleanQuery.includes('skill') || cleanQuery.includes('tech') || cleanQuery.includes('language') || cleanQuery.includes('code')) {
      return botDatabase.skills;
    } else if (cleanQuery.includes('project') || cleanQuery.includes('neurosense') || cleanQuery.includes('tune')) {
      return botDatabase.projects;
    } else if (cleanQuery.includes('contact') || cleanQuery.includes('email') || cleanQuery.includes('phone') || cleanQuery.includes('social')) {
      return botDatabase.contact;
    } else if (cleanQuery.includes('education') || cleanQuery.includes('college') || cleanQuery.includes('cgpa') || cleanQuery.includes('gpa')) {
      return botDatabase.education;
    } else if (cleanQuery.includes('certif') || cleanQuery.includes('credential')) {
      return botDatabase.certifications;
    } else {
      return botDatabase.default;
    }
  };
  
  const handleUserMessage = () => {
    const userText = chatInput.value.trim();
    if (!userText) return;
    
    // Add user bubble
    appendMessage(userText, 'user');
    chatInput.value = '';
    
    // Add loading/thinking indicator
    setTimeout(() => {
      const botResponse = getBotResponse(userText);
      typeBotMessage(botResponse);
    }, 600);
  };
  
  if (chatSend && chatInput) {
    chatSend.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserMessage();
    });
  }
  
  // Suggestion Chips Click Handler
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const category = chip.getAttribute('data-question');
      appendMessage(chip.textContent, 'user');
      
      setTimeout(() => {
        const botResponse = botDatabase[category] || botDatabase.default;
        typeBotMessage(botResponse);
      }, 500);
    });
  });
  
});
const starfield = document.getElementById("starfield");

const STAR_COUNT = 250;

for (let i = 0; i < STAR_COUNT; i++) {

    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top = Math.random() * window.innerHeight + "px";

    star.style.animationDuration =
        (2 + Math.random() * 4) + "s";

    star.style.animationDelay =
        Math.random() * 5 + "s";

    starfield.appendChild(star);
}

function createShootingStar(){

    const star = document.createElement("div");
    star.className = "shooting-star";

    star.style.left =
        window.innerWidth + "px";

    star.style.top =
        Math.random() * window.innerHeight * 0.6 + "px";

    starfield.appendChild(star);

    setTimeout(()=>{
        star.remove();
    },2000);
}

setInterval(createShootingStar,1500);

window.addEventListener("resize",()=>{

    document.querySelectorAll(".star").forEach(s=>{

        s.style.left=Math.random()*window.innerWidth+"px";
        s.style.top=Math.random()*window.innerHeight+"px";

    });

});
const openChatBtn = document.getElementById("open-chatbot");

if (openChatBtn) {
    openChatBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Use the existing robot click logic
        document.getElementById("robot-toggle").click();
    });
}