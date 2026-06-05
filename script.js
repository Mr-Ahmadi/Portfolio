// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navToggle && navMenu) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let currentSection = '';
    const navHeight = document.getElementById('navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop &&
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Debounce function for performance
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSetActiveLink = debounce(setActiveLink, 10);
window.addEventListener('scroll', debouncedSetActiveLink);
window.addEventListener('load', setActiveLink);

// Navbar Background Change on Scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.about-card, .project-card, .timeline-item, .contact-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-content p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Ali Ahmadi Esfidi. All rights reserved.`;
}



// Accessibility: Focus Management
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('focus', function() {
        this.style.outline = '3px solid #a94442';
    });

    link.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Handle External Links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// Console Easter Egg
console.log('%c👋 Hello there!', 'font-size: 20px; color: #a94442; font-weight: bold;');
console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #2d3748;');
console.log('%cFeel free to reach out: mr-ahmadi2004@outlook.com', 'font-size: 12px; color: #718096;');

// Prevent scrolling issues on mobile when menu is open
if (navMenu && navToggle) {
    const body = document.body;
    navToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });

    // Reset overflow when resizing window
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            body.style.overflow = 'auto';
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}


// Render all page sections from portfolio data
function renderPage(data) {
  if (!data) return

  // Hero
  const tagline = document.getElementById('heroTagline')
  const bio = document.getElementById('heroBio')
  if (tagline && data.hero?.tagline) tagline.textContent = data.hero.tagline
  if (bio && data.hero?.bio) bio.textContent = data.hero.bio

  // About - Interests
  const interestsGrid = document.getElementById('interestsGrid')
  if (interestsGrid && data.about?.interests) {
    interestsGrid.innerHTML = data.about.interests.map(i =>
      `<div class="interest-tag"><i class="fas ${i.icon}"></i><span>${i.label}</span></div>`
    ).join('')
  }

  // About - Skills
  const langTags = document.getElementById('langTags')
  const techTags = document.getElementById('techTags')
  if (langTags && data.about?.skills?.languages) {
    langTags.innerHTML = data.about.skills.languages.map(l => `<span class="skill-tag">${l}</span>`).join('')
  }
  if (techTags && data.about?.skills?.technologies) {
    techTags.innerHTML = data.about.skills.technologies.map(t => `<span class="skill-tag">${t}</span>`).join('')
  }

  // CV
  const cvDesc = document.getElementById('cvDescription')
  const cvLink = document.getElementById('cvLink')
  if (cvDesc && data.about?.cvDescription) cvDesc.textContent = data.about.cvDescription
  if (cvLink && data.about?.cvFile) cvLink.href = data.about.cvFile

  // Experience
  function renderTimeline(containerId, items) {
    const container = document.getElementById(containerId)
    if (!container || !items) return
    container.innerHTML = items.map(item => {
      const linkHtml = item.link
        ? `<a href="${item.link}" class="publication-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> ${item.linkLabel || item.link}</a>`
        : ''
      return `<div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><div class="timeline-header"><h4>${item.title}</h4><span class="timeline-date">${item.date || ''}</span></div>${item.institution ? `<p class="timeline-institution">${item.institution}</p>` : ''}${item.detail ? `<p class="timeline-detail">${item.detail}</p>` : ''}${linkHtml}</div></div>`
    }).join('')
  }

  renderTimeline('researchTimeline', data.experience?.research)
  renderTimeline('teachingTimeline', data.experience?.teaching)
  renderTimeline('certificatesTimeline', data.experience?.certificates)
  renderTimeline('publicationsTimeline', data.experience?.publications)

  // Contact
  const contactGrid = document.getElementById('contactGrid')
  const contactHeading = document.getElementById('contactHeading')
  const contactText = document.getElementById('contactText')
  if (contactHeading && data.contact?.intro?.heading) contactHeading.textContent = data.contact.intro.heading
  if (contactText && data.contact?.intro?.text) contactText.textContent = data.contact.intro.text
  if (contactGrid && data.contact) {
    const c = data.contact
    contactGrid.innerHTML = `
      <a href="mailto:${c.email}" class="contact-card"><div class="contact-icon">📧</div><h4>Email</h4><p>${c.email.replace('@', '<br/>@')}</p></a>
      <a href="https://github.com/${c.github}" class="contact-card" target="_blank" rel="noopener noreferrer"><div class="contact-icon"><i class="fab fa-github"></i></div><h4>GitHub</h4><p>@${c.github}</p></a>
      <a href="https://linkedin.com/in/${c.linkedin}" class="contact-card" target="_blank" rel="noopener noreferrer"><div class="contact-icon"><i class="fab fa-linkedin"></i></div><h4>LinkedIn</h4><p>${c.linkedin}</p></a>
      <a href="tel:${c.phone}" class="contact-card"><div class="contact-icon">📞</div><h4>Phone</h4><p>${c.phone}</p></a>`
  }

  // Re-animate dynamically added tags
  const newTags = document.querySelectorAll('.skill-tag, .interest-tag, .project-tag')
  newTags.forEach((tag, index) => {
    tag.style.opacity = '0'
    tag.style.transform = 'scale(0.8)'
    tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    setTimeout(() => {
      tag.style.opacity = '1'
      tag.style.transform = 'scale(1)'
    }, index * 30)
  })

  // Observe newly added timeline items and contact cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
  document.querySelectorAll('.timeline-item, .contact-card').forEach(el => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(el)
  })
}

