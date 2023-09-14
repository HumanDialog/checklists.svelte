import {writable, get} from 'svelte/store';



export const app_config = writable(null);
export const route_prefix = writable('');
export const route_app_name = writable(sessionStorage.route_app_name || '');
route_app_name.subscribe( (value) => sessionStorage.route_app_name = value);

export const dark_mode_store = writable(localStorage.dark_mode || '')
dark_mode_store.subscribe( (value) => localStorage.dark_mode = value);

export const main_sidebar_visible_store = writable(sessionStorage.main_sidebar_visible_store || '*');
main_sidebar_visible_store.subscribe( (value) => sessionStorage.main_sidebar_visible_store = value);

export const tools_visible_store = writable ((sessionStorage.tools_visible_store && sessionStorage.tools_visible_store == 'true') || false);
tools_visible_store.subscribe( (value) => sessionStorage.tools_visible_store = (value ? 'true' : ''));

export const bottom_bar_visible_store = writable( (sessionStorage.bottom_bar_visible_store && sessionStorage.bottom_bar_visible_store == 'true') || false);
bottom_bar_visible_store.subscribe( (value) => sessionStorage.bottom_bar_visible_store = (value ? 'true' : ''));

export const right_sidebar_visible_store = writable(false)
export const visible_property_tab_store = writable('');

export let screen = {
    width: 0
}


export function restore_defults()
{
    main_sidebar_visible_store.set('*');
    tools_visible_store.set(false);
    bottom_bar_visible_store.set(false);
    right_sidebar_visible_store.set(false);
    visible_property_tab_store.set('');
}

export function toggle_sidebar(index)
{
    if(get(main_sidebar_visible_store) == index)
        main_sidebar_visible_store.set('*')
    else
        main_sidebar_visible_store.set(index)
}

export function auto_hide_sidebar()
{
    if(window.innerWidth < 1024)
        hide_sidebar()
}
    
export function hide_sidebar()
{
    main_sidebar_visible_store.set('*')
}

export function show_sidebar(index)
{
    main_sidebar_visible_store.set(index)
}
