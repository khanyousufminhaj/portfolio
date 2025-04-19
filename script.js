document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbarMenu');
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const body = document.body;
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section'); // Assuming all main content sections have the 'section' class and an ID

    // --- Navbar Toggle --- //
    navbarToggler.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        navbarToggler.classList.toggle('active'); // For animating the burger icon
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggler.classList.remove('active');
            }
        });
    });

    // --- Night Mode / Light Mode Toggle --- //
    function setMode(mode) {
        if (mode === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            toggleIcon.textContent = '🌙'; // Show moon icon in light mode
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            toggleIcon.textContent = '☀️'; // Show sun icon in dark mode
            localStorage.setItem('theme', 'dark');
        }
    }

    nightModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setMode('light');
        } else {
            setMode('dark');
        }
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    setMode(savedTheme);

    // --- Scroll to Top Button --- //
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling down 300px
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Active Nav Link Highlighting on Scroll --- //
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.5 // 50% of section is visible
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Get the ID of the current section
                const currentSectionId = entry.target.id;

                // Find the corresponding nav link and add active class
                const activeLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- (Optional) Fetch GitHub/Medium data if needed --- //
    // Placeholder for functions like fetchGitHubProjectsBySkill, fetchMediumBlogs etc.
    // You would need to implement these based on the GitHub/Medium APIs
    // e.g., fetchGitHubProjectsBySkill('javascript'); 
    // e.g., fetchMediumBlogs('your-medium-username');

    // Example placeholder function:
    // function fetchGitHubProjectsBySkill(skill) {
    //     const projectList = document.getElementById(`github-projects-${skill}`);
    //     if (projectList) {
    //         // Replace with actual API call
    //         projectList.innerHTML = '<li>Fetching projects...</li>';
    //         console.log(`Fetching projects for skill: ${skill}`);
    //     }
    // }

});
