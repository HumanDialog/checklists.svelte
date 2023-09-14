<script>
    import FaMoon from 'svelte-icons/fa/FaMoon.svelte'
    import FaSun from 'svelte-icons/fa/FaSun.svelte'
    import FaHome from 'svelte-icons/fa/FaHome.svelte'
    import FaArchive from 'svelte-icons/fa/FaArchive.svelte'
    import FaBars from 'svelte-icons/fa/FaBars.svelte'
    import FaEllipsisH from 'svelte-icons/fa/FaEllipsisH.svelte'
    import FaTools from 'svelte-icons/fa/FaTools.svelte'
    import GoPrimitiveDot from 'svelte-icons/go/GoPrimitiveDot.svelte'
    import {
        dark_mode_store,
        toggle_sidebar,
        show_sidebar,
        hide_sidebar,
        tools_visible_store,
        bottom_bar_visible_store,
        right_sidebar_visible_store,
        main_sidebar_visible_store
    } from "./app.js";
    import {Icon} from '@humandialog/forms.svelte';
    import {session, signin_href, signout_href} from '@humandialog/auth.svelte'
    import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte'
    import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte'
    
    let is_logged_in = false;
    let sign_in_href = '';
    let sign_out_href = '';

    $:
    {
        is_logged_in = $session.is_active;
        sign_in_href = $signin_href;
        sign_out_href = $signout_href;
    }

</script>

<div class="mr-0 flex h-10">
    <button type="button" class=" w-16 h-full flex justify-center items-center  hover:bg-orange-500"
        class:text-blue-300={$main_sidebar_visible_store == 'TOC'}
        on:click={()=> (toggle_sidebar('TOC'))}>
        <Icon size={6} component={FaBars}/>
    </button>
</div>

<div class="ml-auto flex h-10">
    
    {#if !is_logged_in}
        <a  href={sign_in_href} class="h-full w-16 px-0 flex justify-center items-center   text-slate-100  hover:bg-orange-500">
            <Icon size={6} component={FaSignInAlt}/>
        </a> 
    {:else}
        <a  href={sign_out_href} class="h-full w-16 px-0 flex justify-center items-center   text-slate-100  hover:bg-orange-500">
            <Icon size={6} component={FaSignOutAlt}/>
        </a>
    {/if}
    

    {#if $dark_mode_store == ''}
    <button
        class="h-full w-16 px-0 flex justify-center items-center   text-slate-100  hover:bg-orange-500"
        on:click={()=> ($dark_mode_store = 'dark')}
        >
        <div class="w-6 h-6">
            <FaMoon />
        </div>
    </button>
    {:else}
    <button
        class="h-full w-16 px-0 flex justify-center items-center   text-slate-100 hover:bg-orange-500"
        on:click={()=> ($dark_mode_store = '')}
        >
        <div class="w-6 h-6">
            <FaSun />
        </div>
    </button>
    {/if}
    

    
    <button
        class="h-full w-16 px-0 flex justify-center items-center   text-slate-100  hover:bg-orange-500"
        class:text-blue-300={$bottom_bar_visible_store}
        on:click={()=> ($bottom_bar_visible_store = !$bottom_bar_visible_store)}
        >
        <div class="w-6 h-6">
            <FaEllipsisH />
        </div>
    </button>
    
</div>