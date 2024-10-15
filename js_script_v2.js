$(document).ready(function() {
    // This function sets up the tab navigation
    var items = $('.tab button').each(function() {
        $(this).click(function() {
            // Remove the current class from all tabs and add it to the clicked tab
            items.removeClass('active');
            $(this).addClass('active');

            // Hide all content divs and show the selected one
            $('.tabcontent').hide();
            var cityName = $(this).attr('onclick').split("'")[1]; // Get the city name
            $('#' + cityName).show('fast');

            // Update the URL hash with the tab name
            window.location.hash = cityName;
        });
    });

    // Handle the hash change event to navigate directly to a tab using the URL
    function showTab(tab) {
        // Simulate a click on the corresponding tab button
        $(".tab button[onclick*='" + tab + "']").click();
    }

    // Check if there's a hash in the URL when the page loads
    if (window.location.hash) {
        showTab(window.location.hash.substring(1)); // Remove the '#' from the hash
    } else {
        // Default to the first tab
        $('.tab button:first').click();
    }

    // Update the tab when the URL hash changes
    $(window).on('hashchange', function() {
        showTab(window.location.hash.substring(1)); // Remove the '#' from the hash
    });
});