// PORTFOLIO_JSON_START
const PORTFOLIO_JSON = {
  "hero": {
    "name": "Ali Ahmadi Esfidi",
    "tagline": "AI Researcher & Web/Software Developer 🚀",
    "bio": "Final-year B.Sc. Computer Science student at Amirkabir University of Technology, with experience as an AI researcher and developer focused on deep reinforcement learning and machine learning for real-world decision-making systems. Experienced in applied projects across infrastructure monitoring, agriculture, and computational biology. Skilled in developing practical, data-driven AI solutions from modeling to deployment, with a strong background in software and web development that supports end-to-end system building. Motivated by problems where intelligent automation creates measurable real-world impact.",
    "avatar": "👨‍💻",
    "ctaPrimary": {
      "text": "Get In Touch",
      "link": "#contact"
    },
    "ctaSecondary": {
      "text": "View Projects",
      "link": "#projects"
    }
  },
  "about": {
    "personalInfo": {
      "name": "Ali Ahmadi Esfidi",
      "education": "BS in Computer Science",
      "university": "Amirkabir University of Technology",
      "period": "Sept 2022 - Jun 2026",
      "email": "mr-ahmadi2004@outlook.com",
      "phone": "+98 904 4478 539"
    },
    "interests": [
      {
        "icon": "fa-robot",
        "label": "Reinforcement Learning"
      },
      {
        "icon": "fa-brain",
        "label": "Machine Learning"
      },
      {
        "icon": "fa-dna",
        "label": "Computational Biology"
      },
      {
        "icon": "fa-network-wired",
        "label": "Deep Learning"
      },
      {
        "icon": "fa-code",
        "label": "Web Development"
      },
      {
        "icon": "fa-project-diagram",
        "label": "Algorithm Design"
      }
    ],
    "skills": {
      "languages": [
        "JavaScript",
        "TypeScript",
        "Python",
        "C/C++",
        "Java",
        "C#",
        "SQL",
        "Swift"
      ],
      "technologies": [
        "NodeJS",
        "ReactJS",
        "PyTorch",
        "BioPython",
        "Git",
        "Docker",
        "Express.js",
        "MongoDB"
      ]
    },
    "cvFile": "assets/Curriculum_Vitae.pdf",
    "cvDescription": "Get a complete overview of my experience, education, and skills."
  },
  "experience": {
    "research": [
      {
        "title": "🔬 Research Assistant  - NORC Lab",
        "date": "Mar 2025 - Present",
        "institution": "🎓 Amirkabir University of Technology",
        "detail": "👨‍🏫 Supervisor: Dr. Ghatee"
      },
      {
        "title": "🔬 Research Assistant - High Performance Networks Lab",
        "date": "Sept 2024 - Present",
        "institution": "🎓 University of Tehran",
        "detail": "👨‍🏫 Supervisor: Dr. Khonsari"
      }
    ],
    "teaching": [
      {
        "title": "📚 Teaching Assistant - Theory Of Computation",
        "date": "Sep 2024 – Present",
        "institution": "🎓 Amirkabir University of Technology",
        "detail": "👨‍🏫 Instructor: Dr. Didehvar"
      },
      {
        "title": "📚 Teaching Assistant - Quantum Information Processing",
        "date": "Sep 2025 – Jan 2026",
        "institution": "🎓 Tehran University",
        "detail": "👨‍🏫 Instructor: Dr. Khonsari"
      },
      {
        "title": "📚 Teaching Assistant - Introduction to Logic",
        "date": "Sep 2025 – Jan 2026",
        "institution": "🎓Amirkabir University of Technology",
        "detail": "👨‍🏫 Instructor: Dr. Didehvar"
      },
      {
        "title": "📚 Teaching Assistant - Artificial Intelligence & Workshop",
        "date": "Sept 2024 - Jan 2025",
        "institution": "🎓Amirkabir University of Technology",
        "detail": "👨‍🏫 Instructors: Dr. Ghatee, Dr. Yousefimehr"
      }
    ],
    "certificates": [
      {
        "title": "🧬 Bioinformatics Internship Program",
        "date": "Nov 2025",
        "institution": "🏢 Biocan",
        "detail": "👨‍🏫 Scientific Secretary: Dr. Z. Salehi • Course Director: Dr. K. Kavousi",
        "linkLabel": "View Certificate",
        "link": "https://drive.google.com/file/d/1Sq-hCLrasHlw_BRVucsxccK2731pjX_V/view"
      },
      {
        "title": "🧬 Introduction to Bioinformatics",
        "date": "Feb 2025 - Jul 2025",
        "institution": "🏢 BioCan",
        "detail": "👨‍🏫 Scientific Chair: Dr. K. Kavousi",
        "linkLabel": "View Certificate",
        "link": "https://drive.google.com/file/d/1wQgazces8McKTpEEtXOt706EJZTsZOQ0/view"
      },
      {
        "title": "📜 Scrum Foundations Course",
        "date": "Dec 2024",
        "institution": "🏢 Ultima Training Tech Co.",
        "detail": "👨‍🏫 Instructor: Josef Balahan",
        "linkLabel": "View Certificate",
        "link": "https://drive.google.com/file/d/1NJ5aD03rufClRxjFiiH41jTgAVAnIFnK/view"
      },
      {
        "title": "🧬 New Methods of Cancer Treatment",
        "date": "Feb 2025",
        "institution": "🏢 Biocan",
        "detail": "👨‍🏫 Head Of Webinar: Prof. Hamidieh",
        "linkLabel": "View Certificate",
        "link": "https://drive.google.com/file/d/1eHBc-JmUSyshqO7474QuWFH-MYajAq6b/view"
      }
    ],
    "publications": [
      {
        "title": "🌾 Irrigation Optimization in Agricultural Fields Using DRL Approaches",
        "date": "Feb 2025",
        "institution": "Parsa Heidari, Ali Ahmadi Esfidi, Ali Mehrvarz, Elaheh Khodaei, Ahmad Khonsari",
        "detail": "",
        "link": "https://doi.org/10.1109/CSICC65765.2025.10967419",
        "linkLabel": "DOI: 10.1109/CSICC65765.2025.10967419"
      }
    ]
  },
  "projects": [
    {
      "icon": "🌉",
      "title": "Halley Project: Bridge Damage Diagnosis App",
      "date": "2026",
      "description": "A project launched by the NORC Lab, focused on developing an application for diagnosing bridge damage. Worked as a ReactJS and Express.js developer and contributed to the design and implementation of computer vision models for damage detection.",
      "tags": [
        "computer-vision",
        "django",
        "postgresql",
        "reactjs"
      ],
      "github": "",
      "visible": true
    },
    {
      "icon": "📡",
      "title": "MIS SWIPT",
      "date": "2026",
      "description": "Designed a deep reinforcement learning framework to optimize beamforming for Movable Intelligent Surface (MIS)-assisted SWIPT systems. Implemented DRL agents that jointly configure phase shifts and power splitting ratios to maximize energy harvesting while maintaining information decoding quality.",
      "tags": [
        "beamforming",
        "deep-reinforcement-learning",
        "mis",
        "swipt"
      ],
      "github": "",
      "visible": true
    },
    {
      "icon": "🔀",
      "title": "SwitchPair RL",
      "date": "2026",
      "description": "Built a hybrid deep reinforcement learning and simulated annealing solver for optimal rule placement in Software-Defined Networks. Designed a custom RL environment modeling OpenFlow switch constraints to minimize rule conflicts while maximizing throughput. Achieved significant gains over greedy heuristics across multiple network topologies.",
      "tags": [
        "deep-reinforcement-learning",
        "network-optimization",
        "simulated-annealing",
        "software-defined-networking"
      ],
      "github": "",
      "visible": true
    },
    {
      "icon": "🧪",
      "title": "Gold Binding Peptides",
      "date": "2026",
      "description": "Applied machine learning — including ensemble methods and protein embeddings — to classify and predict gold-binding affinity of peptide sequences. Compared regression and classification approaches across multiple featurization strategies for bio-nanotechnology applications.",
      "tags": [
        "classification",
        "ensamble-learning",
        "peptides",
        "protein-embeddings",
        "regression"
      ],
      "github": "https://github.com/Mr-Ahmadi/Gold-Binding-Peptides",
      "visible": true
    },
    {
      "icon": "🌾",
      "title": "Irrigation Optimization",
      "date": "2026",
      "description": "Built a deep reinforcement learning system using DDPG and PPO to optimize irrigation policies under variable climate conditions. Designed a custom Gym environment integrated with crop growth simulators, achieving measurable water savings without yield loss.",
      "tags": [
        "deep-reinforcement-learning",
        "irrigation-control",
        "smart-agriculture"
      ],
      "github": "https://github.com/Mr-Ahmadi/Irrigation-Optimization",
      "visible": true
    },
    {
      "icon": "🧬",
      "title": "RNA Secondary Structure Prediction",
      "date": "2026",
      "description": "Developed a hybrid RNA secondary structure predictor combining Stochastic Context-Free Grammars with evolutionary models. Implemented the CYK algorithm for parse-tree inference, improving pseudoknot detection accuracy over traditional Nussinov-based approaches.",
      "tags": [
        "context-free-grammar",
        "cyk-algorithm",
        "evolutionary-models",
        "rna-secondary-structure"
      ],
      "github": "https://github.com/Mr-Ahmadi/RNA-Secondary-Structure-Prediction",
      "visible": true
    },
    {
      "icon": "⚡",
      "title": "RL Job Scheduler",
      "date": "2026",
      "description": "Designed a two-stage hierarchical reinforcement learning scheduler for ML training jobs on shared clusters. The high-level agent allocates resources across queues while the low-level agent optimizes per-job execution order, reducing average job completion time by over 20% in simulation.",
      "tags": [
        "deep-reinforcement-learning",
        "hierarchical-rl",
        "job-scheduling",
        "resource-optimization"
      ],
      "github": "https://github.com/Mr-Ahmadi/RL-Job-Scheduler",
      "visible": true
    },
    {
      "icon": "🎬",
      "title": "Movie Recommender",
      "date": "2026",
      "description": "Built a hybrid movie recommendation engine combining ChromaDB-based semantic search with zero-shot classification for genre-aware suggestions. Wrapped in a Gradio UI, the system retrieves similar films from embeddings and classifies user preferences on the fly.",
      "tags": [
        "chromadb",
        "recommendation-system",
        "semantic-search",
        "zero-shot-classification"
      ],
      "github": "https://github.com/Mr-Ahmadi/Movie-Recommender",
      "visible": true
    },
    {
      "icon": "💻",
      "title": "Tiny OS",
      "date": "2026",
      "description": "Built a minimal operating system from scratch targeting ARM64 with UEFI boot support. Implements interrupt handling, a simple memory allocator, and a basic ELF loader — demonstrating deep understanding of low-level systems programming.",
      "tags": [
        "arm64",
        "minimal-os",
        "oprating-system",
        "uefi"
      ],
      "github": "https://github.com/Mr-Ahmadi/Tiny-OS",
      "visible": true
    },
    {
      "icon": "📚",
      "title": "Gutenberg LM",
      "date": "2026",
      "description": "Implemented and compared three language model architectures — Word2Vec embeddings, stacked LSTMs, and Transformer encoders — trained on the Gutenberg corpus. Evaluated perplexity and downstream performance, demonstrating the progression from static to contextual representations.",
      "tags": [
        "language-model",
        "lstm",
        "transformer",
        "word2vec"
      ],
      "github": "https://github.com/Mr-Ahmadi/Gutenberg-LM",
      "visible": true
    },
    {
      "icon": "🎥",
      "title": "Code Cast",
      "date": "2026",
      "description": "Built a keystroke recorder and replay engine for code typing sessions, capturing every edit, selection, and deletion. Useful for code reviews, tutorials, and debugging demos where watching the edit history tells the full story.",
      "tags": [
        "code-editor",
        "keyboard-recorder",
        "keystroke-replay"
      ],
      "github": "https://github.com/Mr-Ahmadi/Code-Cast",
      "visible": true
    },
    {
      "icon": "⚖️",
      "title": "Comparison Between CYK And Earley Algorithms",
      "date": "2026",
      "description": "Conducted a rigorous theoretical and empirical comparison of CYK and Earley parsing algorithms across Chomsky-normal-form grammars. Analyzed time complexity, parsing ambiguity handling, and practical performance trade-offs with benchmark grammars.",
      "tags": [
        "chomsky",
        "context-free-grammar",
        "cyk-algorithm",
        "earley-algorithm"
      ],
      "github": "https://github.com/Mr-Ahmadi/Comparison-Between-CYK-and-Earley-Algorithms",
      "visible": true
    },
    {
      "icon": "🧠",
      "title": "Orthogonal Gradient Descent",
      "date": "2026",
      "description": "Implemented Orthogonal Gradient Descent (OGD) for continual learning, projecting gradients orthogonal to previously learned tasks to prevent catastrophic forgetting. Evaluated on standard continual learning benchmarks against EWC, SI, and replay-based baselines.",
      "tags": [
        "continual-learning",
        "gradiant-descent",
        "orthogonal"
      ],
      "github": "https://github.com/Mr-Ahmadi/Orthogonal-Gradient-Descent",
      "visible": true
    },
    {
      "icon": "🥊",
      "title": "Stick Combat",
      "date": "2026",
      "description": "Created a physics-based 2D fighting game with stick-figure characters using JavaScript and Canvas. Supports local multiplayer with real-time collision detection, combo mechanics, and ragdoll physics for responsive, arcade-style gameplay.",
      "tags": [
        "2d-game",
        "fighting-game",
        "js-game"
      ],
      "github": "https://github.com/Mr-Ahmadi/Stick-Combat",
      "visible": true
    },
    {
      "icon": "🔒",
      "title": "V2Ray VPN",
      "date": "2026",
      "description": "Built a cross-platform desktop V2Ray client using Electron and React with a visual proxy management dashboard. Features real-time connection status, protocol switching (VMess, Shadowsocks, SOCKS), and per-app routing rules.",
      "tags": [
        "proxy-management",
        "v2ray",
        "vpn-client"
      ],
      "github": "https://github.com/Mr-Ahmadi/V2Ray-VPN",
      "visible": true
    },
    {
      "icon": "📺",
      "title": "Beamer Presentation",
      "date": "2026",
      "description": "Created a wireless presentation system for Apple devices using Multipeer Connectivity for peer-to-peer screen mirroring. Enables remote slide control and real-time presentation streaming without external hardware or network infrastructure.",
      "tags": [
        "beamer-slides",
        "multipeer-connectivity",
        "remote-control"
      ],
      "github": "https://github.com/Mr-Ahmadi/Beamer-Presentation",
      "visible": true
    },
    {
      "icon": "🔬",
      "title": "AminoAcid Repeats",
      "date": "2026",
      "description": "Built a computational pipeline to detect and analyze amino acid repeat patterns across protein sequences. Applied statistical models to characterize repeat regions linked to structural disorders and aggregation-prone domains.",
      "tags": [
        "amino-acids",
        "repeated-elements"
      ],
      "github": "https://github.com/Mr-Ahmadi/AminoAcid-Repeats",
      "visible": true
    },
    {
      "icon": "🏷️",
      "title": "Image Labeling Studio",
      "date": "2026",
      "description": "Built a lightweight desktop image labeling tool for computer vision pipelines, supporting bounding box and polygon annotations. Exports in COCO and YOLO formats, streamlining the dataset preparation workflow for object detection models.",
      "tags": [
        "annotation-tool",
        "computer-vision",
        "image-labeling"
      ],
      "github": "https://github.com/Mr-Ahmadi/Image-Labeling-Studio",
      "visible": true
    },
    {
      "icon": "📦",
      "title": "7 Zip",
      "date": "2026",
      "description": "Developed a native macOS archive manager with a Swift-native UI supporting 7z, zip, tar, and gzip formats. Integrates with the macOS file system for drag-and-drop compression and extraction, providing a polished alternative to command-line tools.",
      "tags": [
        "7-zip",
        "archive-manager"
      ],
      "github": "https://github.com/Mr-Ahmadi/7-Zip",
      "visible": true
    },
    {
      "icon": "🎵",
      "title": "Music Player",
      "date": "2026",
      "description": "Built a native iOS music player with AVFoundation, featuring real-time analytics on listening habits, skip rates, and play counts. Implemented local audio playback with a Swift-based architecture optimized for performance and battery efficiency.",
      "tags": [
        "avfoundation",
        "local-audio",
        "music-player"
      ],
      "github": "https://github.com/Mr-Ahmadi/Music-Player",
      "visible": true
    },
    {
      "icon": "🎯",
      "title": "Random Guess",
      "date": "2026",
      "description": "Developed a fast-paced local multiplayer word-guessing party game in TypeScript, where players race against the clock to guess words from cryptic clues. Features real-time score tracking, multiple rounds, and support for custom word packs.",
      "tags": [
        "local-multiplayer-game",
        "party-game",
        "word-guessing-game"
      ],
      "github": "https://github.com/Mr-Ahmadi/Random-Guess",
      "visible": true
    },
    {
      "icon": "✅",
      "title": "SAT Solver",
      "date": "2026",
      "description": "Implemented DPLL and CDCL SAT solver algorithms from scratch in Python, with clause learning, VSIDS heuristic, and two-watched-literals optimization. Benchmarked on SATLIB instances, demonstrating the performance gap between naive backtracking and modern CDCL.",
      "tags": [
        "cdcl-algorithm",
        "dpll-algorithm",
        "sat-solver"
      ],
      "github": "https://github.com/Mr-Ahmadi/SAT-Solver",
      "visible": true
    },
    {
      "icon": "🖼️",
      "title": "Gallery Gate",
      "date": "2026",
      "description": "Developed a full-stack image gallery management app with React front-end and Express.js/MongoDB back-end. Supports batch uploads, album organization, tag-based search, and role-based access control for shared photo collections.",
      "tags": [
        "expressjs",
        "gallary-app",
        "mongodb",
        "reactjs"
      ],
      "github": "https://github.com/Mr-Ahmadi/Gallery-Gate",
      "visible": true
    },
    {
      "icon": "📝",
      "title": "Note Picker",
      "date": "2026",
      "description": "Built a full-stack video annotation app with React and Express.js, enabling timestamped note-taking synced to video playback. Notes persist in MongoDB with real-time search and filtering by timestamp, making it easy to revisit key moments in lectures or meetings.",
      "tags": [
        "expressjs",
        "mongodb",
        "reactjs"
      ],
      "github": "https://github.com/Mr-Ahmadi/Note-Picker",
      "visible": true
    },
    {
      "icon": "📅",
      "title": "My Planner",
      "date": "2026",
      "description": "Built a simple daily planner app with React and Express.js featuring task scheduling, priority tagging, and persistent storage via MongoDB. Clean, minimal UI optimized for quick entry and daily overview.",
      "tags": [
        "expressjs",
        "mongodb",
        "planner-app",
        "reactjs"
      ],
      "github": "https://github.com/Mr-Ahmadi/My-Planner",
      "visible": true
    }
  ],
  "contact": {
    "email": "mr-ahmadi2004@outlook.com",
    "github": "Mr-Ahmadi",
    "linkedin": "Ali Ahmadi Esfidi",
    "phone": "+98 904 4478 539",
    "intro": {
      "heading": "Let's Connect! 🤝",
      "text": "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out through any of the following channels:"
    }
  }
};
// PORTFOLIO_JSON_END
renderPage(PORTFOLIO_JSON)

