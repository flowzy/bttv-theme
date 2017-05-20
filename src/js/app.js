chrome.runtime.sendMessage('change icon')

// imports
import { Debug, Mockups } from './components/index'

// variables
let bttv = {
    dev: {
        enabled:    false,
        cdn:        chrome.runtime.getURL('')
    },
    mockups:    new Mockups,
    debug:      new Debug,
    storage:    chrome.storage.sync,
    settings:   {}
}

// ****************
// Settings
// ****************

// asynchronously get all settings
bttv.storage.get('settings', ( item ) => {
    
    // do nothing if settings do not exist
    if ( !Object.keys(item).length ) return bttv.debug.log('Settings: not found (empty).')

    // save settings into a global variable
    bttv.settings = item.settings

    // log
    bttv.debug.log('Settings: successfully loaded.')

})

// ****************
// Theme
// ****************

// get theme from localStorage
let localTheme = window.localStorage.getItem('bttv--theme') ? JSON.parse( window.localStorage.getItem('bttv--theme') ) : ''
$('<style id="bttv__theme" />').html( localTheme.stylesheet ).appendTo('head')

// wait for settings to load
$.when( bttv.settings.length ).then( () => {

    if ( bttv.settings.theme ) {
        let name        = bttv.settings.theme
        let url         = `${bttv.dev.cdn}css/theme-${bttv.settings.theme}.css`
        let isOutdated  = localTheme ? ((new Date().getTime() - localTheme.last_updated) / (1000 * 60 * 60)) >= 6 : true

        // do not show theme if old header found
        if ( $('#site_header').length ) return

        // disable twitch's dark style for chat
        let chatSettings = JSON.parse(window.localStorage.getItem('chatSettings'))
        if ( chatSettings !== null && chatSettings.darkMode ) {
            chatSettings.darkMode = false
            window.localStorage.setItem( 'chatSettings', JSON.stringify( chatSettings ) )
        }

        // if dev mode is enabled, append stylesheet without caching it
        if ( bttv.dev.enabled ) {
            $(`<link rel="stylesheet" type="text/css" href="${url}">`).appendTo('head')

            if (window.localStorage.getItem('bttv--theme'))
                window.localStorage.removeItem('bttv--theme')

            return
        }

        // update theme if is outdated or not saved locally
        if ( !localTheme || isOutdated ) {
            bttv.debug.log('Theme: saving stylesheet locally.')

            let request = $.ajax({
                url: url,
                method: 'GET',
                cache: false
            })

            request.fail( () => {
                bttv.debug.error('Theme: could not connect to the server.')
            })

            request.done( (stylesheet) => {
                bttv.debug.log(`Theme: received "${name}" stylesheet.`)

                $('style#bttv__theme').html( stylesheet )

                let theme = {
                    name: name,
                    last_updated: new Date().getTime(),
                    stylesheet: stylesheet
                }

                window.localStorage.setItem('bttv--theme', JSON.stringify( theme ))
            })
        }
    } else {
        if ( window.localStorage.getItem('bttv--theme') ) {
            window.localStorage.removeItem('bttv--theme')
            $('style#bttv__theme').remove()
        }
    }

})

window.BetterTTV = bttv;