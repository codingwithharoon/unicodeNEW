<?php
/**
 * Plugin Name:       Unicode to Bijoy Converter
 * Plugin URI:        https://github.com/
 * Description:       Convert Unicode Bangla text to Bijoy (ANSI) encoding and vice versa. Supports voice input via Web Speech API. Use shortcode <strong>[unicode_bijoy_converter]</strong> to embed the converter anywhere on your site.
 * Version:           1.0.0
 * Author:            Your Name
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       unicode-bijoy-converter
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

define( 'UBC_VERSION',     '1.0.1' );
define( 'UBC_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'UBC_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );

/* -----------------------------------------------------------------------
 * Enqueue assets only when the shortcode is present on the page
 * --------------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', 'ubc_enqueue_assets' );
function ubc_enqueue_assets() {
    $css_path = UBC_PLUGIN_DIR . 'assets/ubc-style.css';
    $js_path  = UBC_PLUGIN_DIR . 'assets/ubc-tool.js';
    $css_ver  = file_exists( $css_path ) ? (string) filemtime( $css_path ) : UBC_VERSION;
    $js_ver   = file_exists( $js_path ) ? (string) filemtime( $js_path ) : UBC_VERSION;

    // Always register so we can enqueue on demand
    wp_register_style(
        'ubc-style',
        UBC_PLUGIN_URL . 'assets/ubc-style.css',
        [],
        $css_ver
    );
    wp_register_script(
        'ubc-converter',
        UBC_PLUGIN_URL . 'assets/ubc-tool.js',
        [],
        $js_ver,
        true
    );
}

/* -----------------------------------------------------------------------
 * Shortcode  [unicode_bijoy_converter]
 * --------------------------------------------------------------------- */
add_shortcode( 'unicode_bijoy_converter', 'ubc_render_shortcode' );
function ubc_render_shortcode( $atts ) {
    // Enqueue assets when shortcode is used
    wp_enqueue_style( 'ubc-style' );
    wp_enqueue_script( 'ubc-converter' );

    ob_start();
    ?>
    <div class="ubc-wrap" id="ubc-wrap">
        <div class="ubc-tool">
            <!-- Left: Input with Mic -->
            <div class="ubc-panel ubc-panel--input">
                <div class="ubc-panel-label">Enter Unicode/Bijoy</div>
                <div class="ubc-input-wrap">
                    <textarea
                        id="ubc-input"
                        class="ubc-textarea ubc-textarea--unicode"
                        rows="10"
                        placeholder="Type or paste Unicode/Bijoy text"
                        dir="auto"
                        spellcheck="false"
                    ></textarea>
                    <div class="ubc-mic-wrap">
                        <button type="button" class="ubc-mic-btn" id="ubc-mic-btn" title="Voice input" aria-label="Voice input">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a1 1 0 0 1 2 0 7 7 0 0 1-6 6.92V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.08A7 7 0 0 1 5 12a1 1 0 0 1 2 0 5 5 0 1 0 10 0z"/>
                            </svg>
                        </button>
                        <span id="ubc-mic-label" class="ubc-mic-label">Mic Off</span>
                    </div>
                </div>
                <div class="ubc-counter"><span id="ubc-input-count">0</span> words, <span id="ubc-input-chars">0</span> chars</div>
            </div>

            <!-- Middle: Controls (Vertical Stack) -->
            <div class="ubc-panel ubc-panel--controls">
                <button type="button" class="ubc-btn ubc-btn--primary" id="ubc-to-unicode-btn">To Unicode</button>
                <button type="button" class="ubc-btn ubc-btn--primary" id="ubc-to-bijoy-btn">To Bijoy</button>
                <button type="button" class="ubc-btn ubc-btn--secondary" id="ubc-copy-btn">Copy Output</button>
                <button type="button" class="ubc-btn ubc-btn--secondary" id="ubc-clear-btn">Clear</button>
            </div>

            <!-- Right: Output -->
            <div class="ubc-panel ubc-panel--output">
                <div class="ubc-panel-label">Converted Text</div>
                <textarea
                    id="ubc-output"
                    class="ubc-textarea ubc-textarea--unicode"
                    rows="10"
                    placeholder="Output"
                    dir="auto"
                    spellcheck="false"
                    readonly
                ></textarea>
                <div class="ubc-counter"><span id="ubc-output-count">0</span> words, <span id="ubc-output-chars">0</span> chars</div>
            </div>
        </div>

        <div id="ubc-status" class="ubc-status" aria-live="polite"></div>
    </div><!-- /#ubc-wrap -->
    <?php
    return ob_get_clean();
}

/* -----------------------------------------------------------------------
 * Admin: show shortcode reminder on plugin activation / in plugins list
 * --------------------------------------------------------------------- */
register_activation_hook( __FILE__, 'ubc_activation_notice_flag' );
function ubc_activation_notice_flag() {
    set_transient( 'ubc_activation_notice', true, 30 );
}

add_action( 'admin_notices', 'ubc_activation_admin_notice' );
function ubc_activation_admin_notice() {
    if ( get_transient( 'ubc_activation_notice' ) ) {
        delete_transient( 'ubc_activation_notice' );
        ?>
        <div class="notice notice-success is-dismissible">
            <p>
                <strong>Unicode to Bijoy Converter</strong> activated successfully! &#x1F389;<br>
                Use the shortcode <code>[unicode_bijoy_converter]</code> in any page, post, or widget to embed the converter.
                <br><em>Supports Unicode ↔ Bijoy conversion and voice input (Bengali / bn-BD) via the Web Speech API.</em>
            </p>
        </div>
        <?php
    }
}

/* -----------------------------------------------------------------------
 * Plugin row meta — show shortcode in the Plugins list
 * --------------------------------------------------------------------- */
add_filter( 'plugin_row_meta', 'ubc_plugin_row_meta', 10, 2 );
function ubc_plugin_row_meta( $links, $file ) {
    if ( plugin_basename( __FILE__ ) === $file ) {
        $links[] = '<strong>Shortcode:</strong> <code>[unicode_bijoy_converter]</code>';
    }
    return $links;
}
