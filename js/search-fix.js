// Robust search handler for Jump2Site
// Place <script src="js/search-fix.js"></script> near the end of index.html (before </body>)

document.addEventListener('DOMContentLoaded', function () {
  const searchBox = document.querySelector('.search-box');
  if (!searchBox) {
    console.warn('search-fix: .search-box not found on page.');
    return;
  }

  function updateSearch(e) {
    try {
      const searchTerm = (e && e.target && e.target.value || '').toLowerCase().trim();

      // re-query current DOM to avoid stale NodeLists
      const serviceItems = Array.from(document.querySelectorAll('.service-item'));
      const categories = Array.from(document.querySelectorAll('.category'));

      // Reset categories (show by default)
      categories.forEach(cat => {
        cat.style.display = ''; // let CSS decide ('' resets inline style)
      });

      if (searchTerm.length > 0) {
        serviceItems.forEach(item => {
          // Safely get service and category text; fall back to item.textContent
          const serviceName = (item.querySelector('.service-name')?.textContent || item.textContent || '').toLowerCase();
          const categoryName = (item.closest('.category')?.querySelector('.category-header')?.textContent || '').toLowerCase();

          const match = serviceName.includes(searchTerm) || categoryName.includes(searchTerm);

          if (match) {
            item.style.display = '';
            item.classList.remove('hidden');
          } else {
            item.style.display = 'none';
          }
        });

        // Hide categories with no visible items
        categories.forEach(category => {
          const visibleItems = Array.from(category.querySelectorAll('.service-item')).some(it => {
            // consider as visible if inline style not display:none
            return it.style.display !== 'none';
          });
          category.style.display = visibleItems ? '' : 'none';
        });
      } else {
        // Empty search: restore original visibility, respect "hidden" class
        serviceItems.forEach(item => {
          if (item.classList.contains('hidden')) {
            item.style.display = 'none';
          } else {
            item.style.display = '';
          }
        });
        categories.forEach(cat => cat.style.display = '');
      }
    } catch (err) {
      console.error('search-fix: error while searching', err);
    }
  }

  // Support both input and keyup (input is preferred)
  searchBox.addEventListener('input', updateSearch);
  searchBox.addEventListener('keyup', updateSearch);
});
