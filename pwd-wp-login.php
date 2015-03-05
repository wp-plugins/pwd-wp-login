<?php
/*
Plugin Name: PWD WP Login
Version: 1.2
Plugin URI: http://www.plateformewpdigital.fr/plugins/wp-login
Description: Modifiy your login page WordPress
Author: Plateforme WP Digital, Kulka Nicolas
Author URI: http://www.plateformewpdigital.fr
Domain Path: languages
Network: false
Text Domain: pwd-wp-login
 */

// don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

// Plugin constants
define( 'PWD_LOGIN_VERSION', '1.2' );
define( 'PWD_LOGIN_FOLDER', 'pwd-wp-login' );

define( 'PWD_LOGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PWD_LOGIN_DIR', plugin_dir_path( __FILE__ ) );

// Function for easy load files
function _pwd_login_load_files( $dir, $files, $prefix = '' ) {
	foreach ( $files as $file ) {
		if ( is_file( $dir . $prefix . $file . ".php" ) ) {
			require_once($dir . $prefix . $file . ".php");
		}
	}
}

// Plugin client classes
_pwd_login_load_files( PWD_LOGIN_DIR . 'classes/', array( 'plugin' ) );

add_action( 'plugins_loaded', 'init_pwd_loginplugin' );
function init_pwd_loginplugin() {

	load_plugin_textdomain( 'pwd-wp-login', false, basename( dirname( __FILE__ ) ) . '/languages/' );

	// Load client
	new PWD_LOGIN_Plugin();
}