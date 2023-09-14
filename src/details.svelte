<script lang="ts">
    import {    Page, 
                Row, 
                Tile, 
                Box,
                Input,
                Combo,
                ComboItem,
                ComboSource} from '@humandialog/forms.svelte'
    
    import {Auth} from '@humandialog/auth.svelte'


    async function on_users_combo_source()
    {
        let res = await Auth.fetch(`json/yav1/app/Users?fields=$ref,Name`);
        if(res.ok)
        {
            let source = await res.json();
            return source;
        }
        else
            return null;
    }

    async function on_user_select(task, selected_key, selected_name)
    {
        const res = await Auth.fetch(`json/yav1/Task/${task.Id}/set`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                Responsible: {
                                    $ref: selected_key
                                }
                            })
                        });
        if(res.ok)
        {
            task.Responsible = {
                $ref: selected_key,
                Name: selected_name
            }
        }
    }

 </script>

<Page context=sel typename='Task' focused_only={true} cl="w-full h-full overflow-y-hidden  overflow-x-scroll py-0 px-1 border-0" >
    <Row cl="grid-cols-2 h-full max-h-full overflow-y-hidden" w="w-[calc(200vw)] sm:w-[calc(200vw-80px)] lg:w-[calc(100vw-40px)]" >
        <Tile cl="col-span-1 h-full max-h-full overflow-y-hidden">
            <Box  c=5>  
                <Input c=5 a="Name"/>
                <Combo c=2 a="Priority" icon={true}>
                    <ComboItem name='Urgent'   key={4}     color='rgb(200, 50, 50)' />
                    <ComboItem name='High'     key={3}     color='rgb(150, 100, 50)' />
                    <ComboItem name='Medium'   key={2}     color='rgb(100, 100, 100)' />
                    <ComboItem name='Low'      key={1}     color='rgb(50, 100, 100)' />
                    <ComboItem name='Never'    key={0}     color='rgb(50, 50, 150)' />
                </Combo>

                <Combo c=3 a="Responsible" icon={true} on_select={async (task, sel_key, sel_name) => {await on_user_select(task, sel_key, sel_name)}}>
                    <ComboSource on_collect={on_users_combo_source} key="$ref" name='Name'/>
                    
                </Combo>
            </Box>
        </Tile>
        <Tile cl="col-span-1 h-full max-h-full overflow-y-hidden">
            <Box c=1 fit={true}>
                <Input c=1 itype='html' a='Description' />
            </Box>
        </Tile>
    </Row>
</Page>