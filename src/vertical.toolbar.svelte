<script>
    import FaMoon from 'svelte-icons/fa/FaMoon.svelte'
    import FaSun from 'svelte-icons/fa/FaSun.svelte'
    //import FaHome from 'svelte-icons/fa/FaHome.svelte'
    import FaHome from 'svelte-icons/fa/FaHome.svelte'
    import FaBars from 'svelte-icons/fa/FaBars.svelte'
    import FaEllipsisH from 'svelte-icons/fa/FaEllipsisH.svelte'
    import FaTools from 'svelte-icons/fa/FaTools.svelte'
    import GoPrimitiveDot from 'svelte-icons/go/GoPrimitiveDot.svelte'
    import {dark_mode_store, 
            toggle_sidebar, 
            show_sidebar,
            hide_sidebar,
            tools_visible_store,
            bottom_bar_visible_store, 
            right_sidebar_visible_store,
            main_sidebar_visible_store,
            app_config} from "./app.js";     
    import Icon from './lib/icon.svelte';
    import {session, signin_href, signout_href} from '@humandialog/auth.svelte'
    import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte'
    import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte'
    
    let is_logged_in = false;
    let sign_in_href = '';
    let sign_out_href = '';

    $:{
        is_logged_in = $session.is_active;
        sign_in_href = $signin_href;
        sign_out_href = $signout_href;
        
    }

</script>


    <div class="px-0 w-10">
            <button
                class="h-16 px-0 flex justify-center items-center w-full hover:bg-orange-500"
                class:text-blue-300={$main_sidebar_visible_store == 'TOC'}
                on:click={()=> (toggle_sidebar('TOC'))}>
                
                <Icon size={6} component={FaBars}/>
            </button>
        
    </div>

    <div class="mt-auto h-auto items-center w-full">
        
            {#if !is_logged_in}
                <a  href={sign_in_href} class="h-16 px-0 flex justify-center items-center w-full hover:bg-orange-500">
                    <Icon size={6} component={FaSignInAlt}/>
                </a> 
            {:else}
                <a  href={sign_out_href} class="h-16 px-0 flex justify-center items-center w-full hover:bg-orange-500">
                    <Icon size={6} component={FaSignOutAlt}/>
                </a>
            {/if}
        
        
            {#if $dark_mode_store == ''}
            <button
                class="h-16 px-0 flex justify-center items-center w-full hover:bg-orange-500"
                on:click={()=> ($dark_mode_store = 'dark')}
                >
                <Icon size={6} component={FaMoon} />
            </button>
            {:else}
            <button
                class="h-16 px-0 flex justify-center items-center w-full hover:bg-orange-500"
                on:click={()=> ($dark_mode_store = '')}
                >
                <Icon size={6} component={FaSun} />
                
            </button>
            {/if}
        
            <button
                class="h-16 px-0 flex justify-center items-center w-full text-slate-200 hover:bg-orange-500"
                class:text-blue-300={$bottom_bar_visible_store}
                on:click={()=> ($bottom_bar_visible_store = !$bottom_bar_visible_store)}
                >

                <Icon size={6} component={FaEllipsisH} />
            </button>
        
    </div>

