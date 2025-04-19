document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbarMenu');
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const body = document.body;
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section'); // Assuming all main content sections have the 'section' class and an ID
    const projectsGrid = document.querySelector('#projects .projects-grid'); // Get the projects grid container
    const loadingMessage = document.querySelector('#projects .loading-message'); // Get loading message element
    const loadMoreBtn = document.getElementById('load-more-projects-btn'); // Get load more button
    const githubUsername = 'khanyousufminhaj'; // Your GitHub username
    let isLoading = false; // To prevent multiple simultaneous requests
    const ignoredRepoNames = ['khanyousufminhaj', 'portfolio']; // Add exact repo names here
    // --- Add list of repo names to pin ---
    const pinnedRepoNames = ['Crisis-alert','youtube-llm-extension','sensor_har']; // Add exact repo names to pin

    let allProjects = []; // To store all fetched, filtered, and sorted projects
    // Adjust initial count based on pinned projects + desired extra rows
    const projectsToShowInitially = pinnedRepoNames.length; // Show pinned projects first
    const projectsIncrement = 6;      // How many more to show per click (e.g., 1 row)
    let numProjectsCurrentlyShown = 0; // Track how many are actually displayed

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

    // --- Function to display projects from the allProjects array ---
    function displayProjects(showInitial = false) {
        if (!projectsGrid) return;

        if (showInitial) {
            projectsGrid.innerHTML = ''; // Clear grid only for the initial display
            numProjectsCurrentlyShown = 0; // Reset count for initial display
        }

        // Determine the range of projects to add
        const startIndex = numProjectsCurrentlyShown;
        const endIndex = Math.min(startIndex + (showInitial ? projectsToShowInitially : projectsIncrement), allProjects.length);

        if (startIndex === 0 && allProjects.length === 0) {
             if (loadingMessage) {
                 loadingMessage.textContent = 'No public projects found.';
                 loadingMessage.classList.remove('hidden');
                 projectsGrid.appendChild(loadingMessage); // Ensure message is in the grid
             }
             loadMoreBtn.classList.add('hidden');
             return;
        }

        if (loadingMessage && !loadingMessage.classList.contains('hidden')) {
             loadingMessage.classList.add('hidden'); // Hide loading message once projects are ready
        }

        // Append only the new projects needed
        for (let i = startIndex; i < endIndex; i++) {
            const repo = allProjects[i];
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.setAttribute('data-aos', 'fade-up');
            // Delay calculation based on the overall index 'i'
            projectCard.setAttribute('data-aos-delay', `${100 * (i + 1)}`);

            const liveDemoLink = repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link live-demo-link">Live Demo</a>` : '';

            // Generate topics HTML if topics exist
            let topicsHTML = '';
            if (repo.topics && repo.topics.length > 0) {
                topicsHTML = `
                    <div class="project-topics">
                        ${repo.topics.map(topic => `<span class="topic-badge">${topic}</span>`).join('')}
                    </div>
                `;
            }

            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description provided.'}</p>
                ${topicsHTML}
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>
                    ${liveDemoLink}
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        }

        numProjectsCurrentlyShown = endIndex; // Update the count of shown projects

        // Show/hide 'Load More' button
        if (numProjectsCurrentlyShown < allProjects.length) {
            loadMoreBtn.classList.remove('hidden');
            loadMoreBtn.textContent = 'Load More';
        } else {
            loadMoreBtn.classList.add('hidden');
        }

        // Optional: Refresh AOS if animations aren't triggering correctly on load more
        // AOS.refresh();
    }

    // --- Fetch ALL GitHub Projects ---
    async function fetchAllGitHubProjects() {
        if (!projectsGrid || isLoading) return;
        isLoading = true;
        if (loadingMessage) {
            loadingMessage.textContent = 'Loading projects...';
            loadingMessage.classList.remove('hidden');
            projectsGrid.innerHTML = ''; // Clear grid
            projectsGrid.appendChild(loadingMessage);
        }
        loadMoreBtn.classList.add('hidden'); // Hide button while fetching all

        let fetchedRepos = [];
        let page = 1;
        const perPage = 100; // Fetch max allowed per page to minimize requests

        try {
            while (true) {
                const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`);
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status} on page ${page}`);
                }
                const currentBatch = await response.json();
                if (currentBatch.length === 0) {
                    break; // No more repos left
                }
                fetchedRepos = fetchedRepos.concat(currentBatch);
                if (currentBatch.length < perPage) {
                    break; // Last page fetched
                }
                page++;
            }

            // Filter out forks and ignored repos first
            const relevantRepos = fetchedRepos.filter(repo =>
                !repo.fork && !ignoredRepoNames.includes(repo.name)
            );

            // Separate pinned and other projects
            const pinnedProjects = [];
            const otherProjects = [];
            relevantRepos.forEach(repo => {
                if (pinnedRepoNames.includes(repo.name)) {
                    pinnedProjects.push(repo);
                } else {
                    otherProjects.push(repo);
                }
            });

            // Sort pinned projects based on the order in pinnedRepoNames (optional but good for consistency)
            pinnedProjects.sort((a, b) => pinnedRepoNames.indexOf(a.name) - pinnedRepoNames.indexOf(b.name));

            // Sort other projects (description first, then by update time implicitly from API)
            otherProjects.sort((a, b) => {
                const hasDescriptionA = a.description && a.description.trim() !== '';
                const hasDescriptionB = b.description && b.description.trim() !== '';
                if (hasDescriptionA && !hasDescriptionB) return -1;
                if (!hasDescriptionA && hasDescriptionB) return 1;
                return 0; // Keep API's updated_at order if description status is same
            });

            // Combine lists: pinned first, then others
            allProjects = pinnedProjects.concat(otherProjects);

            // Initial display (pass true to clear grid and show initial amount)
            displayProjects(true);

        } catch (error) {
            console.error('Failed to fetch all GitHub projects:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Could not load projects at this time.';
                loadingMessage.classList.remove('hidden');
            }
            loadMoreBtn.classList.add('hidden'); // Hide button on error
        } finally {
            isLoading = false;
        }
    }

    // --- Event Listener for Load More Button --- //
    loadMoreBtn.addEventListener('click', () => {
        if (isLoading) return;

        loadMoreBtn.textContent = 'Loading...'; // Indicate loading
        setTimeout(() => {
             displayProjects();
        }, 10);
    });

    // Initial call to fetch all projects
    fetchAllGitHubProjects();

});