// Project Detail Modal
;(function initProjectModal() {
    const modal = document.getElementById('projectModal')
    const body = document.getElementById('modalBody')
    const close = document.getElementById('modalClose')

    if (!modal || !body || !close) return

    function open(project) {
        body.innerHTML = `
            <div class="project-icon">${project.icon || '📁'}</div>
            <h2>${project.title}</h2>
            <p class="project-date">${project.date || ''}</p>
            <p class="full-description">${project.description || ''}</p>
            <div class="project-tags">
                ${(project.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
            ${project.github ? `<a href="${project.github}" target="_blank" class="project-link" rel="noopener noreferrer">View on GitHub <i class="fas fa-arrow-right"></i></a>` : ''}
        `
        modal.classList.add('active')
        document.body.style.overflow = 'hidden'
    }

    function closeModal() {
        modal.classList.remove('active')
        document.body.style.overflow = ''
    }

    close.addEventListener('click', closeModal)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal()
    })
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal()
    })

    // expose so grid renderer can use it
    window.__openProjectModal = open
})()

// Render Projects Grid
;(function renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid')
    if (!grid) return

    const INITIAL_COUNT = 6
    const visible = (PORTFOLIO_JSON.projects || []).filter(p => p.visible !== false)
    const total = visible.length
    let showingAll = total <= INITIAL_COUNT

    function createCard(p) {
        const card = document.createElement('div')
        card.className = 'project-card'
        card.setAttribute('role', 'button')
        card.setAttribute('tabindex', '0')
        card.innerHTML = `
            <div class="project-icon">${p.icon || '📁'}</div>
            <h3>${p.title}</h3>
            <p class="project-date">${p.date || ''}</p>
            <p class="project-description">${p.description || ''}</p>
            <div class="project-tags">
                ${(p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
            ${p.github ? `<a href="${p.github}" target="_blank" class="project-link" onclick="event.stopPropagation()">View on GitHub <i class="fas fa-arrow-right"></i></a>` : ''}
        `
        card.addEventListener('click', () => window.__openProjectModal(p))
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.__openProjectModal(p) }
        })
        return card
    }

    function render() {
        const showCount = showingAll ? total : INITIAL_COUNT
        const existing = grid.querySelectorAll('.project-card')

        // add/remove cards with animation
        visible.forEach((p, i) => {
            if (i < showCount) {
                let card = existing[i]
                if (!card) {
                    card = createCard(p)
                    card.style.opacity = '0'
                    card.style.transform = 'translateY(20px)'
                    grid.appendChild(card)
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
                        card.style.opacity = '1'
                        card.style.transform = 'translateY(0)'
                    })
                }
            }
        })

        // remove excess cards with animation
        const toRemove = Array.from(grid.children).slice(showCount)
        if (toRemove.length > 0) {
            toRemove.forEach(el => {
                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
                el.style.opacity = '0'
                el.style.transform = 'translateY(10px)'
                setTimeout(() => el.remove(), 300)
            })
        }

        // toggle button
        const existingBtn = grid.parentNode.querySelector('.projects-toggle')
        if (existingBtn) existingBtn.remove()

        if (total > INITIAL_COUNT) {
            const btn = document.createElement('button')
            btn.className = 'projects-toggle'
            btn.innerHTML = showingAll
                ? 'Show Less <i class="fas fa-chevron-up"></i>'
                : `Show All (${total}) <i class="fas fa-chevron-down"></i>`
            btn.addEventListener('click', () => {
                showingAll = !showingAll
                render()
            })
            grid.parentNode.appendChild(btn)
        }
    }

    render()
})()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

