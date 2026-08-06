/*
Concepts:
    - Stats nav = statistics navigation
         is the navigation showing the categories.

    - Stats cats nav = statistics category navigation
         is the navigation showing the categories 
         and everything in the selected category.
*/

$(document).ready(function() {
    // Code to be executed when the DOM content is loaded
    // (quicker than $(window).on("load", function () {...)

    makeStatsCatsNavCloseable();
    if (checkIfFrontpageOrStats()) { // or talnaefni but not px.
        // We automatically semi-open statistics-nav
        semiOpenStatsNav();
    }
    else {
        // On all other pages statsNav floats above the content beneath it, instead
        // of pushing it down and taking vertical space in the HTML/DOM
        var statisticsCategoryNav = document.getElementById('statistics-category-nav');
        statisticsCategoryNav.style.position = 'absolute';
        statisticsCategoryNav.style.width = '100%';
    }

    var dropdownItems = document.querySelectorAll('#header-main-webtree li.dropdown');
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            closeStatsNav();
        });
    });

    checkBaseAnnouncementVisibility();

    var closeBaseAnnouncement = document.getElementById("base-announcement-closer");

    if(closeBaseAnnouncement){
    closeBaseAnnouncement.addEventListener('click', function() {
        var baseAnnouncement = document.getElementById('base-announcement');
        const hide_base_announce_now = new Date().getTime();
        localStorage.setItem('hideBaseAnnouncement', hide_base_announce_now);
        baseAnnouncement.style.display = 'none';
    })
    }


    document.addEventListener('click', function(event) {
    var statisticsNav = document.getElementById('statistics-category-nav');
    var statisticsNavOpen = document.getElementById('open-statistics-nav');
    var clickedElement = event.target;

    // Check if the clicked element is outside the statisticsNav
    if (!statisticsNav.contains(clickedElement) && 
        !statisticsNavOpen.contains(clickedElement)) {
        closeStatsNav();
    }
    });


});

// Check baseAnnouncementVisibility
function checkBaseAnnouncementVisibility() {
    const baseAnnouncement = document.getElementById('base-baseAnnouncement');
    const lastHideBaseAnnouncement = localStorage.getItem('hideBaseAnnouncement');
    if(lastHideBaseAnnouncement) {
        const now = new Date().getTime();
        const hoursElapsed = (now - parseInt(lastHideBaseAnnouncement)) / (1000 * 60 * 60);
        if (hoursElapsed >= 24) {
            var baseAnnouncement_ii = document.getElementById('base-announcement');
            baseAnnouncement_ii.style.display = 'block';

        } else {
            var baseAnnouncement_i = document.getElementById('base-announcement');
            baseAnnouncement_i.style.display = 'none';
        }
    } else {
        var baseAnnouncement_iii = document.getElementById('base-announcement');
        if(baseAnnouncement_iii){
            baseAnnouncement_iii.style.display = 'block';
        }
    }
}


