<script>
    import {Table, TableColumn, Icon} from '@humandialog/forms.svelte'
    import {location} from 'svelte-spa-router'
    import {Auth, session} from '@humandialog/auth.svelte'
    import { Spinner } from "flowbite-svelte";
    import FaRegCheckCircle from 'svelte-icons/fa/FaRegCheckCircle.svelte'
    import FaRegCircle from 'svelte-icons/fa/FaRegCircle.svelte'

    let table;
    let my_tasks = null;

    $: load($session);

    async function load(...args)
    {
        if(!$session.is_active)
        {
            my_tasks = null;
            return;
        }

        try
        {
            let res = await Auth.fetch(`/json/yav1/user/query`,
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
                                                    Association: 'MyTasks',
                                                    Filter: 'IsFinished<>true',
                                                    ShowReferences: true,
                                                    SubTree:[
                                                        {
                                                            Id: 2,
                                                            Association: 'Responsible',
                                                            Expressions:['$ref', 'Name']
                                                        }
                                                    ]
                                                }
                                            ]
                                        })
                                });
            if(res.ok)
            {
                let content = await res.json();
                
                my_tasks = content.Task;
                table?.update_objects(my_tasks);
            }
            else
                my_tasks = null
        }
        catch(error)
        {
            my_tasks = null
            console.error(error);
        }
    }

    async function finish_task(event, task)
    {
        task.IsFinished = true;

        event.preventDefault();
        event.stopPropagation();

        table?.refresh();

        try
        {

            let res = await Auth.fetch(`/json/yav1/user/MyTasks/${task.Id}/setFinished`,
                                            {
                                                method: 'POST',
                                                body: JSON.stringify({value: task.IsFinished})
                                            });

            if(res.ok)
            {
                my_tasks = my_tasks.filter(t => t.Id != task.Id);
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


{#if my_tasks}
    <p class="mt-7"></p>
    
    <Table objects={my_tasks} bind:this={table}>
        <TableColumn size={5}/>
            <Icon   slot='c0' 
                    let:item 
                    size={4} 
                    component={(item.IsFinished) ? FaRegCheckCircle : FaRegCircle} 
                    on:click={async (event) => { await finish_task(event, item); }} 
                    class="cursor-pointer"/>

        <TableColumn field='Name' />
    </Table>
    
{:else}
    <Spinner/>
{/if}

