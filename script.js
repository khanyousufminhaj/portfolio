
// Toggle Night Mode
function toggleNightMode() {
  const body = document.body;
  const toggleIcon = document.getElementById('toggle-icon');
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    toggleIcon.textContent = '☀️'; // Sun icon for dark mode
  } else {
    toggleIcon.textContent = '🌙'; // Moon icon for light mode
  }
}

// Entry Animation
window.onload = function() {
  const curtain = document.querySelector('.curtain');
  setTimeout(() => {
    curtain.style.transform = 'translateY(-100%)';
  }, 1000);
};

// Scroll to Top Button
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Scroll to Top Button Visibility
window.addEventListener('scroll', function() {
  var scrollButton = document.getElementById('scroll-to-top');
  if (window.pageYOffset > window.innerHeight) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
});

//Event Listeners
document.getElementById('night-mode-toggle').addEventListener('click', toggleNightMode);
document.getElementById('scroll-to-top').addEventListener('click', scrollToTop);

// Function to toggle the navbar menu in mobile view
function toggleNavbarMenu() {
  const navbarMenu = document.getElementById('navbarMenu');
  if (navbarMenu) {
    navbarMenu.classList.toggle('active');
  }
}

// Event listener for the navbar toggler button
const navbarToggler = document.getElementById('navbar-toggler');
if (navbarToggler) {
  navbarToggler.addEventListener('click', toggleNavbarMenu);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// Function to fetch and display GitHub projects
function fetchGitHubProjects() {
  const username = 'khanyousufminhaj'; // Replace with your GitHub username
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(data => {
      const projectsContainer = document.getElementById('github-projects');
      projectsContainer.innerHTML = data.map(repo => `
        <div class="project">
          <h3>${repo.name}</h3>
          <p>${repo.description}</p>
          <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        </div>
      `).join('');
    })
    .catch(error => {
      document.getElementById('github-projects').innerHTML = 'Failed to load projects.';
      console.error('Error fetching GitHub projects:', error);
    });
}

// Function to fetch and display Medium blogs
function fetchMediumBlogs() {
  const mediumUsername = 'your-medium-username'; // Replace with your Medium username
  fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`)
    .then(response => response.json())
    .then(data => {
      const blogsContainer = document.getElementById('medium-blogs');
      blogsContainer.innerHTML = data.items.map(blog => `
        <div class="blog">
          <h3>${blog.title}</h3>
          <p>${blog.pubDate}</p>
          <a href="${blog.link}" target="_blank">Read more</a>
        </div>
      `).join('');
    })
    .catch(error => {
      document.getElementById('medium-blogs').innerHTML = 'Failed to load blogs.';
      console.error('Error fetching Medium blogs:', error);
    });
}
// Function to fetch GitHub projects by skill
function fetchGitHubProjectsBySkill(skill) {
  const username = 'khanyousufminhaj'; // Replace with your GitHub username
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(data => {
      const projectsList = document.getElementById(`github-projects-${skill}`);
      const filteredProjects = data.filter(repo => repo.topics.includes(skill)); // Assuming topics are used as skills
      projectsList.innerHTML = filteredProjects.map(repo => `<li>${repo.name}</li>`).join('');
    })
    .catch(error => console.error('Error fetching GitHub projects by skill:', error));
}


// Initialize Entry Animation
window.onload();

// Call the functions when the script loads
fetchGitHubProjects();
fetchMediumBlogs();