// Checks if user is on frontpage or statistics page via URL,
//      with special case of returning false if on .../statistics/px page.
//
// Returns: boolean true if on frontpage or statistics page,
//
//      except if on hagstofa.is/talnaefni/px or hagstofa.is/talnaefni/px/...
//      or statice.is/statistics/px or statice.is/statistics/px/...
//      then it returns false.
//
//      Also returns false on all other pages.
//
// Note: Designer requested that we keep stats nav closed but underlined
//      on px-page for Gagnabanki, that nevertheless should be under /statistics/
function checkIfFrontpageOrStats() {
    var currentURL = window.location.href;
    var pathname = window.location.pathname;
    // Remove leading and trailing slashes from the pathname
    var trimmedPathname = pathname.replace(/^\/|\/$/g, '');
    var segments = trimmedPathname.split('/');

    // Check if the segments array is near-empty (front page)
    if (segments.length === 1) {
        if (segments[0].length === 0) {
            return true;
        }
    }

    if (segments.length >= 1) {
        // Check if "/talnaefni/" or "/statistics/" comes immediately after the basic page URL
        if (segments[0] === 'talnaefni' || segments[0] === 'statistics') {
            // Check if the next segment is "px"
            if (segments.length >= 2) {
                // Change 'px' to other name if Gagnabanki URL is different in the end:
                if (segments[1] === 'px') {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
}

function semiOpenStatsNav() {
    document.getElementById('open-statistics-nav').classList.add('selected');
    document.getElementById('statistics-category-nav').style.display = 'block';
}

function toggleOpenStatsNav() {
    var navButton = document.getElementById('open-statistics-nav');
    if (navButton.classList.contains('open')) {
        closeStatsNav();
    }
    else {
        openStatsNav();
    }
}

function closeStatsNav() {
    var navList = document.getElementById('statistics-category-nav');
    var navButton = document.getElementById('open-statistics-nav');
    navButton.classList.remove('open');
    navList.style.boxShadow = null;

    if (!checkIfFrontpageOrStats()) { // if we're not on an always-open page
        navList.style.display = 'none';
    }
}


function openStatsNav() {
    var navList = document.getElementById('statistics-category-nav');
    var navButton = document.getElementById('open-statistics-nav');
    navButton.classList.add('open');
    navList.style.boxShadow = '0 12px 4px -7px #00000029';
    navList.style.display = 'block'; // only has effect if we're not on frontpage
}

// Creates custom tabs in header which can be opened, closed, 
// automatically close when another tab is opened, etc.
// User can exit all tabs via clicking outside of the tab area
// or pressing "Esc" on the keyboard.
//
// Special case: When on statistics-page we highlight the category of the page
// we're on in the nav, on big-screens only.
function makeStatsCatsNavCloseable() {
    var tabLinks = document.querySelectorAll('#statistics-category-nav ul.custom-nav-tabs a');
    var lis = document.querySelectorAll('#statistics-category-nav ul.custom-nav-tabs li');
    var tabPanes = document.querySelectorAll('.custom-tab-pane');

    closeAllTabsAndHighlightCurrentCategory(); // this achieves the start state

    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener('click', function(event) {
            // Prevent the link from navigating to a new page
            event.preventDefault();

            // Showing only target (custom-tab-pane) or hiding all (toggle):
            var target = document.querySelector(tabLink.getAttribute('href'));
            removeClassFromSiblings(target, 'show');
            target.classList.toggle('show');
            
            // Removing active class from siblings of parentLi:
            var parentLi = tabLink.parentNode;
            removeClassFromSiblings(parentLi, "active");

            if (!target.classList.contains('show')) {
                // We're clicking a tab to close it
                closeAllTabsAndHighlightCurrentCategory();
            }
            else {
                // We're clicking a tab to open it
                lis.forEach(function(li) {
                    li.classList.add('greyed-out');
                });
                parentLi.classList.remove('greyed-out');
                parentLi.classList.add('active');
            }
        });
    });

    // Helper function:
    function removeClassFromSiblings(element, className) {
        var parent = element.parentNode;
        var siblings = parent.children;
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] !== element) {
                siblings[i].classList.remove(className);
            }
        }
    }

    // Helper function for achieving start state or "closing" all tabs & highlighting,
    // so either everything appears closed if we're not on statistics page,
    // or we've highlighted the current category if we're on a statistics page.
    function closeAllTabsAndHighlightCurrentCategory() {
        tabPanes.forEach(function(tabPane) {
            tabPane.classList.remove('show');
        });
        
        var pathname = window.location.pathname;
        if (pathname.startsWith("/talnaefni/") || pathname.startsWith("/statistics/")) {
            // instead of an empty neutral state closing everything,
            // we highlight category of what we're in as the start state
            var segments = pathname.split("/");
            var category = segments[2];
            var matchingTabLink = document.querySelector(`#statistics-category-nav ul.custom-nav-tabs a[href="#${category}"]`);
            var parentLi = matchingTabLink.parentNode;
            parentLi.classList.remove('greyed-out');
            parentLi.classList.add('active');
            lis.forEach(function(li) {
              if (li !== parentLi) {
                li.classList.add('greyed-out');
                li.classList.remove('active');
              }
            });
        } else {
            // we just close everything:
            lis.forEach(function(li) {
                li.classList.remove('active', 'greyed-out');
            });
        }
    }

    // User clicks outside of tab => close all tabs
    document.addEventListener('click', function(event) {
        var target = event.target;
        if (!target.closest('#statistics-category-nav')) {
            closeAllTabsAndHighlightCurrentCategory();
        }
    });

    // User presses "Esc" => close all tabs
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllTabsAndHighlightCurrentCategory();
        }
    });
}