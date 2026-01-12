// Main JavaScript for IndiaLinks Directory Website

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    document.querySelector('.search-box').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const serviceItems = document.querySelectorAll('.service-item');
        const categories = document.querySelectorAll('.category');
        
        // Reset visibility
        categories.forEach(category => {
            category.style.display = 'block';
        });
        
        if (searchTerm.length > 0) {
            serviceItems.forEach(item => {
                const serviceName = item.querySelector('.service-name').textContent.toLowerCase();
                const categoryName = item.closest('.category').querySelector('.category-header').textContent.toLowerCase();
                
                if (serviceName.includes(searchTerm) || categoryName.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Remove hidden class if it matches search
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Hide categories with no visible items
            categories.forEach(category => {
                const visibleItems = Array.from(category.querySelectorAll('.service-item')).filter(item => 
                    item.style.display !== 'none'
                ).length;
                
                if (visibleItems === 0) {
                    category.style.display = 'none';
                }
            });
        } else {
            // If search is empty, reset to initial state
            serviceItems.forEach(item => {
                item.style.display = 'block';
                if (item.classList.contains('hidden')) {
                    item.style.display = 'none';
                }
            });
        }
    });
    
    // See More functionality
    document.querySelectorAll('.see-more').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-target');
            const categoryPage = document.getElementById(categoryId + '-page');
            
            // Hide categories
            document.querySelector('.categories').style.display = 'none';
            
            // Show category page
            categoryPage.classList.add('active');
            
            // Populate category page content
            const categoryContent = document.querySelector(`.category[data-category="${categoryId}"] .category-content`).cloneNode(true);
            const pageContent = categoryPage.querySelector('.category-page-content');
            pageContent.innerHTML = '';
            
            // Get all service items including hidden ones
            const serviceItems = categoryContent.querySelectorAll('.service-item');
            serviceItems.forEach(item => {
                // Remove hidden class for the category page
                item.classList.remove('hidden');
                pageContent.appendChild(item);
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
    
    // Back button functionality
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            // Hide all category pages
            document.querySelectorAll('.category-page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show categories
            document.querySelector('.categories').style.display = 'grid';
            
            // Scroll to the relevant category
            const categoryId = this.closest('.category-page').getAttribute('data-category');
            const categoryElement = document.querySelector(`.category[data-category="${categoryId}"]`);
            categoryElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Function to add a new category
function addCategory(categoryId, categoryName, services) {
    // Create category container
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category';
    categoryContainer.setAttribute('data-category', categoryId);
    
    // Create category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.textContent = categoryName;
    categoryContainer.appendChild(categoryHeader);
    
    // Create category content
    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';
    
    // Add services
    services.forEach((service, index) => {
        const serviceItem = document.createElement('a');
        serviceItem.href = service.url;
        serviceItem.target = '_blank';
        serviceItem.className = 'service-item';
        if (index >= 4) serviceItem.classList.add('hidden');
        
        const serviceLogo = document.createElement('img');
        serviceLogo.src = service.logo || `https://img.logo.dev/${new URL(service.url).hostname}?token=pk_D1NmVX7xRcGtGu5sPdaADg`;
        serviceLogo.alt = service.name;
        serviceLogo.className = 'service-logo';
        
        const serviceName = document.createElement('div');
        serviceName.className = 'service-name';
        serviceName.textContent = service.name;
        
        serviceItem.appendChild(serviceLogo);
        serviceItem.appendChild(serviceName);
        categoryContent.appendChild(serviceItem);
    });
    
    categoryContainer.appendChild(categoryContent);
    
    // Create see more button
    const seeMoreButton = document.createElement('div');
    seeMoreButton.className = 'see-more';
    seeMoreButton.setAttribute('data-target', categoryId);
    seeMoreButton.textContent = 'See More';
    categoryContainer.appendChild(seeMoreButton);
    
    // Add to categories container
    document.querySelector('.categories').appendChild(categoryContainer);
    
    // Create category page
    createCategoryPage(categoryId, categoryName);
    
    // Reinitialize event listeners
    initializeEventListeners();
}

// Function to create a category page
function createCategoryPage(categoryId, categoryName) {
    // Create category page
    const categoryPage = document.createElement('div');
    categoryPage.id = `${categoryId}-page`;
    categoryPage.className = 'category-page';
    categoryPage.setAttribute('data-category', categoryId);
    
    // Create category page header
    const categoryPageHeader = document.createElement('div');
    categoryPageHeader.className = 'category-page-header';
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Back';
    
    const categoryPageTitle = document.createElement('h2');
    categoryPageTitle.className = 'category-page-title';
    categoryPageTitle.textContent = categoryName;
    
    categoryPageHeader.appendChild(backButton);
    categoryPageHeader.appendChild(categoryPageTitle);
    categoryPage.appendChild(categoryPageHeader);
    
    // Create category page content
    const categoryPageContent = document.createElement('div');
    categoryPageContent.className = 'category-page-content';
    categoryPage.appendChild(categoryPageContent);
    
    // Add to container
    document.querySelector('.container').appendChild(categoryPage);
}

// Function to add a new service to an existing category
function addService(categoryId, service) {
    const categoryContent = document.querySelector(`.category[data-category="${categoryId}"] .category-content`);
    
    // Count existing services to determine if it should be hidden
    const existingServices = categoryContent.querySelectorAll('.service-item').length;
    
    // Create service item
    const serviceItem = document.createElement('a');
    serviceItem.href = service.url;
    serviceItem.target = '_blank';
    serviceItem.className = 'service-item';
    if (existingServices >= 4) serviceItem.classList.add('hidden');
    
    const serviceLogo = document.createElement('img');
    serviceLogo.src = service.logo || `https://img.logo.dev/${new URL(service.url).hostname}?token=pk_D1NmVX7xRcGtGu5sPdaADg`;
    serviceLogo.alt = service.name;
    serviceLogo.className = 'service-logo';
    
    const serviceName = document.createElement('div');
    serviceName.className = 'service-name';
    serviceName.textContent = service.name;
    
    serviceItem.appendChild(serviceLogo);
    serviceItem.appendChild(serviceName);
    categoryContent.appendChild(serviceItem);
}

// Function to initialize all event listeners
function initializeEventListeners() {
    // See More functionality
    document.querySelectorAll('.see-more').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-target');
            const categoryPage = document.getElementById(categoryId + '-page');
            
            // Hide categories
            document.querySelector('.categories').style.display = 'none';
            
            // Show category page
            categoryPage.classList.add('active');
            
            // Populate category page content
            const categoryContent = document.querySelector(`.category[data-category="${categoryId}"] .category-content`).cloneNode(true);
            const pageContent = categoryPage.querySelector('.category-page-content');
            pageContent.innerHTML = '';
            
            // Get all service items including hidden ones
            const serviceItems = categoryContent.querySelectorAll('.service-item');
            serviceItems.forEach(item => {
                // Remove hidden class for the category page
                item.classList.remove('hidden');
                pageContent.appendChild(item);
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
    
    // Back button functionality
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            // Hide all category pages
            document.querySelectorAll('.category-page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show categories
            document.querySelector('.categories').style.display = 'grid';
            
            // Scroll to the relevant category
            const categoryId = this.closest('.category-page').getAttribute('data-category');
            const categoryElement = document.querySelector(`.category[data-category="${categoryId}"]`);
            categoryElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
