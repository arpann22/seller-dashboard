<?php
/*
Plugin Name: Seller Dashboard
Description: A React-based Seller Dashboard for WordPress
Version: 1.0
Author: cpm
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', 'enqueue_react_app');

function enqueue_react_app()
{
    $plugin_dir = plugin_dir_path(__FILE__) . 'build/static/';

    // Dynamically get the hashed CSS and JS files
    $js_files = glob($plugin_dir . 'js/main*.js');
    $css_files = glob($plugin_dir . 'css/main*.css');

    if (!empty($js_files)) {
        // Extract the relative URL for JS
        $js_file = str_replace(plugin_dir_path(__FILE__), '', $js_files[0]);
        wp_enqueue_script(
            'my-react-app-js',
            plugins_url($js_file, __FILE__),
            array(),
            filemtime($js_files[0]),
            true
        );
    }

    if (!empty($css_files)) {
        // Extract the relative URL for CSS
        $css_file = str_replace(plugin_dir_path(__FILE__), '', $css_files[0]);
        wp_enqueue_style(
            'my-react-app-css',
            plugins_url($css_file, __FILE__),
            array(),
            filemtime($css_files[0])
        );
    }
}

// function seller_dashboard_enqueue_assets()
// {
//     $plugin_url = plugin_dir_url(__FILE__);
//     $manifest_path = plugin_dir_path(__FILE__) . 'build/asset-manifest.json';

//     if (file_exists($manifest_path)) {
//         $manifest = json_decode(file_get_contents($manifest_path), true);

//         // Enqueue main JavaScript file
//         if (isset($manifest['files']['main.js'])) {
//             wp_enqueue_script(
//                 'seller-dashboard-js',
//                 $plugin_url . 'build/' . $manifest['files']['main.js'],
//                 array('wp-element'), // Include WordPress's React dependency
//                 null,
//                 true
//             );
//         }

//         // Enqueue main CSS file
//         if (isset($manifest['files']['main.css'])) {
//             wp_enqueue_style(
//                 'seller-dashboard-css',
//                 $plugin_url . 'build/' . $manifest['files']['main.css'],
//                 array(),
//                 null
//             );
//         }
//     }
// }

// // // Hook the function to enqueue assets
// add_action('admin_enqueue_scripts', 'seller_dashboard_enqueue_assets');

// // Add a menu item to the admin dashboard
// add_action('admin_menu', 'seller_dashboard_menu');

// function seller_dashboard_menu()
// {
//     add_menu_page(
//         'Seller Dashboard',   // Page title
//         'Seller Dashboard',   // Menu title
//         'manage_options',     // Capability
//         'seller-dashboard',   // Menu slug
//         'render_seller_dashboard_page', // Callback function
//         'dashicons-chart-bar', // Menu icon
//         26                    // Position
//     );
// }

function render_seller_dashboard_page()
{
    // echo '<div id="root"></div>'; // Root div where React app will be mounted
}



add_shortcode('tests', 'test');
function test()
{
    ob_start();
?>
    <div id="root"></div>

<?php
    return ob_get_clean();
}



// function enqueue_tinymce_for_react()
// {
//     // Enqueue the WordPress default TinyMCE scripts
//     wp_enqueue_script('wp-tinymce');
// }
// add_action('admin_enqueue_scripts', 'enqueue_tinymce_for_react');


function enqueue_tinymce_for_react()
{
    // Enqueue the WordPress default TinyMCE scripts
    wp_enqueue_script('wp-tinymce');

    // Enqueue your custom TinyMCE initialization script
    wp_enqueue_script(
        'my-tinymce-init',
        plugins_url('src/components/Tabs/my-tinymce-init.js', __FILE__), // Adjust the path as necessary
        array('wp-tinymce'), // Dependency
        null, // Version number
        true // Load in footer
    );
}
add_action('admin_enqueue_scripts', 'enqueue_tinymce_for_react');
