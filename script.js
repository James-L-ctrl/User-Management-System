// API URLs
const POSTS_API = 'https://jsonplaceholder.typicode.com/posts';
const USERS_API = 'https://jsonplaceholder.typicode.com/users';

// DOM Elements
const postsContainer = document.getElementById('postsContainer');
const titleSearch = document.getElementById('titleSearch');
const authorFilter = document.getElementById('authorFilter');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const userDetails = document.getElementById('userDetails');

// Store users data globally
let users = [];
let posts = [];

// Fetch data from APIs
async function fetchData() {
    try {
        // Fetch users first
        const usersResponse = await fetch(USERS_API);
        users = await usersResponse.json();
        
        // Populate author filter dropdown
        populateAuthorFilter();
        
        // Fetch posts
        const postsResponse = await fetch(POSTS_API);
        posts = await postsResponse.json();
        
        // Display posts
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
    }
}

// Populate author filter dropdown
function populateAuthorFilter() {
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name}`;
        authorFilter.appendChild(option);
    });
}

// Display posts with filtering
function displayPosts(filteredPosts) {
    postsContainer.innerHTML = '';
    
    filteredPosts.forEach(post => {
        const user = users.find(u => u.id === post.userId);
        
        const postCard = document.createElement('div');
        postCard.className = 'col-md-6 col-lg-4';
        
        postCard.innerHTML = `
            <div class="post-card">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-author">By: ${user.name}</p>
                <p class="post-body">${post.body}</p>
                <button class="btn btn-primary" onclick="showUserDetails(${user.id})">View Author Details</button>
            </div>
        `;
        
        postsContainer.appendChild(postCard);
    });
}

// Show user details in modal
function showUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    
    userDetails.innerHTML = `
        <div class="user-detail">
            <label>Name:</label>
            <p>${user.name}</p>
        </div>
        <div class="user-detail">
            <label>Email:</label>
            <p>${user.email}</p>
        </div>
        <div class="user-detail">
            <label>Phone:</label>
            <p>${user.phone}</p>
        </div>
        <div class="user-detail">
            <label>Website:</label>
            <p>${user.website}</p>
        </div>
        <div class="user-detail">
            <label>Company:</label>
            <p>${user.company.name}</p>
        </div>
        <div class="user-detail">
            <label>Address:</label>
            <p>${user.address.street}, ${user.address.city}, ${user.address.zipcode}</p>
        </div>
    `;
    
    userModal.show();
}

// Search functionality
titleSearch.addEventListener('input', () => {
    const searchTerm = titleSearch.value.toLowerCase();
    const selectedAuthor = authorFilter.value;
    
    const filteredPosts = posts.filter(post => {
        const matchesTitle = post.title.toLowerCase().includes(searchTerm);
        const matchesAuthor = !selectedAuthor || post.userId == selectedAuthor;
        return matchesTitle && matchesAuthor;
    });
    
    displayPosts(filteredPosts);
});

// Author filter change
authorFilter.addEventListener('change', () => {
    const searchTerm = titleSearch.value.toLowerCase();
    const selectedAuthor = authorFilter.value;
    
    const filteredPosts = posts.filter(post => {
        const matchesTitle = searchTerm ? post.title.toLowerCase().includes(searchTerm) : true;
        const matchesAuthor = !selectedAuthor || post.userId == selectedAuthor;
        return matchesTitle && matchesAuthor;
    });
    
    displayPosts(filteredPosts);
});

// Initialize the application
document.addEventListener('DOMContentLoaded', fetchData);
