<script>
  import Router from 'svelte-spa-router'
  import Checklist from './checklist.svelte'
  import MyTasks from './mytasks.svelte'
  import Details from './details.svelte'
  import ListsNav from './navigator.svelte'  
  import HorizontalToolbar from './horizontal.toolbar.svelte'
  import VerticalToolbar from './vertical.toolbar.svelte'
  import {AuthorizedView, Authorized, NotAuthorized, signin_href, session} from '@humandialog/auth.svelte'
  import {Button} from 'flowbite-svelte';
  import Icon from './lib/icon.svelte'
  import FaUser from 'svelte-icons/fa/FaUser.svelte'

  import {  dark_mode_store, 
            main_sidebar_visible_store, 
            tools_visible_store, 
            bottom_bar_visible_store,
            auto_hide_sidebar} from "./app.js";


    let main_side_panel_visibility = "hidden"
    let lg_content_area_horizontal_dim = ""
    
    let visible_sidebar = "*"

    let tools_visible = false
    let bottom_bar_visible = false
    let lg_main_sidebar_height = ""
                                
    let content_top = ""
    let content_height = ""     
    
    $session.configure( {
                    mode: 'local',
                    remote: {
                        iss :       "https://objectreef.io/",
                        client_id : "<YOUR_REGISTERED_CLIENT_ID>",
                        client_secret : "<YOUR_REGISTERED_CLIENT_SECRET>",
                        scope :     "openid profile email <YOUR_DEPLOYED_APP_ID>"},
                    local: {
                        api:    "http://localhost:1996/",
                        users:
                        [
                            "alice@example.com",
                            "bob@example.com"
                        ]}
                   });

    
    $: { visible_sidebar = $main_sidebar_visible_store
        
        if(visible_sidebar == "*")
        {
            main_side_panel_visibility = "hidden"
            lg_content_area_horizontal_dim = ""
        }
        else
        {
            main_side_panel_visibility = "lg:block"
            lg_content_area_horizontal_dim = "lg:left-[360px] lg:w-[calc(100vw-360px)]"
        }      
    }

                         
    
    $: { tools_visible = $tools_visible_store
        bottom_bar_visible = $bottom_bar_visible_store

        if(tools_visible)
        {
            content_top = "top-20 sm:top-10"
            if(bottom_bar_visible)
                content_height = "h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)]"    
            else    
                content_height = "h-[calc(100vh-80px)] sm:h-[calc(100vh-40px)]" 
               
        }
        else
        {
            content_top = "top-10 sm:top-0"
            if(bottom_bar_visible)
                content_height = "h-[calc(100vh-280px)] sm:h-[calc(100vh-240px)]"           
            else
                content_height = "h-[calc(100vh-40px)] sm:h-screen"
        }
        
        lg_main_sidebar_height = bottom_bar_visible ? "lg:h-[calc(100vh-240px)]" : ""
        
    }
</script>

<AuthorizedView>
  <div class="{$dark_mode_store}">
    <div class="bg-white dark:bg-gray-900 dark:text-white min-h-screen h-screen">
      
      <Authorized>
        <header class="fixed sm:hidden w-screen top-0 h-[40px] z-50  overflow-auto shadow  shadow-slate-900/5 dark:shadow-none" >
          <div class=" flex flex-row justify-between    bg-slate-900   text-gray-100 ">
              <HorizontalToolbar/>
          <div>
        </header>   

        <div  class="hidden sm:block fixed left-0 top-0 w-[40px] h-screen z-20 inset-0 overflow-hidden">
          <div class="sticky top-0 flex h-full w-10 bg-slate-900 flex-col items-center text-gray-100 shadow">
              <VerticalToolbar />
          </div>    
        </div>

        <div  class="{main_side_panel_visibility} fixed left-0 top-10 w-screen h-[calc(100vh-40px)] z-10 overflow-x-hidden 
                      sm:left-10 sm:top-0 sm:w-[320px] sm:h-full
                      {lg_main_sidebar_height}" >

          <div class=" bg-slate-50 w-full h-full dark:bg-slate-800  overflow-y-auto  py-4 px-0 ">
              <ListsNav/>
          </div>
        </div>    

        <div  class="fixed left-0  w-screen  
                        sm:left-[40px]  sm:w-[calc(100vw-40px)]    
                        {content_top}
                        {content_height}
                        {lg_content_area_horizontal_dim}
                        z-0 overflow-x-hidden" 
                        
                        on:click={(event) => { auto_hide_sidebar()}} 
                        on:keydown={(event) => { auto_hide_sidebar()}}>
              <Router routes = {{
                      '/' : Checklist,
                      '/checklist': Checklist,
                      '/checklist/*': Checklist,
                      '/mytasks' : MyTasks
                  }} />
            
        </div> 

        <div  class="fixed left-0 bottom-0 w-screen h-[240px] z-10 overflow-y-hidden overflow-x-auto 
                    sm:left-[40px] sm:w-[100vw-40px]"
                    class:hidden={bottom_bar_visible} >
            <div class="h-full w-full">
              <Router routes = {{
                        '/':  Details,
                        '/checklist': Details,
                        '/checklist/*': Details,
                        '/mytasks' : Details
                    }} />
            </div>
        </div>
      </Authorized>

      <NotAuthorized>
        <div class="w-full h-full grid h-screen place-items-center">
            <Button href={$signin_href}>
                <Icon class="mr-2 -ml-1 w-5 h-5" component={FaUser} />
                Sign in
            </Button>
        </div>
    </NotAuthorized>

    </div>
  </div>
</AuthorizedView>