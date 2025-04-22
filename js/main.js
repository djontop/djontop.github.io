// GitHub API Configuration
const GITHUB_USERNAME = 'djontop';
const GITHUB_API = 'https://api.github.com';
const MAX_REPOS = 100; // Maximum repositories to fetch

// DOM Elements
const repoContainer = document.getElementById('repo-container');
const repoSearch = document.getElementById('repo-search');
const languageFilter = document.getElementById('language-filter');
const repoCountElement = document.getElementById('repo-count');
const starsCountElement = document.getElementById('stars-count');
const followersCountElement = document.getElementById('followers-count');
const currentYearElement = document.getElementById('current-year');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Data Storage
let repositories = [];
let filteredRepos = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    updateCurrentYear();
    initTheme();
});

// Initialize App
async function initApp() {
    try {
        // Fetch GitHub data
        const [repos, user] = await Promise.all([
            fetchRepositories(),
            fetchUserData()
        ]);

        // Update user data stats
        updateUserStats(user);

        // Store repositories
        repositories = repos;
        filteredRepos = [...repositories];

        // Generate language filter options
        generateLanguageOptions();

        // Render repositories
        renderRepositories(filteredRepos);
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorMessage();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    repoSearch.addEventListener('input', filterRepositories);
    
    // Language filter
    languageFilter.addEventListener('change', filterRepositories);

    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', handleScroll);

    // Nav menu item clicks (for mobile)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });
}

// Handle scroll events
function handleScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Update current year in footer
function updateCurrentYear() {
    currentYearElement.textContent = new Date().getFullYear();
}

// Initialize theme
function initTheme() {
    // Check if user preference exists
    const savedTheme = localStorage.getItem('theme');
    
    // If user has preference, apply it
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Otherwise, check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    
    // Enable transitions after page load to prevent flash
    setTimeout(() => {
        document.body.classList.add('theme-transition-ready');
    }, 100);
}

// Toggle theme
function toggleTheme() {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Toggle between light and dark
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Add animation class to button
    themeToggleBtn.classList.add('theme-toggle-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        themeToggleBtn.classList.remove('theme-toggle-animation');
    }, 500);
}

// Fetch repositories from GitHub API
async function fetchRepositories() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=${MAX_REPOS}&sort=updated`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const repos = await response.json();
        return repos.filter(repo => !repo.fork); // Filter out forked repositories
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

// Fetch user data from GitHub API
async function fetchUserData() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Update user statistics
function updateUserStats(userData) {
    // Update repository count
    if (repoCountElement) {
        animateCounter(repoCountElement, 0, userData.public_repos);
    }
    
    // Update stars count if available
    if (starsCountElement && userData.public_repos) {
        // We already have the stars count from our HTML (62)
        // This would need to be calculated by summing stars from all repos
        // For now, we use the initial value set in HTML
        const starCount = parseInt(starsCountElement.textContent);
        animateCounter(starsCountElement, 0, starCount);
    }
    
    // Update followers count
    if (followersCountElement) {
        animateCounter(followersCountElement, 0, userData.followers);
    }
}

// Generate language filter options
function generateLanguageOptions() {
    // Create a set of unique languages
    const languages = new Set();
    
    // Add "All Languages" option
    languages.add('all');
    
    // Add languages from repositories
    repositories.forEach(repo => {
        if (repo.language) {
            languages.add(repo.language);
        }
    });
    
    // Clear existing options except the first one (All Languages)
    while (languageFilter.options.length > 1) {
        languageFilter.remove(1);
    }
    
    // Add language options to the select
    languages.forEach(language => {
        if (language !== 'all') {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        }
    });
}

// Filter repositories based on search and language filter
function filterRepositories() {
    const searchTerm = repoSearch.value.toLowerCase();
    const selectedLanguage = languageFilter.value;
    
    filteredRepos = repositories.filter(repo => {
        // Filter by search term
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm) || 
            (repo.description && repo.description.toLowerCase().includes(searchTerm));
        
        // Filter by language
        const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
        
        return matchesSearch && matchesLanguage;
    });
    
    renderRepositories(filteredRepos);
}

// Render repositories in the container
function renderRepositories(repos) {
    // Clear loading spinner
    repoContainer.innerHTML = '';
    
    if (repos.length === 0) {
        repoContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-3x"></i>
                <h3>No repositories found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Create repository cards
    repos.forEach(repo => {
        const card = createRepositoryCard(repo);
        repoContainer.appendChild(card);
    });

    // Add animation to repository cards
    animateRepositoryCards();
}

// Create repository card
function createRepositoryCard(repo) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Determine language color
    const languageClass = repo.language ? repo.language.toLowerCase() : 'default';
    
    // Format date
    const updatedAt = new Date(repo.updated_at);
    const formattedDate = updatedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Create card content
    card.innerHTML = `
        <div class="repo-header">
            <div class="repo-icon">
                <i class="fas fa-code-branch"></i>
            </div>
        </div>
        <h3 class="repo-title">${repo.name}</h3>
        <p class="repo-description">${repo.description || 'No description available'}</p>
        <div class="repo-meta">
            ${repo.language ? `
            <div class="repo-language">
                <span class="language-dot ${languageClass}"></span>
                <span>${repo.language}</span>
            </div>
            ` : ''}
            <div class="repo-meta-item">
                <i class="fas fa-star"></i>
                <span>${repo.stargazers_count}</span>
            </div>
            <div class="repo-meta-item">
                <i class="fas fa-code-fork"></i>
                <span>${repo.forks_count}</span>
            </div>
        </div>
        <div class="repo-footer">
            <a href="${repo.html_url}" target="_blank" class="repo-link">
                View on GitHub <i class="fas fa-external-link-alt"></i>
            </a>
            <div class="repo-updated">
                <small>Updated: ${formattedDate}</small>
            </div>
        </div>
    `;
    
    return card;
}

// Show error message
function showErrorMessage() {
    repoContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <h3>Error loading repositories</h3>
            <p>There was a problem fetching data from GitHub. Please try again later.</p>
        </div>
    `;
}

// Animate counter
function animateCounter(element, start, end) {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = (end - start) / totalFrames;
    
    let currentFrame = 0;
    let currentValue = start;
    
    const animate = () => {
        currentFrame++;
        currentValue += increment;
        
        if (currentFrame === totalFrames) {
            element.textContent = end;
        } else {
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

// Animate repository cards
function animateRepositoryCards() {
    const cards = document.querySelectorAll('.repo-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.05}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
} 