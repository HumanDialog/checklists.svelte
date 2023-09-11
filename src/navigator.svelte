<script >
    import {
      Sidebar,
      SidebarGroup,
      SidebarItem,
      SidebarWrapper,
      Spinner
    } from "flowbite-svelte";
    import {
      auto_hide_sidebar
    } from "./app";
    import Icon from './lib/icon.svelte'
    import FaList from 'svelte-icons/fa/FaList.svelte'
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
    import FaTimes from 'svelte-icons/fa/FaTimes.svelte'
    import {Auth, session, Authorized} from '@humandialog/auth.svelte'
    import { onMount, afterUpdate } from "svelte";
    import {location, push} from 'svelte-spa-router'
    import Edit from './forms/components/edit.field.svelte'
    //import {all_lists} from './todo.config.js'
    
    let checklists = null;
    let just_have_completed_lists = false;
    
    //$: checklists = $all_lists;

    onMount(async () => {
        if(!$session.is_active)
            return;

        let res = await Auth.fetch("/json/yav1/app/Lists");
        if(res.ok)
        {
            let content = await res.json();
            checklists = content.Checklist;
            just_have_completed_lists = true;
        }
        else
            checklists = null;
    });

    afterUpdate(() => {
        
        if(!$session.is_active)
            return;

        if(just_have_completed_lists)
        {
            just_have_completed_lists = false;
            navigate_to_default_list_if_needed();
        }
    });
  
    async function add_list(list_name)
    {
        try
        {
            let res = await Auth.fetch("/json/yav1/app/Lists/new",
                                    {
                                        method:'POST',
                                        body: JSON.stringify({Name: list_name})
                                    });

            if(res.ok)
            {
                let obj = await res.json();
                obj = obj.Checklist[0];
                checklists = checklists.concat(obj);
            }
        }
        catch(err)
        {
            console.log(err);
        }

        return true;
    }

    async function delete_list(event, id)
    {
        event.preventDefault();
        event.stopPropagation();

        try
        {
            let res = await Auth.fetch("/json/yav1/app/Lists/"+id, { method:'DELETE' });
            if(res.ok)
            {
                checklists = checklists.filter(list => list.Id != id);
                if($location == "/checklist/"+id)
                {
                    if(checklists.length > 0)
                        push('/checklist/'+checklists[0].Id);
                    else
                        push('/');
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    function navigate_to_default_list_if_needed()
    {
        let a = $location.match(/(?<=checklist\/)\w+/i);
        if(!a)
        {
             if(checklists.length > 0)
                push('/checklist/'+ checklists[0].Id);
        }
    }

  </script>
  
  <Authorized>
    <Sidebar asideClass="w-full">
        <SidebarWrapper>
        
            {#if checklists}
            <SidebarGroup>
                <SidebarItem label="My Tasks" href="#/mytasks" on:click={ () => auto_hide_sidebar() } class="group">
                    <Icon size={5} component={FaList} slot="icon"/>
                </SidebarItem>
            </SidebarGroup>

            <SidebarGroup border>
                {#each checklists as list (list.Id)}
                <SidebarItem label={list.Name} href="#/checklist/{list.Id}" on:click={ () => auto_hide_sidebar() } class="group">
                    <Icon size={5} component={FaList} slot="icon"/>
                    <Icon size={3} component={FaTimes} slot="subtext" class="ml-auto text-gray-500 sm:invisible sm:group-hover:visible" on:click={async (event) => {await delete_list(event, list.Id)}}/>
                </SidebarItem>
                {/each }
                
                <Edit class="p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" on_enter={add_list} placeholder='New list' inserter={true}>
                    <Icon size={5} component={FaPlus} class="mr-3"/>
                </Edit>
            </SidebarGroup>
            
            {:else}
                <Spinner/>
            {/if}

        </SidebarWrapper>
    </Sidebar>
</Authorized>

