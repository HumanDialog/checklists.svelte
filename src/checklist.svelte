<script>
    import {Table, TableColumn, Icon, Edit} from '@humandialog/forms.svelte'
    import {location} from 'svelte-spa-router'
    import {Auth, session} from '@humandialog/auth.svelte'
    import { Spinner } from 'flowbite-svelte';
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
    import FaRegCheckCircle from 'svelte-icons/fa/FaRegCheckCircle.svelte'
    import FaRegCircle from 'svelte-icons/fa/FaRegCircle.svelte'

    let table;
    let current_list = null;

    $: on_params_changed($location);

    async function on_params_changed(...args)
    {
        table?.select_item(null, null);

        if(!$session.is_active)
        {
            return;
        }

        let a = $location.match(/(?<=checklist\/)\w+/i);
        let list_id = a ? a[0] : 'first';
        
        try
        {
            let res = await Auth.fetch(`/json/yav1/app/Lists/${list_id}/query`,
                                {
                                    method: 'POST',
                                    body: JSON.stringify(
                                        {
                                            Id: 1,
                                            Name: "collector",
                                            ExpandLevel: 3,
                                            Tree:
                                            [
                                                {
                                                    Id: 1,
                                                    Association: '',
                                                    SubTree:
                                                    [
                                                        {
                                                            Id: 2,
                                                            Association: 'Tasks',
                                                            Filter: 'IsFinished<>true',
                                                            ShowReferences: true,
                                                            SubTree:[
                                                                {
                                                                    Id: 3,
                                                                    Association: 'Responsible',
                                                                    Expressions:['$ref', 'Name']
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        })
                                });
            if(res.ok)
            {
                let content = await res.json();
                
                current_list = content.Checklist;
                table?.update_self(current_list);
            }
            else
                current_list = null
        }
        catch(error)
        {
            current_list = null
            console.error(error);
        }
    }

    async function on_new_task(new_task_name)
    {
        try
        {
            let res = await Auth.fetch(`/json/yav1/app/Lists/${current_list.Id}/Tasks/new`,
                                    {
                                        method: 'POST',
                                        body: JSON.stringify({Name: new_task_name})
                                    });
            if(res.ok)
            {
                let result_table = await res.json();
                let new_task = result_table.Task[0];
                if(!current_list.Tasks)
                    current_list.Tasks = [];
                    
                current_list.Tasks.push(new_task);

                table?.refresh();
            }
        }
        catch(error)
        {
            console.error(error);
        }

        return true;
    }

    async function finish_task(event, task)
    {
        task.IsFinished = true;

        event.preventDefault();
        event.stopPropagation();

        table?.refresh();

        try
        {

            let res = await Auth.fetch(`/json/yav1/app/Lists/${current_list.Id}/Tasks/${task.Id}/setFinished`,
                                            {
                                                method: 'POST',
                                                body: JSON.stringify({value: task.IsFinished})
                                            });

            if(res.ok)
            {
                current_list.Tasks = current_list.Tasks.filter(t => t.Id != task.Id);
                table?.refresh();
            }
        }
        catch(err)
        {
            console.error(err);
            task.IsFinished = false;
        }

        //refresh();
    }
</script>


{#if current_list}
    <p class="mt-7"></p>
    
    <Table self={current_list} collection='Tasks' bind:this={table}>
        <TableColumn size={5}/>
            <Icon   slot='c0' 
                    let:item 
                    size={4} 
                    component={(item.IsFinished) ? FaRegCheckCircle : FaRegCircle} 
                    on:click={async (event) => { await finish_task(event, item); }} 
                    class="cursor-pointer"/>

        <TableColumn field='Name' />
    </Table>

    <Edit class="py-1 text-sm font-normal text-gray-500 dark:text-gray-400 cursor-pointer" on_enter={on_new_task} placeholder='New task' inserter={true}>
        <Icon size={4} component={FaPlus} class="text-center ml-4 mt-0.5 mr-4"/>
    </Edit>

{:else}
    <Spinner/>
{/if}

