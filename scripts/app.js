/**
 * Web3 实习计划 - 课程大纲应用
 */

// Global state
let courses = [];
let filteredCourses = [];

// DOM Elements
const courseTableBody = document.getElementById('courseTableBody');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const tableWrapper = document.querySelector('.table-wrapper');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadCourses();
  setupTabs();
  setupSearch();
});

/**
 * Load courses from JSON file
 */
async function loadCourses() {
  try {
    // Add timestamp to prevent caching
    const response = await fetch(`data/courses.json?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error('Failed to load courses');
    }
    courses = await response.json();
    filteredCourses = [...courses];
    renderCourses();
  } catch (error) {
    console.error('Error loading courses:', error);
    showError('无法加载课程数据，请刷新页面重试。');
  }
}

/**
 * Render courses to the table
 */
function renderCourses() {
  if (filteredCourses.length === 0) {
    tableWrapper.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  tableWrapper.style.display = 'block';
  emptyState.style.display = 'none';

  const html = filteredCourses.map(course => {
    const formattedDate = formatDate(course.date);
    const weekLabel = getWeekLabel(course.week);
    
    // Handle replay links (YouTube and Bilibili)
    let replayHtml = '';
    if (course.replayLinks) {
      const links = [];
      
      if (course.replayLinks.youtube) {
        links.push(`
          <a href="${escapeHtml(course.replayLinks.youtube)}" class="table-link" target="_blank" rel="noreferrer" title="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        `);
      }
      
      if (course.replayLinks.bilibili) {
        links.push(`
          <a href="${escapeHtml(course.replayLinks.bilibili)}" class="table-link" target="_blank" rel="noreferrer" title="Bilibili">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
            </svg>
          </a>
        `);
      }
      
      replayHtml = links.length > 0 
        ? `<div class="table-links-group">${links.join('')}</div>`
        : '<span class="table-link table-link-disabled">暂无</span>';
    } else {
      replayHtml = '<span class="table-link table-link-disabled">暂无</span>';
    }
    
    return `
      <tr>
        <td>
          <span class="badge badge-week">${weekLabel}</span>
        </td>
        <td>${formattedDate}</td>
        <td>
          <strong>${escapeHtml(course.topic)}</strong>
        </td>
        <td>${escapeHtml(course.instructor)}</td>
        <td>${replayHtml}</td>
        <td>
          ${course.materialsLink 
            ? `<a href="${escapeHtml(course.materialsLink)}" class="table-link" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                下载
              </a>` 
            : `<span class="table-link table-link-disabled">暂无</span>`
          }
        </td>
      </tr>
    `;
  }).join('');

  courseTableBody.innerHTML = html;
}

/**
 * Setup tab switching functionality
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;

      // Update button states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Update panel states
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

/**
 * Setup search functionality
 */
function setupSearch() {
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      filterCourses(query);
    }, 300);
  });
}

/**
 * Filter courses based on search query
 */
function filterCourses(query) {
  if (!query) {
    filteredCourses = [...courses];
  } else {
    filteredCourses = courses.filter(course => {
      return (
        course.topic.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.date.includes(query)
      );
    });
  }
  renderCourses();
}

/**
 * Format date to Chinese format
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${month}月${day}日 (周${weekday})`;
}

/**
 * Get week label
 */
function getWeekLabel(week) {
  if (week === 0) return '预备周';
  return `第 ${week} 周`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show error message
 */
function showError(message) {
  courseTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center text-muted" style="padding: 2rem;">
        ${message}
      </td>
    </tr>
  `;
}
